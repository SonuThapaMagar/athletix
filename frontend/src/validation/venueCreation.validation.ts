// src/validation/venueValidation.ts
import { z } from "zod";

export const venueSchema = z.object({
  name: z.string().min(1, "Venue name is required"),
  location: z.string().min(1, "Location is required"),
  pricePerHour: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Price must be a valid number",
    }),
  description: z.string().min(1, "Description is required"),
  sports: z.array(z.string()).min(1, "Select at least one sport"),
  amenities: z.array(z.string()).optional(),
  operatingHours: z
    .array(
      z.object({
        day: z.string(),
        openTime: z.string(),
        closeTime: z.string(),
      })
    )
    .optional(),
  images: z.array(z.instanceof(File)).optional(),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
});

export type VenueFormValues = z.infer<typeof venueSchema>;
