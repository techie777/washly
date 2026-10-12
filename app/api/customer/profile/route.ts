import { NextRequest, NextResponse } from 'next/server';
import { getCustomerBookings, updateCustomerProfile } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    const recentIdsParam = searchParams.get('recentIds');

    if (!phone && !recentIdsParam) {
      return NextResponse.json(
        { success: false, error: 'Phone number or booking ID is required' },
        { status: 400 }
      );
    }

    const cleanPhone = phone ? phone.replace(/\D/g, '').slice(-10) : '';
    const recentIds = recentIdsParam
      ? recentIdsParam.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean)
      : [];

    const bookings = await getCustomerBookings(cleanPhone, recentIds);

    const user = (global.inMemoryUsers || []).find(
      (u) => u.phone.replace(/\D/g, '').slice(-10) === cleanPhone
    );

    const resolvedName =
      user?.name ||
      bookings[0]?.customer?.name ||
      'Valued Customer';
    const resolvedEmail =
      user?.email ||
      bookings[0]?.customer?.email ||
      '';

    return NextResponse.json({
      success: true,
      profile: {
        name: resolvedName,
        phone: cleanPhone || bookings[0]?.customer?.phone?.replace(/\D/g, '').slice(-10) || '',
        email: resolvedEmail,
        pin: user?.pin || '1234',
        createdAt: user?.createdAt || new Date().toISOString(),
      },
      bookings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch customer profile' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, name, email } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const updated = await updateCustomerProfile(cleanPhone, { name, email });
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: updated,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
