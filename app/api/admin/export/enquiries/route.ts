import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateEnquiriesWorkbook, EnquiryExportRow } from '@/lib/excel-export';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized — Admin session required' }, { status: 401 });
    }

    const enquiries = await db.enquiry.findMany({
      include: {
        customer: true,
        items: {
          include: {
            product: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const exportRows: EnquiryExportRow[] = enquiries.map((e) => {
      const itemsSummary = e.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ');
      return {
        id: e.id,
        quoteRef: `ROBO-${e.id.slice(-6).toUpperCase()}`,
        customerName: e.customer.name,
        phone: e.customer.phone,
        city: e.customer.city || '',
        state: e.customer.state || '',
        itemsSummary,
        totalEstimate: Number(e.totalEstimate),
        status: e.status,
        createdAt: e.createdAt.toISOString().split('T')[0],
      };
    });

    const buffer = await generateEnquiriesWorkbook(exportRows);
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `robo-crackers-enquiries-${dateStr}.xlsx`;

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Enquiry excel export error:', error);
    return NextResponse.json({ error: 'Failed to generate Excel export' }, { status: 500 });
  }
}
