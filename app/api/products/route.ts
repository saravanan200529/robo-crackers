import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('categorySlug');
    const bestSeller = searchParams.get('bestSeller');
    const query = searchParams.get('q');
    const sort = searchParams.get('sort');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (bestSeller === 'true') {
      where.isBestSeller = true;
    }

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (categorySlug) {
      // Find category first to see if it has children
      const targetCategory = await db.category.findUnique({
        where: { slug: categorySlug },
        include: { children: { select: { id: true } } },
      });

      if (targetCategory) {
        if (targetCategory.children.length > 0) {
          const categoryIds = [targetCategory.id, ...targetCategory.children.map((c) => c.id)];
          where.categoryId = { in: categoryIds };
        } else {
          where.categoryId = targetCategory.id;
        }
      }
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'name_asc') {
      orderBy = { name: 'asc' };
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              parent: { select: { id: true, name: true, slug: true } },
            },
          },
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy,
        take: limit,
        skip: offset,
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      hasMore: offset + products.length < total,
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
