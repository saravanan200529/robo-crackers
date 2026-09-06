import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateCustomersWorkbook, CustomerExportRow } from '@/lib/excel-export';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized — Admin session required' }, { status: 401 });
    }

    const customers = await db.customer.findMany({
      include: {
        enquiries: {
          select: { totalEstimate: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const exportRows: CustomerExportRow[] = customers.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      email: c.email || '',
      city: c.city || '',
      state: c.state || '',
      pincode: c.pincode || '',
      address: c.address || '',
      enquiriesCount: c.enquiries.length,
      totalEstimatedSpend: c.enquiries.reduce((acc, curr) => acc + Number(curr.totalEstimate), 0),
      createdAt: c.createdAt.toISOString().split('T')[0],
    }));

    const buffer = await generateCustomersWorkbook(exportRows);
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `robo-crackers-customers-${dateStr}.xlsx`;

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Customer excel export error:', error);
    return NextResponse.json({ error: 'Failed to generate Excel export' }, { status: 500 });
  }
}
