import { NextRequest, NextResponse } from 'next/server';
import { getAllJrAdmins, createJrAdmin, updateJrAdmin, deleteJrAdmin, updateJrAdminPin } from '@/lib/db';

export async function GET() {
  try {
    const list = getAllJrAdmins();
    return NextResponse.json({ success: true, jrAdmins: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.phone || !body.vehicleNo) {
      return NextResponse.json(
        { success: false, message: 'Name, WhatsApp Phone, and Vehicle Number are required.' },
        { status: 400 }
      );
    }

    const created = createJrAdmin({
      name: body.name,
      username: body.username,
      phone: body.phone,
      email: body.email || '',
      vehicleNo: body.vehicleNo,
      pin: body.pin || '1234',
      password: body.password || body.pin || '1234',
    });

    return NextResponse.json({ success: true, jrAdmin: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, message: 'Jr Admin ID required' }, { status: 400 });
    }

    // Check if updating PIN/password specifically
    if (body.pin || body.password) {
      updateJrAdminPin(body.id, body.pin || body.password, body.password || body.pin);
    }

    const updated = updateJrAdmin(body.id, body.updates || body);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Jr Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, jrAdmin: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return PATCH(req);
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Jr Admin ID required.' }, { status: 400 });
    }

    const deleted = deleteJrAdmin(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Jr Admin not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Jr Admin account deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
