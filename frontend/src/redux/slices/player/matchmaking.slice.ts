import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MatchPost, MatchRequest, ChatMessage, MatchFilters } from '@/types/player/matchmaking.types';
import type { Pagination } from '@/types/pagination.types';

export interface IMatchmakingSlice {
  matches: MatchPost[];
  myMatches: MatchPost[];
  selectedMatch: MatchPost | null;
  requests: MatchRequest[];
  chatMessages: ChatMessage[];
  filters: MatchFilters;
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: IMatchmakingSlice = {
  matches: [],
  myMatches: [],
  selectedMatch: null,
  requests: [],
  chatMessages: [],
  filters: {},
  pagination: null,
  loading: false,
  error: null,
};

const matchmakingSlice = createSlice({
  name: 'matchmaking',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setMatches(state, action: PayloadAction<{ matches: MatchPost[]; pagination: Pagination | null }>) {
      state.matches = action.payload.matches;
      state.pagination = action.payload.pagination;
      state.loading = false;
      state.error = null;
    },
    setMyMatches(state, action: PayloadAction<MatchPost[]>) {
      state.myMatches = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedMatch(state, action: PayloadAction<MatchPost | null>) {
      state.selectedMatch = action.payload;
    },
    addMatch(state, action: PayloadAction<MatchPost>) {
      state.matches.unshift(action.payload);
      state.myMatches.unshift(action.payload);
    },
    updateMatch(state, action: PayloadAction<MatchPost>) {
      const index = state.matches.findIndex(m => m.matchId === action.payload.matchId);
      if (index !== -1) {
        state.matches[index] = action.payload;
      }
      const myIndex = state.myMatches.findIndex(m => m.matchId === action.payload.matchId);
      if (myIndex !== -1) {
        state.myMatches[myIndex] = action.payload;
      }
      if (state.selectedMatch?.matchId === action.payload.matchId) {
        state.selectedMatch = action.payload;
      }
    },
    removeMatch(state, action: PayloadAction<number>) {
      state.matches = state.matches.filter(m => m.matchId !== action.payload);
      state.myMatches = state.myMatches.filter(m => m.matchId !== action.payload);
    },
    setRequests(state, action: PayloadAction<MatchRequest[]>) {
      state.requests = action.payload;
    },
    updateRequest(state, action: PayloadAction<MatchRequest>) {
      const index = state.requests.findIndex(r => r.requestId === action.payload.requestId);
      if (index !== -1) {
        state.requests[index] = action.payload;
      }
      // Update request in selected match
      if (state.selectedMatch?.requests) {
        const matchRequestIndex = state.selectedMatch.requests.findIndex(r => r.requestId === action.payload.requestId);
        if (matchRequestIndex !== -1) {
          state.selectedMatch.requests[matchRequestIndex] = action.payload;
        }
      }
    },
    setChatMessages(state, action: PayloadAction<ChatMessage[]>) {
      state.chatMessages = action.payload;
    },
    addChatMessage(state, action: PayloadAction<ChatMessage>) {
      state.chatMessages.push(action.payload);
    },
    setFilters(state, action: PayloadAction<MatchFilters>) {
      state.filters = action.payload;
    },
  },
});

export const { actions: matchmakingActions, reducer } = matchmakingSlice;
export default reducer;

