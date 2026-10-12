import { NextRequest, NextResponse } from 'next/server';
import { getAllServices, updateServicePackage } from '@/lib/db';

export async function GET() {
  try {
    const services = getAllServices();
    return NextResponse.json({ success: true, services });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.id) {
      return NextResponse.json(
        { success: false, message: 'Service package ID is required' },
        { status: 400 }
      );
    }

    const updated = updateServicePackage(body);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Service package not found' },
        { status: 404 }
      );
    }

    const allServices = getAllServices();
    return NextResponse.json({ 
      success: true, 
      message: 'Service package updated successfully', 
      service: updated,
      services: allServices
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update service' },
      { status: 500 }
    );
  }
}
