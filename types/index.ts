export type VehicleType = 'car' | 'bike';

export type VehicleSegment = 
  | 'hatchback' 
  | 'sedan' 
  | 'compact_suv' 
  | 'suv' 
  | 'luxury' 
  | 'commuter' 
  | 'sports_superbike';

export interface VehicleDetails {
  type: VehicleType;
  make: string;
  model: string;
  segment: VehicleSegment;
  plateNumber?: string;
  fuelType?: 'petrol' | 'diesel' | 'electric' | 'hybrid';
}

export interface ServicePackage {
  id: string;
  name: string;
  slug: string;
  category: VehicleType;
  tagline: string;
  description: string;
  durationMinutes: number;
  vehiclePricing: Record<VehicleSegment, number>;
  includedTasks: string[];
  popular?: boolean;
  recommendedFor?: string;
  badge?: string;
  rating?: number;
  reviewsCount?: number;
}

export interface AddOnItem {
  id: string;
  name: string;
  description: string;
  price: number;
  iconName: string;
  durationMinutes: number;
}

export interface LocationCity {
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
}

export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'en_route' 
  | 'arrived'
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export interface CustomerContact {
  name: string;
  phone: string;
  email: string;
}

export interface ServiceAddress {
  street: string;
  city: string;
  pincode: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
}

export interface TechnicianInfo {
  id?: string;
  name: string;
  phone: string;
  vehicleNo: string;
  rating: number;
  photo?: string;
}

export interface Booking {
  _id?: string;
  bookingId: string;
  customer: CustomerContact;
  vehicle: VehicleDetails;
  service: ServicePackage;
  selectedAddOns: AddOnItem[];
  scheduledDate: string;
  timeSlot: string;
  address: ServiceAddress;
  status: BookingStatus;
  paymentMethod: 'cod' | 'razorpay_mock' | 'upi_mock';
  paymentStatus: 'pending' | 'paid';
  totalAmount: number;
  notes?: string;
  createdAt: string;
  assignedTechnician?: TechnicianInfo;
  startOtp?: string;
  paymentCollectedBy?: string;
  paymentCollectedVia?: 'cash' | 'company_qr';
  customerNotified?: boolean;
  acceptedAt?: string;
  assignedAt?: string;
  completedAt?: string;
  rating?: number;
  reviewComment?: string;
  ratedAt?: string;
  hasWaterElectricity?: boolean;
}

export interface CustomerProfile {
  name: string;
  phone: string;
  pin: string;
  email?: string;
  createdAt?: string;
}

export interface JrAdmin {
  id: string;
  name: string;
  username?: string;
  phone: string;
  email?: string;
  vehicleNo: string;
  rating: number;
  status: 'active' | 'busy' | 'offline';
  totalJobs: number;
  pin?: string;
  password?: string;
  joinedDate?: string;
  activeBookingId?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  targetRole?: 'customer' | 'admin' | 'jr_admin';
  bookingId?: string;
}

export interface SupportEnquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  bookingId?: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  createdAt: string;
}

export interface CompanySettings {
  companyName: string;
  operatingCity: string;
  supportPhone: string;
  supportWhatsapp: string;
  upiId: string;
  upiName: string;
  businessHours: string;
  noticeText?: string;
}
