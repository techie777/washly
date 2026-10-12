import { NextRequest, NextResponse } from 'next/server';
import { getCompanySettings, updateCompanySettings } from '@/lib/db';

export async function GET() {
  try {
    const settings = getCompanySettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateCompanySettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
