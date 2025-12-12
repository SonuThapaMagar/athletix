export interface IAuthReq {
  email: string;
  password: string;
}

export interface IAuthRes {
  accessToken: string;
  refreshToken: string;
  userRole: "PLAYER" | "VENUE_OWNER" | "ADMIN";
  email: string;
}

export interface IResetPassword {
  password: string;
  confirmPassword: string;
}

export type userRole= "PLAYER" | "VENUE_OWNER" | "ADMIN";


export interface IVenueOwnerRegister{

}
