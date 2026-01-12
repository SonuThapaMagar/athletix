export type MatchStatus = 'OPEN' | 'CLOSED' | 'CANCELLED' | 'COMPLETED';
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface UserBasicInfo {
  userId: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface MatchPost {
  matchId: number;
  creator: UserBasicInfo;
  title: string;
  description: string;
  sportType: string;
  location: string;
  matchDateTime: string; // ISO 8601 datetime string
  requiredPlayers: number;
  currentPlayers: number;
  skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ANY';
  status: MatchStatus;
  contactInfo?: string;
  additionalNotes?: string;
  createdAt: string;
  updatedAt: string;
  requests?: MatchRequest[];
  acceptedPlayers?: AcceptedPlayer[];
}

export interface MatchRequest {
  requestId: number;
  matchId: number;
  player: UserBasicInfo;
  message?: string;
  status: string;
  requestedAt: string;
  respondedAt?: string;
}

export interface AcceptedPlayer {
  id: number;
  playerId: number;
  playerName: string;
  playerAvatar?: string;
  playerEmail: string;
  acceptedAt: string;
}

export interface ChatMessage {
  id: number;
  matchId: number;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  message: string;
  timestamp: string;
}

export interface CreateMatchData {
  title: string;
  description: string;
  sportType: string;
  location: string;
  matchDateTime: string; // ISO 8601 datetime string
  requiredPlayers: number;
  skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ANY';
  contactInfo?: string;
  additionalNotes?: string;
}

export interface MatchFilters {
  sportType?: string;
  skillLevel?: string;
  status?: MatchStatus;
  date?: string;
  location?: string;
}

