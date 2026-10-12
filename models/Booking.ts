import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
  bookingId: string;
  customerId?: mongoose.Types.ObjectId;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
  };
  vehicleDetails: {
    type: 'car' | 'bike';
    make: string;
    model: string;
    segment: string;
    plateNumber?: string;
    fuelType?: string;
  };
  serviceId: string;
  serviceName: string;
  selectedAddOns: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  scheduledDate: string;
  timeSlot: string;
  address: {
    street: string;
    city: string;
    pincode: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
  };
  status: 'pending' | 'confirmed' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
  paymentMethod: 'cod' | 'razorpay_mock' | 'upi_mock';
  paymentStatus: 'pending' | 'paid';
  baseAmount: number;
  addOnAmount: number;
  totalAmount: number;
  notes?: string;
  assignedTechnician?: {
    name: string;
    phone: string;
    vehicleNo: string;
    rating?: number;
  };
  rating?: number;
  reviewComment?: string;
  ratedAt?: Date;
  hasWaterElectricity?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User' },
    customerInfo: {
      name: { type: String, required: true },
      phone: { type: String, required: true, index: true },
      email: { type: String },
    },
    vehicleDetails: {
      type: { type: String, enum: ['car', 'bike'], required: true },
      make: { type: String, required: true },
      model: { type: String, required: true },
      segment: { type: String, required: true },
      plateNumber: { type: String },
      fuelType: { type: String },
    },
    serviceId: { type: String, required: true },
    serviceName: { type: String, required: true },
    selectedAddOns: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    scheduledDate: { type: String, required: true, index: true },
    timeSlot: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true, index: true },
      pincode: { type: String, required: true, index: true },
      landmark: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'en_route', 'arrived', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'razorpay_mock', 'upi_mock'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    baseAmount: { type: Number, required: true },
    addOnAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    notes: { type: String },
    assignedTechnician: {
      name: { type: String },
      phone: { type: String },
      vehicleNo: { type: String },
      rating: { type: Number, default: 4.9 },
    },
    rating: { type: Number },
    reviewComment: { type: String },
    ratedAt: { type: Date },
    hasWaterElectricity: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
