// src/types/player/matchmaking.types.ts

export interface UserBasicInfo {
  userId: number;
  name: string;
  email: string;
  phone: string;
  location: string;
}

export interface AcceptedPlayer {
  playerId: number;
  playerName: string;
  playerEmail: string;
  playerPhone: string;
  playerLocation: string;
  acceptedAt: string;
}

export interface MatchPost {
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
  status: string;
  contactInfo: string;
  additionalNotes: string;
  createdAt: string;
  updatedAt: string;
  isCreator: boolean;
  hasRequested?: boolean;
  requestStatus?: string;
  acceptedPlayers?: AcceptedPlayer[];  
  requests?: MatchRequest[];
}

export interface MatchRequest {
  requestId: number;
  matchId: number;
  player: UserBasicInfo;
  message: string;
  status: string;
  requestedAt: string;
  respondedAt?: string;
}

export interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  message: string;
  timestamp: string;
  groupId?: number;
}

export interface SendMessageRequest {
  content: string;
}

export interface CreateMatchData {
  title: string;
  description: string;
  sportType: string;
  location: string;
  matchDateTime: string;
  requiredPlayers: number;
  skillLevel: string;
  contactInfo: string;
  additionalNotes?: string;
}

export interface MatchFilters {
  sportType?: string;
  location?: string;
  skillLevel?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}