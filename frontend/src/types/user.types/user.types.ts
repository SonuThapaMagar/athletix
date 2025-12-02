export interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  role: "PLAYER" | "VENUE_OWNER" | "ADMIN";
}

export interface IUserProfile {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  role?: "PLAYER" | "VENUE_OWNER" | "ADMIN";
}