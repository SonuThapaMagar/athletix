export interface PlayerVenue {
  id: number;
  name: string;
  location: string;
  sports: string[];
  pricePerHour: number;
  description: string;
  images: string[];
  amenities: string[];
  operatingHours: OperatingHour[];
  phone: string;
  email: string;
  ownerId: number;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface OperatingHour {
  day: string;
  openTime: string;
  closeTime: string;
}