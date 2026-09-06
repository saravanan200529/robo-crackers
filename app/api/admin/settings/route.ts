import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    let settings = await db.siteSetting.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await db.siteSetting.create({
        data: { id: 'default' },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to get site settings:', error);
    return NextResponse.json({ error: 'Failed to get site settings' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized — Admin session required' }, { status: 401 });
    }

    const body = await req.json();

    const updated = await db.siteSetting.upsert({
      where: { id: 'default' },
      update: body,
      create: {
        id: 'default',
        ...body,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update site settings:', error);
    return NextResponse.json({ error: 'Failed to update site settings' }, { status: 500 });
  }
}

