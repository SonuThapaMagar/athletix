export interface Venue {
  id: number;
  name: string;
  location: string;
  sports: string[];
  pricePerHour: number;
  description: string;
  images: string[];
  amenities: string[];
  operatingHours: {
    day: string;
    openTime: string;
    closeTime: string;
  }[];

  phone: string;
  email: string;

  ownerId: number;
  ownerName: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  bookings?: number;
}

export interface VenueDisplay {
  id: number;
  name: string;
  location: string;
  price: string;
  bookings: number;
  sports: string[];
  status: string;
}

// Form state (with Files for upload)
export interface VenueFormData {
  name: string;
  location: string;
  pricePerHour: string;
  description: string;
  sports: string[];
  amenities: string[];
  operatingHours: {
    day: string;
    openTime: string;
    closeTime: string;
  }[];
  images: File[];

  phone: string;
  email: string;

}

export interface VenueSubmitData {
  name: string;
  location: string;
  pricePerHour: number;
  description: string;
  sports: string[];
  amenities: string[];
  operatingHours: {
    day: string;
    openTime: string;
    closeTime: string;
  }[];
  images: string[];
  phone: string;
  email: string;

}

// Form errors
export interface VenueFormErrors {
  name?: string;
  location?: string;
  pricePerHour?: string;
  description?: string;
  sports?: string;
  amenities?: string;

  phone?: string;
  email?: string;

  images?: string;
}

// Pagination
export interface Pagination {
  page: number;
  total: number;
  limit: number;
}