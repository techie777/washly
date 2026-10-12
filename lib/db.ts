import mongoose from 'mongoose';
import { 
  Booking, 
  BookingStatus, 
  ServicePackage, 
  LocationCity, 
  CustomerProfile,
  JrAdmin,
  SupportEnquiry,
  CompanySettings
} from '@/types';
import { 
  LUXURY_SERVICES, 
  SERVICEABLE_CITIES, 
  INITIAL_ACTIVE_BOOKINGS 
} from '@/lib/seedData';
import { Booking as BookingModel } from '@/models/Booking';

const MONGODB_URI = process.env.MONGODB_URI || '';

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
  // eslint-disable-next-line no-var
  var inMemoryBookings: Booking[] | undefined;
  // eslint-disable-next-line no-var
  var inMemoryServices: ServicePackage[] | undefined;
  // eslint-disable-next-line no-var
  var inMemoryUsers: CustomerProfile[] | undefined;
  // eslint-disable-next-line no-var
  var inMemoryJrAdmins: JrAdmin[] | undefined;
  // eslint-disable-next-line no-var
  var inMemorySupportEnquiries: SupportEnquiry[] | undefined;
  // eslint-disable-next-line no-var
  var inMemorySettings: CompanySettings | undefined;
  // eslint-disable-next-line no-var
  var inMemoryAdminPassword: string | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

// In-memory store fallback for demo & zero-config local testing
if (!global.inMemoryBookings) {
  global.inMemoryBookings = [...INITIAL_ACTIVE_BOOKINGS];
}
if (!global.inMemoryServices) {
  global.inMemoryServices = JSON.parse(JSON.stringify(LUXURY_SERVICES));
}
if (!global.inMemoryUsers) {
  global.inMemoryUsers = [
    {
      name: 'Amit Patel',
      phone: '9820048822',
      pin: '1234',
      email: 'amit@example.com',
      createdAt: new Date().toISOString(),
    },
    {
      name: 'Rahul Sharma',
      phone: '9685232340',
      pin: '1234',
      email: 'rahul@example.com',
      createdAt: new Date().toISOString(),
    },
  ];
}
if (!global.inMemoryJrAdmins) {
  global.inMemoryJrAdmins = [
    {
      id: 'jr-1',
      name: 'Devraj Chauhan',
      username: 'devraj_wash',
      phone: '9685232340',
      email: 'devraj@doorstepwash.in',
      vehicleNo: 'MP 09 AB 7890 (Indore Mobile Unit 1)',
      rating: 4.97,
      status: 'active',
      totalJobs: 142,
      pin: '1234',
      password: '1234',
      joinedDate: '2025-01-10',
      activeBookingId: 'IND-9011',
    },
    {
      id: 'jr-2',
      name: 'Rajesh Solanki',
      username: 'rajesh_wash',
      phone: '9820048822',
      email: 'rajesh@doorstepwash.in',
      vehicleNo: 'MP 09 CZ 1122 (Indore Mobile Unit 2)',
      rating: 4.92,
      status: 'active',
      totalJobs: 98,
      pin: '1234',
      password: '1234',
      joinedDate: '2025-03-15',
    },
    {
      id: 'jr-3',
      name: 'Vicky Verma',
      username: 'vicky_wash',
      phone: '9755512345',
      email: 'vicky@doorstepwash.in',
      vehicleNo: 'MP 09 KL 4455 (Indore Mobile Unit 3)',
      rating: 4.88,
      status: 'active',
      totalJobs: 64,
      pin: '1234',
      password: '1234',
      joinedDate: '2025-06-20',
    },
  ];
}
if (!global.inMemorySupportEnquiries) {
  global.inMemorySupportEnquiries = [
    {
      id: 'sup-101',
      customerName: 'Aditya Malviya',
      customerPhone: '9685232340',
      bookingId: 'IND-9011',
      subject: 'Doorstep entry instructions',
      message: 'Gate security requires vehicle pass. Please inform Devraj Chauhan before reaching.',
      status: 'open',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sup-102',
      customerName: 'Sunita Sharma',
      customerPhone: '9826012345',
      subject: 'Inquiry about Sunday slots in Vijay Nagar',
      message: 'Do you have morning 9 AM slot available this Sunday for Tata Harrier?',
      status: 'resolved',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}
if (!global.inMemorySettings) {
  global.inMemorySettings = {
    companyName: 'डोरस्टेप कार वॉश (Doorstep Car Wash Indore)',
    operatingCity: 'Indore',
    supportPhone: '+91 96852 32340',
    supportWhatsapp: '9685232340',
    upiId: 'doorstepwash@upi',
    upiName: 'Doorstep Car Wash Indore Pvt Ltd',
    businessHours: '07:00 AM - 08:00 PM (Everyday)',
    noticeText: '100% शुद्ध आरओ पानी व मोबाइल जनरेटर सुविधा हर वॉश में शामिल।',
  };
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      return m;
    }).catch((err) => {
      console.warn('MongoDB connection failed, using in-memory store:', err.message);
      return null as unknown as typeof mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.warn('MongoDB connection error, falling back to local memory store.', e);
  }

  return cached.conn;
}

// Unified repository methods with auto-fallback
export async function getAllBookings(): Promise<Booking[]> {
  const db = await connectToDatabase();
  if (db && mongoose.connection.readyState === 1) {
    try {
      const docs = await BookingModel.find().sort({ createdAt: -1 }).lean();
      if (docs && docs.length > 0) {
        return docs.map((doc: any) => ({
          bookingId: doc.bookingId,
          customer: doc.customerInfo,
          vehicle: doc.vehicleDetails,
          service: LUXURY_SERVICES.find(s => s.id === doc.serviceId) || {
            id: doc.serviceId,
            name: doc.serviceName,
            slug: 'service',
            category: doc.vehicleDetails.type,
            tagline: '',
            description: '',
            durationMinutes: 60,
            vehiclePricing: {} as any,
            includedTasks: [],
          },
          selectedAddOns: doc.selectedAddOns || [],
          scheduledDate: doc.scheduledDate,
          timeSlot: doc.timeSlot,
          address: doc.address,
          status: doc.status,
          paymentMethod: doc.paymentMethod,
          paymentStatus: doc.paymentStatus,
          totalAmount: doc.totalAmount,
          notes: doc.notes,
          createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
          assignedTechnician: doc.assignedTechnician,
        }));
      }
    } catch (err) {
      console.warn('Error reading from MongoDB, falling back to in-memory store:', err);
    }
  }

  return global.inMemoryBookings || INITIAL_ACTIVE_BOOKINGS;
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const db = await connectToDatabase();
  if (db && mongoose.connection.readyState === 1) {
    try {
      const doc = await BookingModel.findOne({ bookingId }).lean() as any;
      if (doc) {
        return {
          bookingId: doc.bookingId,
          customer: doc.customerInfo,
          vehicle: doc.vehicleDetails,
          service: LUXURY_SERVICES.find(s => s.id === doc.serviceId) || {
            id: doc.serviceId,
            name: doc.serviceName,
            slug: 'service',
            category: doc.vehicleDetails.type,
            tagline: '',
            description: '',
            durationMinutes: 60,
            vehiclePricing: {} as any,
            includedTasks: [],
          },
          selectedAddOns: doc.selectedAddOns || [],
          scheduledDate: doc.scheduledDate,
          timeSlot: doc.timeSlot,
          address: doc.address,
          status: doc.status,
          paymentMethod: doc.paymentMethod,
          paymentStatus: doc.paymentStatus,
          totalAmount: doc.totalAmount,
          notes: doc.notes,
          createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
          assignedTechnician: doc.assignedTechnician,
        };
      }
    } catch (err) {
      console.warn('Error querying booking in MongoDB:', err);
    }
  }

  const inMem = global.inMemoryBookings || [];
  let found = inMem.find(
    (b) => b.bookingId.toLowerCase() === bookingId.toLowerCase()
  );

  if (!found) {
    found = INITIAL_ACTIVE_BOOKINGS.find(
      (b) => b.bookingId.toLowerCase() === bookingId.toLowerCase()
    );
  }

  // Alias support for demo IDs
  if (!found) {
    const cleanId = bookingId.trim().toUpperCase();
    if (cleanId === 'WSH-89241' || cleanId === 'VEL-89241' || cleanId === 'CW-1021') {
      found = inMem.find(b => b.bookingId === 'WSH-89241' || b.bookingId === 'VEL-89241' || b.bookingId === 'CW-1021') || INITIAL_ACTIVE_BOOKINGS[0];
    } else if (cleanId === 'WSH-89242' || cleanId === 'VEL-89242' || cleanId === 'CW-1022') {
      found = inMem.find(b => b.bookingId === 'WSH-89242' || b.bookingId === 'VEL-89242' || b.bookingId === 'CW-1022') || INITIAL_ACTIVE_BOOKINGS[1];
    }
  }

  return found || null;
}

export async function createBooking(data: Omit<Booking, 'bookingId' | 'createdAt'>): Promise<Booking> {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const newBookingId = `WSH-${randomSuffix}`;
  const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

  const cleanPhone = (data.customer?.phone || '').replace(/\D/g, '').slice(-10);

  const fullBooking: Booking = {
    ...data,
    customer: {
      ...data.customer,
      phone: cleanPhone || data.customer?.phone || '',
    },
    bookingId: newBookingId,
    createdAt: new Date().toISOString(),
    status: data.status || 'confirmed',
    startOtp: generatedOtp,
  };

  const db = await connectToDatabase();
  if (db && mongoose.connection.readyState === 1) {
    try {
      await BookingModel.create({
        bookingId: newBookingId,
        customerInfo: fullBooking.customer,
        vehicleDetails: fullBooking.vehicle,
        serviceId: fullBooking.service.id,
        serviceName: fullBooking.service.name,
        selectedAddOns: fullBooking.selectedAddOns,
        scheduledDate: fullBooking.scheduledDate,
        timeSlot: fullBooking.timeSlot,
        address: fullBooking.address,
        status: fullBooking.status,
        paymentMethod: fullBooking.paymentMethod,
        paymentStatus: fullBooking.paymentStatus,
        baseAmount: fullBooking.totalAmount - (fullBooking.selectedAddOns.reduce((acc, a) => acc + a.price, 0)),
        addOnAmount: fullBooking.selectedAddOns.reduce((acc, a) => acc + a.price, 0),
        totalAmount: fullBooking.totalAmount,
        notes: fullBooking.notes,
        assignedTechnician: fullBooking.assignedTechnician,
      });
    } catch (err) {
      console.warn('Error saving booking to MongoDB, fallback saved to memory:', err);
    }
  }

  if (!global.inMemoryBookings) {
    global.inMemoryBookings = [...INITIAL_ACTIVE_BOOKINGS];
  }
  global.inMemoryBookings.unshift(fullBooking);

  // Synchronize customer profile in inMemoryUsers so accounts and orders stay 100% in sync
  if (cleanPhone) {
    if (!global.inMemoryUsers) global.inMemoryUsers = [];
    const existingUser = global.inMemoryUsers.find(
      (u) => u.phone.replace(/\D/g, '').slice(-10) === cleanPhone
    );
    if (!existingUser) {
      global.inMemoryUsers.push({
        name: fullBooking.customer.name || 'Valued Customer',
        phone: cleanPhone,
        pin: '1234',
        email: fullBooking.customer.email || '',
        createdAt: new Date().toISOString(),
      });
    } else {
      if (fullBooking.customer.name && fullBooking.customer.name !== 'Valued Customer') {
        existingUser.name = fullBooking.customer.name;
      }
      if (fullBooking.customer.email) {
        existingUser.email = fullBooking.customer.email;
      }
    }
  }

  return fullBooking;
}

export async function updateBookingStatus(
  bookingId: string, 
  status: BookingStatus
): Promise<Booking | null> {
  const db = await connectToDatabase();
  if (db && mongoose.connection.readyState === 1) {
    try {
      await BookingModel.findOneAndUpdate(
        { bookingId },
        { status, updatedAt: new Date() }
      );
    } catch (err) {
      console.warn('Error updating booking in MongoDB:', err);
    }
  }

  if (!global.inMemoryBookings) {
    global.inMemoryBookings = [...INITIAL_ACTIVE_BOOKINGS];
  }

  const idx = global.inMemoryBookings.findIndex(b => b.bookingId === bookingId);
  if (idx !== -1) {
    global.inMemoryBookings[idx] = {
      ...global.inMemoryBookings[idx],
      status,
    };
    return global.inMemoryBookings[idx];
  }

  return null;
}

export async function submitBookingRating(
  bookingId: string,
  rating: number,
  comment?: string
): Promise<Booking | null> {
  const db = await connectToDatabase();
  const ratedAt = new Date().toISOString();
  if (db && mongoose.connection.readyState === 1) {
    try {
      await BookingModel.findOneAndUpdate(
        { bookingId },
        { rating, reviewComment: comment, ratedAt, updatedAt: new Date() }
      );
    } catch (err) {
      console.warn('Error saving rating to MongoDB:', err);
    }
  }

  if (!global.inMemoryBookings) {
    global.inMemoryBookings = [...INITIAL_ACTIVE_BOOKINGS];
  }

  const idx = global.inMemoryBookings.findIndex(b => b.bookingId === bookingId);
  if (idx !== -1) {
    global.inMemoryBookings[idx] = {
      ...global.inMemoryBookings[idx],
      rating,
      reviewComment: comment,
      ratedAt,
    };
    return global.inMemoryBookings[idx];
  }

  return null;
}

export function getAllServices(): ServicePackage[] {
  if (!global.inMemoryServices) {
    global.inMemoryServices = JSON.parse(JSON.stringify(LUXURY_SERVICES));
  }
  return global.inMemoryServices || LUXURY_SERVICES;
}

export function getServiceBySlug(slug: string): ServicePackage | undefined {
  const services = getAllServices();
  return services.find(s => s.slug === slug);
}

export function updateServicePackage(updatedService: ServicePackage): ServicePackage | null {
  if (!global.inMemoryServices) {
    global.inMemoryServices = JSON.parse(JSON.stringify(LUXURY_SERVICES));
  }
  const services = global.inMemoryServices;
  if (!services) return null;

  const index = services.findIndex(s => s.id === updatedService.id);
  if (index !== -1) {
    services[index] = {
      ...services[index],
      ...updatedService,
    };
    return services[index];
  }
  return null;
}

export function getAllLocations(): LocationCity[] {
  return SERVICEABLE_CITIES;
}

export function getLocationBySlug(slug: string): LocationCity | undefined {
  return SERVICEABLE_CITIES.find(l => l.slug === slug);
}

export async function authenticateOrRegisterCustomer(
  phone: string,
  pin: string,
  name?: string,
  email?: string
): Promise<{ user: CustomerProfile; isNew: boolean } | { error: string }> {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length !== 10) {
    return { error: 'WhatsApp phone number must be 10 digits.' };
  }
  if (!pin || pin.length !== 4) {
    return { error: 'Secret PIN must be exactly 4 digits.' };
  }

  if (!global.inMemoryUsers) {
    global.inMemoryUsers = [];
  }

  const existing = global.inMemoryUsers.find(u => u.phone === cleanPhone);
  if (existing) {
    if (existing.pin !== pin) {
      return { error: 'Incorrect 4-digit PIN for this WhatsApp number. Please re-enter.' };
    }
    // Update name/email if provided
    if (name && name.trim()) existing.name = name.trim();
    if (email && email.trim()) existing.email = email.trim();
    return { user: existing, isNew: false };
  }

  // Create new customer account
  const newUser: CustomerProfile = {
    name: name?.trim() || 'Doorstep Customer',
    phone: cleanPhone,
    pin,
    email: email?.trim() || '',
    createdAt: new Date().toISOString(),
  };
  global.inMemoryUsers.push(newUser);
  return { user: newUser, isNew: true };
}

export async function updateCustomerProfile(
  phone: string,
  updates: { name?: string; email?: string }
): Promise<CustomerProfile | null> {
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  if (!global.inMemoryUsers) global.inMemoryUsers = [];
  const user = global.inMemoryUsers.find(
    (u) => u.phone.replace(/\D/g, '').slice(-10) === cleanPhone
  );
  if (user) {
    if (updates.name !== undefined && updates.name.trim()) user.name = updates.name.trim();
    if (updates.email !== undefined) user.email = updates.email.trim();
    return user;
  }
  return null;
}

export async function getCustomerBookings(
  phone: string,
  recentBookingIds?: string[]
): Promise<Booking[]> {
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const allBookings = await getAllBookings();
  const ids = (recentBookingIds || []).map((id) => id.trim().toUpperCase());

  const matched = allBookings.filter((b) => {
    const bPhone = (b.customer?.phone || '').replace(/\D/g, '').slice(-10);
    const matchesPhone = Boolean(cleanPhone && bPhone && bPhone === cleanPhone);
    const matchesId = Boolean(
      b.bookingId && ids.includes(b.bookingId.trim().toUpperCase())
    );
    return matchesPhone || matchesId;
  });

  // Always return sorted newest first
  return matched.sort((a, b) => {
    const timeA = new Date(a.createdAt || a.scheduledDate).getTime();
    const timeB = new Date(b.createdAt || b.scheduledDate).getTime();
    return timeB - timeA;
  });
}

// Jr Admins / Wash Experts Repository
export function getAllJrAdmins(): JrAdmin[] {
  if (!global.inMemoryJrAdmins) {
    return [];
  }
  global.inMemoryJrAdmins.forEach((j) => {
    if (!j.username) {
      j.username = j.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    }
    if (!j.password) {
      j.password = j.pin || '1234';
    }
  });
  return global.inMemoryJrAdmins;
}

export function createJrAdmin(data: {
  name: string;
  username?: string;
  phone: string;
  email?: string;
  vehicleNo: string;
  pin?: string;
  password?: string;
}): JrAdmin {
  if (!global.inMemoryJrAdmins) global.inMemoryJrAdmins = [];
  const cleanName = data.name.trim();
  const cleanUsername =
    data.username?.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') ||
    cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const cleanPassword = data.password?.trim() || data.pin?.trim() || '1234';

  const newJr: JrAdmin = {
    id: `jr-${Date.now()}`,
    name: cleanName,
    username: cleanUsername,
    phone: data.phone.replace(/\D/g, ''),
    email: data.email?.trim() || '',
    vehicleNo: data.vehicleNo.trim(),
    rating: 5.0,
    status: 'active',
    totalJobs: 0,
    pin: data.pin?.trim() || '1234',
    password: cleanPassword,
    joinedDate: new Date().toISOString().split('T')[0],
  };
  global.inMemoryJrAdmins.unshift(newJr);
  return newJr;
}

export function updateJrAdmin(id: string, updates: Partial<JrAdmin>): JrAdmin | null {
  if (!global.inMemoryJrAdmins) return null;
  const idx = global.inMemoryJrAdmins.findIndex(j => j.id === id);
  if (idx !== -1) {
    // If username is being updated, sanitize it
    const sanitizedUpdates = { ...updates };
    if (sanitizedUpdates.username) {
      sanitizedUpdates.username = sanitizedUpdates.username
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '');
    }
    if (sanitizedUpdates.password && !sanitizedUpdates.pin) {
      sanitizedUpdates.pin = sanitizedUpdates.password;
    } else if (sanitizedUpdates.pin && !sanitizedUpdates.password) {
      sanitizedUpdates.password = sanitizedUpdates.pin;
    }

    global.inMemoryJrAdmins[idx] = { ...global.inMemoryJrAdmins[idx], ...sanitizedUpdates };
    return global.inMemoryJrAdmins[idx];
  }
  return null;
}

export function deleteJrAdmin(id: string): boolean {
  if (!global.inMemoryJrAdmins) return false;
  const idx = global.inMemoryJrAdmins.findIndex(j => j.id === id);
  if (idx !== -1) {
    global.inMemoryJrAdmins.splice(idx, 1);
    return true;
  }
  return false;
}

export function updateJrAdminPin(id: string, newPin: string, newPassword?: string): JrAdmin | null {
  if (!global.inMemoryJrAdmins) return null;
  const idx = global.inMemoryJrAdmins.findIndex(j => j.id === id);
  if (idx !== -1) {
    const cred = (newPassword || newPin).trim();
    global.inMemoryJrAdmins[idx].pin = newPin.trim();
    global.inMemoryJrAdmins[idx].password = cred;
    return global.inMemoryJrAdmins[idx];
  }
  return null;
}

export function getAdminPassword(): string {
  if (!global.inMemoryAdminPassword) {
    global.inMemoryAdminPassword = 'admin123';
  }
  return global.inMemoryAdminPassword;
}

export function changeAdminPassword(currentPass: string, newPass: string): { success: boolean; message: string } {
  const current = getAdminPassword();
  if (currentPass !== current) {
    return { success: false, message: 'Current password is incorrect.' };
  }
  if (!newPass || newPass.trim().length < 4) {
    return { success: false, message: 'New password must be at least 4 characters long.' };
  }
  global.inMemoryAdminPassword = newPass.trim();
  return { success: true, message: 'Admin password changed successfully!' };
}

// Support Enquiries Repository
export function getAllSupportEnquiries(): SupportEnquiry[] {
  return global.inMemorySupportEnquiries || [];
}

export function createSupportEnquiry(data: { customerName: string; customerPhone: string; bookingId?: string; subject: string; message: string }): SupportEnquiry {
  if (!global.inMemorySupportEnquiries) global.inMemorySupportEnquiries = [];
  const item: SupportEnquiry = {
    id: `sup-${Date.now()}`,
    customerName: data.customerName.trim(),
    customerPhone: data.customerPhone.trim(),
    bookingId: data.bookingId?.trim(),
    subject: data.subject.trim(),
    message: data.message.trim(),
    status: 'open',
    createdAt: new Date().toISOString(),
  };
  global.inMemorySupportEnquiries.unshift(item);
  return item;
}

export function updateSupportEnquiryStatus(id: string, status: 'open' | 'resolved'): SupportEnquiry | null {
  if (!global.inMemorySupportEnquiries) return null;
  const idx = global.inMemorySupportEnquiries.findIndex(s => s.id === id);
  if (idx !== -1) {
    global.inMemorySupportEnquiries[idx].status = status;
    return global.inMemorySupportEnquiries[idx];
  }
  return null;
}

// Company Settings Repository
export function getCompanySettings(): CompanySettings {
  if (!global.inMemorySettings) {
    global.inMemorySettings = {
      companyName: 'डोरस्टेप कार वॉश (Doorstep Car Wash Indore)',
      operatingCity: 'Indore',
      supportPhone: '+91 96852 32340',
      supportWhatsapp: '9685232340',
      upiId: 'doorstepwash@upi',
      upiName: 'Doorstep Car Wash Indore Pvt Ltd',
      businessHours: '07:00 AM - 08:00 PM (Everyday)',
      noticeText: '100% शुद्ध आरओ पानी व मोबाइल जनरेटर सुविधा हर वॉश में शामिल।',
    };
  }
  return global.inMemorySettings;
}

export function updateCompanySettings(updates: Partial<CompanySettings>): CompanySettings {
  const current = getCompanySettings();
  global.inMemorySettings = { ...current, ...updates };
  return global.inMemorySettings;
}

// Order flow operations
export async function acceptAndConfirmBooking(bookingId: string): Promise<Booking | null> {
  const bookings = await getAllBookings();
  const found = bookings.find(b => b.bookingId === bookingId);
  if (!found) return null;
  found.status = 'confirmed';
  found.acceptedAt = new Date().toISOString();
  if (!found.startOtp) {
    found.startOtp = Math.floor(1000 + Math.random() * 9000).toString();
  }
  return found;
}

export async function assignJrAdminToBooking(bookingId: string, jrAdminId: string): Promise<{ booking: Booking; jrAdmin: JrAdmin } | null> {
  const bookings = await getAllBookings();
  const booking = bookings.find(b => b.bookingId === bookingId);
  const jrAdmins = getAllJrAdmins();
  const jrAdmin = jrAdmins.find(j => j.id === jrAdminId);
  if (!booking || !jrAdmin) return null;

  booking.assignedTechnician = {
    id: jrAdmin.id,
    name: jrAdmin.name,
    phone: jrAdmin.phone,
    vehicleNo: jrAdmin.vehicleNo,
    rating: jrAdmin.rating,
  };
  booking.status = 'confirmed';
  booking.assignedAt = new Date().toISOString();
  if (!booking.startOtp) {
    booking.startOtp = Math.floor(1000 + Math.random() * 9000).toString();
  }
  booking.customerNotified = true;

  jrAdmin.activeBookingId = booking.bookingId;
  jrAdmin.status = 'busy';

  return { booking, jrAdmin };
}

export async function advanceBookingFlow(
  bookingId: string,
  action: 'on_my_way' | 'arrived' | 'verify_otp' | 'complete_wash',
  payload?: { otp?: string; paymentVia?: 'cash' | 'company_qr'; collectedBy?: string }
): Promise<{ success: boolean; message: string; booking?: Booking }> {
  const bookings = await getAllBookings();
  const booking = bookings.find(b => b.bookingId === bookingId);
  if (!booking) return { success: false, message: 'Booking not found' };

  if (action === 'on_my_way') {
    booking.status = 'en_route';
    return { success: true, message: 'Status updated to On My Way (En Route)', booking };
  }

  if (action === 'arrived') {
    booking.status = 'arrived';
    return { success: true, message: 'Status updated to Arrived at Customer Location', booking };
  }

  if (action === 'verify_otp') {
    const inputOtp = (payload?.otp || '').trim();
    if (!booking.startOtp) {
      booking.startOtp = '1234';
    }
    if (inputOtp !== booking.startOtp) {
      return { 
        success: false, 
        message: `गलत OTP दर्ज किया! ग्राहक द्वारा दिया गया: '${inputOtp}', अपेक्षित: '${booking.startOtp}'` 
      };
    }
    booking.status = 'in_progress';
    return { success: true, message: 'OTP verified successfully! Wash work started.', booking };
  }

  if (action === 'complete_wash') {
    booking.status = 'completed';
    booking.paymentStatus = 'paid';
    booking.paymentCollectedVia = payload?.paymentVia || 'company_qr';
    booking.paymentCollectedBy = payload?.collectedBy || booking.assignedTechnician?.name || 'Wash Expert';
    booking.completedAt = new Date().toISOString();

    // Release Jr admin if assigned
    if (booking.assignedTechnician) {
      const jr = getAllJrAdmins().find(j => j.name === booking.assignedTechnician?.name || j.phone === booking.assignedTechnician?.phone);
      if (jr) {
        jr.status = 'active';
        jr.totalJobs = (jr.totalJobs || 0) + 1;
        jr.activeBookingId = undefined;
      }
    }

    return { success: true, message: `Wash completed & payment collected via ${booking.paymentCollectedVia}!`, booking };
  }

  return { success: false, message: 'Unknown action' };
}
