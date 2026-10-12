import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILocation extends Document {
  city: string;
  state: string;
  slug: string;
  serviceablePincodes: string[];
  localizedPhone: string;
  addressLine: string;
  latitude: number;
  longitude: number;
  landmarks: string[];
  activeTechnicians: number;
  averageRating: number;
  totalReviews: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>(
  {
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    serviceablePincodes: [{ type: String, required: true, index: true }],
    localizedPhone: { type: String, required: true },
    addressLine: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    landmarks: [{ type: String }],
    activeTechnicians: { type: Number, default: 8 },
    averageRating: { type: Number, default: 4.9 },
    totalReviews: { type: Number, default: 480 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Location: Model<ILocation> =
  mongoose.models.Location || mongoose.model<ILocation>('Location', LocationSchema);
