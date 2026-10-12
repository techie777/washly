import { create } from 'zustand';
import { 
  VehicleDetails, 
  ServicePackage, 
  AddOnItem, 
  LocationCity, 
  CustomerContact, 
  ServiceAddress 
} from '@/types';
import { LUXURY_SERVICES, SERVICEABLE_CITIES } from '@/lib/seedData';

interface BookingStoreState {
  step: number;
  city: LocationCity | null;
  pincode: string;
  isPincodeValid: boolean;
  
  vehicle: VehicleDetails | null;
  service: ServicePackage | null;
  availableServices: ServicePackage[];
  selectedAddOns: AddOnItem[];
  
  scheduledDate: string;
  timeSlot: string;
  
  customer: CustomerContact;
  address: ServiceAddress;
  paymentMethod: 'cod' | 'razorpay_mock' | 'upi_mock';
  notes: string;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  setCity: (city: LocationCity) => void;
  setPincode: (pincode: string) => void;
  validatePincode: () => boolean;

  setVehicle: (vehicle: VehicleDetails) => void;
  setService: (service: ServicePackage) => void;
  setAvailableServices: (services: ServicePackage[]) => void;
  toggleAddOn: (addon: AddOnItem) => void;

  setSchedule: (date: string, timeSlot: string) => void;
  setCustomer: (customer: Partial<CustomerContact>) => void;
  setAddress: (address: Partial<ServiceAddress>) => void;
  setPaymentMethod: (method: 'cod' | 'razorpay_mock' | 'upi_mock') => void;
  setNotes: (notes: string) => void;

  getBasePrice: () => number;
  getAddOnsTotal: () => number;
  getTotalAmount: () => number;

  prefillBooking: (serviceSlug?: string, citySlug?: string) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingStoreState>((set, get) => ({
  step: 1,
  city: SERVICEABLE_CITIES[0], // Default Indore
  pincode: '452010',
  isPincodeValid: true,

  vehicle: {
    type: 'car',
    make: 'Maruti Suzuki',
    model: 'Swift / Baleno / Brezza',
    segment: 'hatchback',
    plateNumber: '',
    fuelType: 'petrol',
  },
  service: LUXURY_SERVICES[0],
  availableServices: LUXURY_SERVICES,
  selectedAddOns: [],

  scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
  timeSlot: '10:00 AM - 12:00 PM',

  customer: {
    name: '',
    phone: '',
    email: '',
  },
  address: {
    street: '',
    city: 'Indore',
    pincode: '452010',
    landmark: '',
  },
  paymentMethod: 'cod',
  notes: '',

  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 4) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),

  setCity: (city) => {
    set({
      city,
      pincode: city.serviceablePincodes[0] || '',
      isPincodeValid: true,
      address: {
        ...get().address,
        city: city.city,
        pincode: city.serviceablePincodes[0] || '',
      },
    });
  },

  setPincode: (pincode) => {
    const cleanPin = pincode.replace(/\D/g, '').slice(0, 6);
    const { city } = get();
    const isValid = city ? city.serviceablePincodes.includes(cleanPin) : false;
    set({
      pincode: cleanPin,
      isPincodeValid: isValid,
      address: {
        ...get().address,
        pincode: cleanPin,
      },
    });
  },

  validatePincode: () => {
    const { city, pincode } = get();
    if (!city) return false;
    const isValid = city.serviceablePincodes.includes(pincode);
    set({ isPincodeValid: isValid });
    return isValid;
  },

  setVehicle: (vehicle) => {
    set({ vehicle });
  },

  setService: (service) => {
    set({ service });
  },

  setAvailableServices: (availableServices) => {
    const { service } = get();
    // Update currently selected service reference if matching updated one
    const updatedSelected = service ? availableServices.find(s => s.id === service.id) || service : service;
    set({ availableServices, service: updatedSelected });
  },

  toggleAddOn: (addon) => {
    set((state) => {
      const exists = state.selectedAddOns.some((a) => a.id === addon.id);
      if (exists) {
        return {
          selectedAddOns: state.selectedAddOns.filter((a) => a.id !== addon.id),
        };
      } else {
        return {
          selectedAddOns: [...state.selectedAddOns, addon],
        };
      }
    });
  },

  setSchedule: (scheduledDate, timeSlot) => set({ scheduledDate, timeSlot }),

  setCustomer: (cust) =>
    set((state) => ({
      customer: { ...state.customer, ...cust },
    })),

  setAddress: (addr) =>
    set((state) => ({
      address: { ...state.address, ...addr },
    })),

  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setNotes: (notes) => set({ notes }),

  getBasePrice: () => {
    const { service, vehicle } = get();
    if (!service || !vehicle) return 0;
    const segment = vehicle.segment;
    return service.vehiclePricing[segment] || service.vehiclePricing.sedan || 699;
  },

  getAddOnsTotal: () => {
    const { selectedAddOns } = get();
    return selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  },

  getTotalAmount: () => {
    return get().getBasePrice() + get().getAddOnsTotal();
  },

  prefillBooking: (serviceSlug, citySlug) => {
    const updates: Partial<BookingStoreState> = {};
    if (serviceSlug) {
      const foundService = LUXURY_SERVICES.find((s) => s.slug === serviceSlug);
      if (foundService) updates.service = foundService;
    }
    if (citySlug) {
      const foundCity = SERVICEABLE_CITIES.find((c) => c.slug === citySlug);
      if (foundCity) {
        updates.city = foundCity;
        updates.pincode = foundCity.serviceablePincodes[0];
        updates.isPincodeValid = true;
      }
    }
    set(updates);
  },

  resetBooking: () => {
    set({
      step: 1,
      selectedAddOns: [],
      notes: '',
      customer: { name: '', phone: '', email: '' },
    });
  },
}));
