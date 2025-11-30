export interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  role: "PLAYER" | "VENUE_OWNER" | "ADMIN";
}
