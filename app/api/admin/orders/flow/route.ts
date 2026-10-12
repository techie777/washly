import { NextRequest, NextResponse } from 'next/server';
import { 
  acceptAndConfirmBooking, 
  assignJrAdminToBooking, 
  advanceBookingFlow,
  getBookingById 
} from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, bookingId, jrAdminId, otp, paymentVia, collectedBy } = body;

    if (!action || !bookingId) {
      return NextResponse.json(
        { success: false, message: 'Action and bookingId are required.' },
        { status: 400 }
      );
    }

    // Action 1: Accept / Confirm order
    if (action === 'accept') {
      const updated = await acceptAndConfirmBooking(bookingId);
      if (!updated) {
        return NextResponse.json({ success: false, message: 'Booking not found.' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `Order #${bookingId} confirmed successfully! Ready to assign Wash Expert.`,
        booking: updated,
      });
    }

    // Action 2: Assign Jr Admin (Wash Expert)
    if (action === 'assign') {
      if (!jrAdminId) {
        return NextResponse.json(
          { success: false, message: 'Please select a Jr Admin to assign.' },
          { status: 400 }
        );
      }
      const res = await assignJrAdminToBooking(bookingId, jrAdminId);
      if (!res) {
        return NextResponse.json(
          { success: false, message: 'Booking or Jr Admin not found.' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: `Assigned ${res.jrAdmin.name} (${res.jrAdmin.vehicleNo}) to Booking #${bookingId}. Customer notified via SMS/WhatsApp with technician details and OTP!`,
        booking: res.booking,
        jrAdmin: res.jrAdmin,
      });
    }

    // Action 3, 4, 5, 6: Field transitions handled by advanceBookingFlow
    if (['on_my_way', 'arrived', 'verify_otp', 'complete_wash'].includes(action)) {
      const flowRes = await advanceBookingFlow(bookingId, action as any, {
        otp,
        paymentVia,
        collectedBy,
      });

      if (!flowRes.success) {
        return NextResponse.json(
          { success: false, message: flowRes.message },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: flowRes.message,
        booking: flowRes.booking,
      });
    }

    return NextResponse.json(
      { success: false, message: `Unknown action '${action}'` },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error in order flow' },
      { status: 500 }
    );
  }
}
