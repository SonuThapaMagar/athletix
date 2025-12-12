// ---------------------------------------------
// Base Venue Model (Backend Response)
// ---------------------------------------------
export interface Venue {
  id: number;
  name: string;
  location: string;
  pricePerHour: number;
  description: string;

  sports: string[];
  amenities: string[];
  images: string[];

  operatingHours: OperatingHour[];

  phone: string;
  email: string;

  ownerId: number;
  ownerName: string;

  isVerified: boolean;
  createdAt: string;
  updatedAt: string;

  bookings?: number;
}

// ---------------------------------------------
// Operating Hour Type (Reused Across Forms)
// ---------------------------------------------
export interface OperatingHour {
  day: string;
  openTime: string;
  closeTime: string;
}

// ---------------------------------------------
// Compact Version for Listing/Display Cards
// ---------------------------------------------
export interface VenueDisplay {
  id: number;
  name: string;
  location: string;
  price: string;
  bookings: number;
  sports: string[];
  status: string;
}

// ---------------------------------------------
// Form State (Used in React Form)
// ---------------------------------------------
export interface VenueFormData {
  name: string;
  location: string;
  pricePerHour: string; // as input text
  description: string;

  sports: string[];
  amenities: string[];

  operatingHours: OperatingHour[];

  images: File[]; // for uploads

  phone: string;
  email: string;
}

// ---------------------------------------------
// Submit Data (Sent to API)
// ---------------------------------------------
export interface VenueSubmitData {
  name: string;
  location: string;
  pricePerHour: number; // converted to number
  description: string;

  sports: string[];
  amenities: string[];
  operatingHours: OperatingHour[];

  images: string[]; // URLs/paths from backend
  phone: string;
  email: string;
}

// ---------------------------------------------
// Form Errors
// ---------------------------------------------
export interface VenueFormErrors {
  name?: string;
  location?: string;
  pricePerHour?: string;
  description?: string;
  sports?: string;
  amenities?: string;
  images?: string;
  phone?: string;
  email?: string;
}
