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

// Enhanced player profile for viewing other players
export interface IPlayerProfile {
  userId: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  role: string;
  bio?: string;
  profilePicture?: string;
  createdAt?: string;
  // Match statistics
  stats?: {
    totalMatchesCreated?: number;
    totalMatchesJoined?: number;
    totalMatchesCompleted?: number;
    acceptanceRate?: number; // Percentage of requests accepted
  };
  // Sports preferences
  favoriteSports?: string[];
  skillLevels?: { [sport: string]: string }; // e.g., { "Basketball": "Intermediate", "Football": "Beginner" }
  // Recent activity
  recentMatches?: Array<{
    matchId: number;
    title: string;
    sportType: string;
    date: string;
    status: string;
  }>;
}

// Response wrapper for player profile API
export interface PlayerProfileResponse {
  success: boolean;
  data: IPlayerProfile;
  message?: string;
}