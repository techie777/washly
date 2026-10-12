import { NextResponse } from 'next/server';
import { getAllLocations } from '@/lib/db';

export async function GET() {
  try {
    const locations = getAllLocations();
    return NextResponse.json({ success: true, locations });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}
