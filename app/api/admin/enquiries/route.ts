import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { EnquiryStatus } from '@prisma/client';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized — Admin session required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as EnquiryStatus | null;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const offset = (page - 1) * limit;

    const where: any = {};
    if (status && Object.values(EnquiryStatus).includes(status)) {
      where.status = status;
    }

    const [enquiries, total] = await Promise.all([
      db.enquiry.findMany({
        where,
        include: {
          customer: true,
          items: {
            include: {
              product: { select: { id: true, name: true, sku: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.enquiry.count({ where }),
    ]);

    return NextResponse.json({
      enquiries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Admin enquiries fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized — Admin session required' }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, notes } = body;


    if (!id || !status) {
      return NextResponse.json({ error: 'ID and Status are required' }, { status: 400 });
    }

    const updated = await db.enquiry.update({
      where: { id },
      data: {
        status,
        ...(notes !== undefined ? { notes } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Admin update enquiry error:', error);
    return NextResponse.json({ error: 'Failed to update enquiry status' }, { status: 500 });
  }
}
