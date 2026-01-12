import requests from "@/helper/requests";
import { matchmakingActions } from "@/redux/slices/player/matchmaking.slice";
import { AppDispatch } from "@/redux/store";
import type { MatchPost, MatchRequest, ChatMessage, CreateMatchData, MatchFilters } from "@/types/player/matchmaking.types";
import type { PaginationResponse } from "@/types/venueOwner/payment.types";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/axiosResponse.types";

export const FETCH_MATCHES_ACTION = (filters?: MatchFilters): Promise<{ matches: MatchPost[]; pagination: any }> =>
  new Promise((resolve, reject) => {
    AppDispatch(matchmakingActions.setLoading(true));

    requests.player.matchmaking
      .getMatches(filters)
      .then((res: AxiosResponse<ApiResponse<PaginationResponse<MatchPost> | MatchPost[]>>) => {
        const responseData = res.data.data || res.data;
        
        let matches: MatchPost[] = [];
        let pagination: any = null;
        
        if (Array.isArray(responseData)) {
          matches = responseData;
        } else if (responseData && typeof responseData === 'object' && 'items' in responseData) {
          matches = responseData.items || [];
          pagination = responseData.pagination || null;
        }
        
        AppDispatch(matchmakingActions.setMatches({ matches, pagination }));
        resolve({ matches, pagination });
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch matches";
        AppDispatch(matchmakingActions.setError(message));
        reject(err);
      });
  });

export const FETCH_MY_MATCHES_ACTION = (): Promise<MatchPost[]> =>
  new Promise((resolve, reject) => {
    AppDispatch(matchmakingActions.setLoading(true));

    requests.player.matchmaking
      .getMyMatches()
      .then((res: AxiosResponse<ApiResponse<MatchPost[]>>) => {
        const matches = Array.isArray(res.data.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        AppDispatch(matchmakingActions.setMyMatches(matches));
        resolve(matches);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch my matches";
        AppDispatch(matchmakingActions.setError(message));
        reject(err);
      });
  });

export const FETCH_MATCH_BY_ID_ACTION = (matchId: number): Promise<MatchPost> =>
  new Promise((resolve, reject) => {
    AppDispatch(matchmakingActions.setLoading(true));

    requests.player.matchmaking
      .getMatchById(matchId)
      .then((res: AxiosResponse<ApiResponse<MatchPost>>) => {
        const match = res.data.data || res.data;
        AppDispatch(matchmakingActions.setSelectedMatch(match));
        AppDispatch(matchmakingActions.setLoading(false));
        resolve(match);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch match";
        AppDispatch(matchmakingActions.setError(message));
        reject(err);
      });
  });

export const CREATE_MATCH_ACTION = (data: CreateMatchData): Promise<MatchPost> =>
  new Promise((resolve, reject) => {
    AppDispatch(matchmakingActions.setLoading(true));

    requests.player.matchmaking
      .createMatch(data)
      .then((res: AxiosResponse<ApiResponse<MatchPost>>) => {
        const match = res.data.data || res.data;
        AppDispatch(matchmakingActions.addMatch(match));
        AppDispatch(matchmakingActions.setLoading(false));
        resolve(match);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to create match";
        AppDispatch(matchmakingActions.setError(message));
        reject(err);
      });
  });

export const REQUEST_TO_JOIN_ACTION = (matchId: number, message?: string): Promise<MatchRequest> =>
  new Promise((resolve, reject) => {
    requests.player.matchmaking
      .requestToJoin(matchId, message)
      .then((res: AxiosResponse<ApiResponse<MatchRequest>>) => {
        const request = res.data.data || res.data;
        resolve(request);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to send request";
        reject(err);
      });
  });

export const RESPOND_TO_REQUEST_ACTION = (requestId: number, action: 'accept' | 'reject'): Promise<MatchRequest> =>
  new Promise((resolve, reject) => {
    requests.player.matchmaking
      .respondToRequest(requestId, action)
      .then((res: AxiosResponse<ApiResponse<MatchRequest>>) => {
        const request = res.data.data || res.data;
        AppDispatch(matchmakingActions.updateRequest(request));
        resolve(request);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || `Failed to ${action} request`;
        reject(err);
      });
  });

export const FETCH_MATCH_REQUESTS_ACTION = (matchId: number): Promise<MatchRequest[]> =>
  new Promise((resolve, reject) => {
    requests.player.matchmaking
      .getMatchRequests(matchId)
      .then((res: AxiosResponse<ApiResponse<MatchRequest[]>>) => {
        const requests = Array.isArray(res.data.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        AppDispatch(matchmakingActions.setRequests(requests));
        resolve(requests);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch requests";
        reject(err);
      });
  });

export const FETCH_CHAT_MESSAGES_ACTION = (matchId: number): Promise<ChatMessage[]> =>
  new Promise((resolve, reject) => {
    requests.player.matchmaking
      .getChatMessages(matchId)
      .then((res: AxiosResponse<ApiResponse<ChatMessage[]>>) => {
        const messages = Array.isArray(res.data.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        AppDispatch(matchmakingActions.setChatMessages(messages));
        resolve(messages);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch chat messages";
        reject(err);
      });
  });

export const SEND_CHAT_MESSAGE_ACTION = (matchId: number, message: string): Promise<ChatMessage> =>
  new Promise((resolve, reject) => {
    requests.player.matchmaking
      .sendChatMessage(matchId, message)
      .then((res: AxiosResponse<ApiResponse<ChatMessage>>) => {
        const chatMessage = res.data.data || res.data;
        AppDispatch(matchmakingActions.addChatMessage(chatMessage));
        resolve(chatMessage);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to send message";
        reject(err);
      });
  });

export const DELETE_MATCH_ACTION = (matchId: number): Promise<void> =>
  new Promise((resolve, reject) => {
    AppDispatch(matchmakingActions.setLoading(true));

    requests.player.matchmaking
      .deleteMatch(matchId)
      .then(() => {
        AppDispatch(matchmakingActions.removeMatch(matchId));
        AppDispatch(matchmakingActions.setLoading(false));
        resolve();
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to delete match";
        AppDispatch(matchmakingActions.setError(message));
        reject(err);
      });
  });

