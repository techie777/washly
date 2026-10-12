import { NextRequest, NextResponse } from 'next/server';
import { changeAdminPassword } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Current password and new password are required.' },
        { status: 400 }
      );
    }

    const result = changeAdminPassword(currentPassword, newPassword);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error changing password' },
      { status: 500 }
    );
  }
}
