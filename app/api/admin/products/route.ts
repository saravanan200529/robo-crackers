import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { productSchema } from '@/lib/validators/product.schema';
import { auth } from '@/lib/auth';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized — Admin session required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const categoryId = searchParams.get('categoryId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;

    const where: any = {};
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { sku: { contains: query, mode: 'insensitive' } },
      ];
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true } },
          _count: { select: { enquiryItems: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Admin products fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized — Admin session required' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const { name, categoryId, price, mrp, discountPct, description, stockNote, isBestSeller, isActive, sku, images } =
      parsed.data;

    const baseSlug = slugify(name);
    let slug = baseSlug;

    const calculatedDiscount = discountPct ?? Math.round(((mrp - price) / mrp) * 100);

    // Resolve unique slug (collision-safe)
    let count = 1;
    while (await db.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        sku: sku || `SKU-${slug.toUpperCase().slice(0, 15)}`,
        categoryId,
        price,
        mrp,
        discountPct: calculatedDiscount,
        description: description || null,
        stockNote: stockNote || null,
        isBestSeller,
        isActive,
        images:
          images && images.length > 0
            ? {
                create: images.map((img, idx) => ({
                  url: img.url,
                  altText: img.altText || name,
                  sortOrder: img.sortOrder ?? idx,
                })),
              }
            : undefined,
      },
      include: {
        images: true,
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Admin create product error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create product' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized — Admin session required' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    if (data.price && data.mrp && !data.discountPct) {
      data.discountPct = Math.round(((data.mrp - data.price) / data.mrp) * 100);
    }

    const updated = await db.product.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Admin update product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized — Admin session required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await db.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin delete product error:', error);
    return NextResponse.json({ error: 'Failed to deactivate product' }, { status: 500 });
  }
}

