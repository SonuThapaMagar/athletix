export interface Venue {
  id: number
  name: string
  address: string
  city: string
  sportTypes: string[]
  pricePerHour: number
  description: string
  images: string[]
  ownerId: number
  ownerName: string
  isVerified: boolean
  createdAt: string
  updatedAt: string

  amenities?: string[]
  operatingHours?: {
    day: string
    openTime: string
    closeTime: string
  }[]
  contact?: {
    phone: string
    email: string
  }
}

// UI list display model
export interface VenueDisplay {
  id: number
  name: string
  location: string
  price: string
  bookings: number
  sports: string[]
  status: string
}

// UI form model
export interface VenueFormData {
  name: string
  location: string
  address: string
  price: string
  description: string
  sports: string[]
  amenities: string[]
  operatingHours: {
    day: string
    openTime: string
    closeTime: string
  }[]
  images: File[]
  contact: {
    phone: string
    email: string
  }
}

export interface VenueFormErrors {
  name?: string
  location?: string
  address?: string
  price?: string
  description?: string
  sports?: string[]
  amenities?: string[]
  contact?: {
    phone?: string
    email?: string
  }
}

// Redux slice type
export interface IVenuesSlice {
  venues: Venue[]
}

// Optional pagination
export interface Pagination {
  page: number
  total: number
  limit: number
}