import { NextRequest, NextResponse } from 'next/server';
import { getBookingById, updateBookingStatus, submitBookingRating } from '@/lib/db';
import { BookingStatus } from '@/types';

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const booking = await getBookingById(id);

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, rating, comment, reviewComment } = body;

    let updated = null;

    if (rating !== undefined) {
      updated = await submitBookingRating(id, Number(rating), comment || reviewComment || '');
    }

    if (status) {
      updated = await updateBookingStatus(id, status as BookingStatus);
    }

    if (!status && rating === undefined && !comment && !reviewComment) {
      return NextResponse.json(
        { success: false, message: 'Status or rating information is required' },
        { status: 400 }
      );
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Booking not found to update' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: rating !== undefined ? 'Rating and review submitted successfully' : `Booking updated to ${status}`,
      booking: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update booking' },
      { status: 500 }
    );
  }
}
