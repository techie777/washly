import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IService extends Document {
  name: string;
  slug: string;
  category: 'car' | 'bike';
  tagline: string;
  description: string;
  durationMinutes: number;
  vehiclePricing: Map<string, number>;
  includedTasks: string[];
  addOnIds: string[];
  badge?: string;
  popular: boolean;
  recommendedFor?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, enum: ['car', 'bike'], required: true, index: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    vehiclePricing: {
      type: Map,
      of: Number,
      required: true,
    },
    includedTasks: [{ type: String, required: true }],
    addOnIds: [{ type: String }],
    badge: { type: String },
    popular: { type: Boolean, default: false },
    recommendedFor: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
