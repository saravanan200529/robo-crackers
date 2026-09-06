import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized — Admin session required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const offset = (page - 1) * limit;

    const where: any = {};
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      db.customer.findMany({
        where,
        include: {
          enquiries: {
            select: { id: true, totalEstimate: true, status: true, createdAt: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.customer.count({ where }),
    ]);

    const formatted = customers.map((c) => {
      const totalEstimatedSpend = c.enquiries.reduce((acc, curr) => acc + Number(curr.totalEstimate), 0);
      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        city: c.city,
        state: c.state,
        pincode: c.pincode,
        address: c.address,
        enquiriesCount: c.enquiries.length,
        totalEstimatedSpend,
        createdAt: c.createdAt.toISOString().split('T')[0],
      };
    });

    return NextResponse.json({
      customers: formatted,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Admin customers fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
