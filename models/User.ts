import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserAddress {
  label?: string;
  street: string;
  city: string;
  pincode: string;
  landmark?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface IUserVehicle {
  type: 'car' | 'bike';
  make: string;
  model: string;
  segment: string;
  plateNumber?: string;
}

export interface IUser extends Document {
  name: string;
  phone: string;
  pin?: string;
  email?: string;
  savedAddresses: IUserAddress[];
  vehiclesOwned: IUserVehicle[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IUserAddress>(
  {
    label: { type: String, default: 'Home' },
    street: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  { _id: false }
);

const VehicleSchema = new Schema<IUserVehicle>(
  {
    type: { type: String, enum: ['car', 'bike'], required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    segment: { type: String, required: true },
    plateNumber: { type: String },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, default: 'Doorstep Customer', trim: true },
    phone: { type: String, required: true, unique: true, index: true },
    pin: { type: String, default: '1234' },
    email: { type: String, lowercase: true, trim: true },
    savedAddresses: [AddressSchema],
    vehiclesOwned: [VehicleSchema],
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
