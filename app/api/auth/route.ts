import { NextRequest, NextResponse } from 'next/server';
import { authenticateOrRegisterCustomer } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, pin, name, email } = body;

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        { success: false, error: 'WhatsApp number is required.' },
        { status: 400 }
      );
    }

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json(
        { success: false, error: '4-digit secret PIN is required.' },
        { status: 400 }
      );
    }

    const result = await authenticateOrRegisterCustomer(phone, pin, name, email);

    if ('error' in result) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      isNew: result.isNew,
      message: result.isNew
        ? 'Account successfully created and logged in!'
        : 'Welcome back! Logged in successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
