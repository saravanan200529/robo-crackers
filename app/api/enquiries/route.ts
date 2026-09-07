import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { enquiryRatelimit } from '@/lib/redis';
import { enquirySubmissionSchema } from '@/lib/validators/enquiry.schema';
import { buildWhatsAppEnquiryUrl } from '@/lib/whatsapp';
import { resolveServerQuoteItems, getSiteSettings } from '@/lib/catalog-service';

export async function POST(req: NextRequest) {
  try {
    // 1. Enforce Rate Limiting (5 requests per minute per IP)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const rateCheck = await enquiryRatelimit.limit(ip);

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: 'Too many quote requests. Please wait a moment before trying again.',
          resetSeconds: rateCheck.reset,
        },
        { status: 429 }
      );
    }

    // 2. Validate payload schema
    const body = await req.json();
    const parsed = enquirySubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, phone, email, address, city, state, pincode, notes, items } = parsed.data;

    // 3. Authoritative Server-Side Price & MRP Resolution (Never trust client prices)
    const { resolvedItems, totalEstimate, totalMrp, totalSavings } = await resolveServerQuoteItems(items);

    if (resolvedItems.length === 0) {
      return NextResponse.json(
        { error: 'None of the requested products are currently available in the active catalog.' },
        { status: 400 }
      );
    }

    // 4. Fetch dynamic site settings
    const siteSettings = await getSiteSettings();

    let enquiryId = `offline-${Date.now()}`;

    try {
      // 5. Upsert Customer by Phone
      const customer = await db.customer.upsert({
        where: { phone },
        update: {
          name,
          email: email || null,
          address: address || null,
          city: city || null,
          state: state || null,
          pincode: pincode || null,
        },
        create: {
          name,
          phone,
          email: email || null,
          address: address || null,
          city: city || null,
          state: state || null,
          pincode: pincode || null,
        },
      });

      // 6. Create Enquiry with EnquiryItems in a transaction
      const enquiry = await db.enquiry.create({
        data: {
          customerId: customer.id,
          totalEstimate,
          notes: notes || null,
          status: 'PENDING',
          items: {
            create: resolvedItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtTime: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });
      enquiryId = enquiry.id;
    } catch (dbError) {
      console.warn('Database temporarily offline during enquiry creation, continuing with WhatsApp quote generation:', dbError);
    }

    // 7. Generate WhatsApp deep-link using resolved items and official WhatsApp number
    const whatsappUrl = buildWhatsAppEnquiryUrl(
      {
        enquiryId,
        customerName: name,
        phone,
        city,
        state,
        address,
        items: resolvedItems.map((i) => ({
          name: i.productName,
          quantity: i.quantity,
          price: i.price,
          mrp: i.mrp,
        })),
        totalEstimate,
        notes,
      },
      siteSettings.whatsappNumber || '919629659379'
    );

    // Save generated WhatsApp link to the enquiry record if DB is accessible
    try {
      await db.enquiry.update({
        where: { id: enquiryId },
        data: { whatsappUrl },
      });
    } catch {
      // Ignore if DB is offline
    }

    const quoteRef = enquiryId.slice(-6).toUpperCase();

    return NextResponse.json({
      success: true,
      enquiryId,
      quoteRef: `ROBO-${quoteRef}`,
      whatsappUrl,
      customerName: name,
      totalEstimate,
      totalMrp,
      totalSavings,
      minOrderValue: siteSettings.minOrderValue,
      items: resolvedItems,
    });
  } catch (error: unknown) {
    console.error('Enquiry submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your quote request.' },
      { status: 500 }
    );
  }
}

