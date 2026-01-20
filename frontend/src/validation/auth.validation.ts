import { z } from "zod";

/* ================= LOGIN ================= */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

/* ================= REGISTER ================= */
export const registerSchema = z.object({
  name: z.string().min(2, "Full name is required"),

  email: z.string().email("Invalid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),

  phone: z.string().min(7, "Phone number is required"),

  location: z.string().min(2, "Location is required"),

  role: z.enum(["PLAYER", "VENUE_OWNER", "ADMIN"]),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
