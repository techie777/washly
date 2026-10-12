import { NextRequest, NextResponse } from 'next/server';
import { getAllSupportEnquiries, createSupportEnquiry, updateSupportEnquiryStatus } from '@/lib/db';

export async function GET() {
  try {
    const list = getAllSupportEnquiries();
    return NextResponse.json({ success: true, enquiries: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.customerName || !body.customerPhone || !body.message) {
      return NextResponse.json(
        { success: false, message: 'Customer name, phone, and message are required.' },
        { status: 400 }
      );
    }

    const item = createSupportEnquiry({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      bookingId: body.bookingId,
      subject: body.subject || 'Doorstep Service Enquiry',
      message: body.message,
    });

    return NextResponse.json({ success: true, enquiry: item });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ success: false, message: 'ID and status are required' }, { status: 400 });
    }

    const updated = updateSupportEnquiryStatus(body.id, body.status);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
