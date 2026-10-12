import { NextRequest, NextResponse } from 'next/server';
import { getAllBookings, createBooking } from '@/lib/db';
import { z } from 'zod';

const BookingCreateSchema = z.object({
  customer: z.object({
    name: z.string().min(2, 'Name is required'),
    phone: z.string().min(8, 'Valid phone is required'),
    email: z.string().email().optional().or(z.literal('')),
  }),
  vehicle: z.object({
    type: z.enum(['car', 'bike']),
    make: z.string().min(1),
    model: z.string().min(1),
    segment: z.string().min(1),
    plateNumber: z.string().optional(),
    fuelType: z.string().optional(),
  }),
  service: z.object({
    id: z.string(),
    name: z.string(),
  }),
  selectedAddOns: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
    })
  ).default([]),
  scheduledDate: z.string(),
  timeSlot: z.string(),
  address: z.object({
    street: z.string().min(5),
    city: z.string().min(2),
    pincode: z.string().length(6),
    landmark: z.string().optional(),
  }),
  status: z.enum(['pending', 'confirmed', 'en_route', 'arrived', 'in_progress', 'completed', 'cancelled']).default('pending'),
  paymentMethod: z.enum(['cod', 'razorpay_mock', 'upi_mock']),
  paymentStatus: z.enum(['pending', 'paid']).default('pending'),
  totalAmount: z.number().positive(),
  notes: z.string().optional(),
  hasWaterElectricity: z.boolean().optional(),
});

export async function GET() {
  try {
    const bookings = await getAllBookings();
    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = BookingCreateSchema.parse(body);

    const newBooking = await createBooking(validatedData as any);

    return NextResponse.json({
      success: true,
      message: 'Booking successfully reserved',
      booking: newBooking,
    }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
