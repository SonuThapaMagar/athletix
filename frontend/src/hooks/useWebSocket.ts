// src/hooks/useWebSocket.ts
import { useEffect, useRef, useCallback, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import type { IMessage } from '@stomp/stompjs';

interface UseWebSocketOptions {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export const useWebSocket = (options?: UseWebSocketOptions) => {
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<string, any>>(new Map());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('UseWebSocket: No access token found');
      return;
    }

    // Construct WS URL from API URL (replace /api with /ws or append /ws)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
    const wsUrl = apiUrl.replace(/\/api\/?$/, '') + '/ws';

    console.log('Attempting WebSocket connection to:', wsUrl);
    console.log('Token present:', !!token);

    const socket = new SockJS(wsUrl);
    const client = new Client({
      webSocketFactory: () => socket as any,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket Connected');
        setIsConnected(true);
        options?.onConnect?.();
      },
      onDisconnect: () => {
        console.log('WebSocket Disconnected');
        setIsConnected(false);
        options?.onDisconnect?.();
      },
      onStompError: (frame) => {
        console.error('STOMP Error:', frame);
        options?.onError?.(frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
      subscriptionsRef.current.clear();
      client.deactivate();
    };
  }, []);

  const subscribe = useCallback((destination: string, callback: (message: any) => void) => {
    if (!clientRef.current || !clientRef.current.connected) return;

    const subscription = clientRef.current.subscribe(destination, (message: IMessage) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    subscriptionsRef.current.set(destination, subscription);

    return () => {
      subscription.unsubscribe();
      subscriptionsRef.current.delete(destination);
    };
  }, []);

  const sendMessage = useCallback((destination: string, body: any) => {
    if (!clientRef.current || !clientRef.current.connected) return;

    clientRef.current.publish({
      destination,
      body: JSON.stringify(body),
    });
  }, []);

  return { subscribe, sendMessage, isConnected };
};