// Match Types for Player Matchmaking Feature

export interface UserBasicInfo {
  userId: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
}

export interface MatchResponse {
  matchId: number;
  creator: UserBasicInfo;
  title: string;
  description: string;
  sportType: string;
  location: string;
  matchDateTime: string;
  requiredPlayers: number;
  currentPlayers: number;
  skillLevel: string;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED' | 'COMPLETED';
  contactInfo?: string;
  additionalNotes?: string;
  createdAt: string;
  updatedAt: string;
  isCreator: boolean;
  hasRequested?: boolean; // Whether current user has requested to join
  requestStatus?: 'PENDING' | 'ACCEPTED' | 'REJECTED'; // Status of user's request
}

export interface MatchRequestResponse {
  requestId: number;
  matchId: number;
  player: UserBasicInfo;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  requestedAt: string;
  respondedAt?: string;
}

export interface CreateMatchData {
  title: string;
  description: string;
  sportType: string;
  location: string;
  matchDateTime: string;
  requiredPlayers: number;
  skillLevel: string;
  contactInfo?: string;
  additionalNotes?: string;
}

export interface UpdateMatchData {
  title?: string;
  description?: string;
  location?: string;
  matchDateTime?: string;
  requiredPlayers?: number;
  skillLevel?: string;
  contactInfo?: string;
  additionalNotes?: string;
  status?: string;
}

export interface MatchFilters {
  sportType?: string;
  location?: string;
  skillLevel?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export interface MatchListResponse {
  success: boolean;
  data: MatchResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
}
