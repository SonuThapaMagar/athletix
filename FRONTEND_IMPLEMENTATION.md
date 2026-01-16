# Match Request Acceptance Flow - Frontend Implementation

This document contains all the React/TypeScript frontend updates needed to complete the match request flow.

## 📋 What We're Implementing

1. **Disable "Request to Join" button** after the player has already requested
2. **Show appropriate status** for pending/accepted/rejected requests  
3. **Real-time notification updates** when a request is accepted
4. **Refresh match data** after responding to a request

---

## 1. Update Match Types

**File:** `frontend/src/types/match.types.ts`

```typescript
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
  hasRequested?: boolean; // Whether current user has requested
  requestStatus?: 'PENDING' | 'ACCEPTED' | 'REJECTED'; // Status of the request
}

export interface UserBasicInfo {
  userId: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
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
```

---

## 2. Update Match Detail Component

This example shows how to properly handle the "Request to Join" button state:

**File:** `frontend/src/components/player/MatchDetailCard.tsx`

```typescript
import { useState } from 'react';
import { toast } from 'sonner';
import { MdLocationOn, MdCalendarToday, MdPeople, MdStar } from 'react-icons/md';
import requests from '@/helper/requests';
import type { MatchResponse } from '@/types/match.types';

interface MatchDetailCardProps {
  match: MatchResponse;
  onUpdate?: () => void;
}

const MatchDetailCard = ({ match, onUpdate }: MatchDetailCardProps) => {
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState('');

  const canRequestToJoin = 
    !match.isCreator && 
    match.status === 'OPEN' && 
    !match.hasRequested &&
    match.currentPlayers < match.requiredPlayers;

  const handleRequestToJoin = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setRequesting(true);
    try {
      const response = await requests.player.matchmaking.requestToJoin(
        match.matchId, 
        message
      );

      if (response.data.success) {
        toast.success('Join request sent successfully!');
        setMessage('');
        onUpdate?.(); // Refresh the match data
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to send request');
    } finally {
      setRequesting(false);
    }
  };

  const getRequestStatusBadge = () => {
    if (!match.hasRequested) return null;

    const statusConfig = {
      PENDING: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: '⏳ Request Pending',
      },
      ACCEPTED: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: '✅ Request Accepted',
      },
      REJECTED: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: '❌ Request Rejected',
      },
    };

    const config = statusConfig[match.requestStatus!];

    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{match.title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Organized by {match.creator.name}
          </p>
        </div>
        {getRequestStatusBadge()}
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4">{match.description}</p>

      {/* Match Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <MdLocationOn className="text-blue-600" />
          <span className="text-gray-700">{match.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <MdCalendarToday className="text-blue-600" />
          <span className="text-gray-700">
            {new Date(match.matchDateTime).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MdPeople className="text-blue-600" />
          <span className="text-gray-700">
            {match.currentPlayers}/{match.requiredPlayers} Players
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MdStar className="text-blue-600" />
          <span className="text-gray-700">Skill Level: {match.skillLevel}</span>
        </div>
      </div>

      {/* Sport Badge */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {match.sportType}
        </span>
      </div>

      {/* Request to Join Section */}
      {canRequestToJoin && (
        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold text-gray-800 mb-2">Request to Join</h3>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message to the organizer..."
            className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            disabled={requesting}
          />
          <button
            onClick={handleRequestToJoin}
            disabled={requesting || !message.trim()}
            className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {requesting ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      )}

      {/* Already Requested Message */}
      {match.hasRequested && match.requestStatus === 'PENDING' && (
        <div className="border-t pt-4 mt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-800 font-medium">
              Your request is pending approval from the organizer.
            </p>
          </div>
        </div>
      )}

      {/* Accepted Message */}
      {match.hasRequested && match.requestStatus === 'ACCEPTED' && (
        <div className="border-t pt-4 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-800 font-medium">
              🎉 You've been accepted! Check your email for details.
            </p>
          </div>
        </div>
      )}

      {/* Match Full Message */}
      {!match.isCreator && match.status === 'OPEN' && match.currentPlayers >= match.requiredPlayers && !match.hasRequested && (
        <div className="border-t pt-4 mt-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-gray-600 font-medium">
              This match is currently full.
            </p>
          </div>
        </div>
      )}

      {/* Creator View */}
      {match.isCreator && (
        <div className="border-t pt-4 mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-800 font-medium">
              You are the organizer of this match
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchDetailCard;
```

---

## 3. Update Match Requests Management Component

For match creators to manage incoming requests:

**File:** `frontend/src/components/player/MatchRequestsManager.tsx`

```typescript
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MdCheck, MdClose } from 'react-icons/md';
import requests from '@/helper/requests';
import type { MatchRequestResponse } from '@/types/match.types';

interface MatchRequestsManagerProps {
  matchId: number;
}

const MatchRequestsManager = ({ matchId }: MatchRequestsManagerProps) => {
  const [matchRequests, setMatchRequests] = useState<MatchRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<number | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [matchId]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await requests.player.matchmaking.getMatchRequests(matchId);
      if (response.data.success) {
        setMatchRequests(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load match requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId: number, action: 'accept' | 'reject') => {
    setResponding(requestId);
    try {
      const response = await requests.player.matchmaking.respondToRequest(
        requestId,
        action
      );

      if (response.data.success) {
        toast.success(
          action === 'accept' 
            ? '✅ Request accepted! Player has been notified via email and in-app.' 
            : 'Request rejected'
        );
        
        // Refresh the requests list
        fetchRequests();
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || `Failed to ${action} request`
      );
    } finally {
      setResponding(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const pendingRequests = matchRequests.filter(r => r.status === 'PENDING');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Match Requests ({pendingRequests.length})
      </h3>

      {pendingRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No pending requests
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <div
              key={request.requestId}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">
                    {request.player.name}
                  </h4>
                  <p className="text-sm text-gray-600">{request.player.email}</p>
                  {request.player.location && (
                    <p className="text-sm text-gray-500">📍 {request.player.location}</p>
                  )}
                  {request.message && (
                    <p className="text-sm text-gray-700 mt-2 italic">
                      "{request.message}"
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Requested: {new Date(request.requestedAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleRespond(request.requestId, 'accept')}
                    disabled={responding === request.requestId}
                    className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    <MdCheck className="w-4 h-4" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleRespond(request.requestId, 'reject')}
                    disabled={responding === request.requestId}
                    className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    <MdClose className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History Section */}
      {matchRequests.filter(r => r.status !== 'PENDING').length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-semibold text-gray-700 mb-3">Request History</h4>
          <div className="space-y-2">
            {matchRequests
              .filter(r => r.status !== 'PENDING')
              .map((request) => (
                <div
                  key={request.requestId}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <span className="font-medium text-gray-800">
                      {request.player.name}
                    </span>
                    <span
                      className={`ml-3 text-sm font-medium ${
                        request.status === 'ACCEPTED'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {request.status === 'ACCEPTED' ? '✅ Accepted' : '❌ Rejected'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {request.respondedAt && 
                      new Date(request.respondedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchRequestsManager;
```

---

## 4. Update Notification Bell to Support Match Notifications

**File:** `frontend/src/components/notifications/NotificationBell.tsx`

Update the notification click handler to navigate to matches:

```typescript
// Add this import
import { useNavigate } from 'react-router-dom';

// Inside the component
const navigate = useNavigate();

// Update the notification click handler
const handleNotificationClick = (notification: INotification) => {
  markAsRead(notification.notificationId);
  
  // Navigate based on notification type
  if (notification.relatedEntityType === 'match') {
    navigate(`/player/matches/${notification.relatedEntityId}`);
  } else if (notification.relatedEntityType === 'booking') {
    navigate(`/player/bookings`);
  }
  // Add more navigation logic as needed
  
  setIsOpen(false);
};

// Update the notification rendering to be clickable
<div
  key={notification.notificationId}
  onClick={() => handleNotificationClick(notification)}
  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
>
  {/* ... existing notification content ... */}
</div>
```

---

## 5. Create a Matches Page with Refresh

**File:** `frontend/src/pages/player/Matches.tsx` (Example)

```typescript
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import requests from '@/helper/requests';
import MatchDetailCard from '@/components/player/MatchDetailCard';
import MatchRequestsManager from '@/components/player/MatchRequestsManager';
import type { MatchResponse } from '@/types/match.types';

const MatchDetailPage = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [match, setMatch] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (matchId) {
      fetchMatch();
    }
  }, [matchId]);

  const fetchMatch = async () => {
    if (!matchId) return;
    
    setLoading(true);
    try {
      const response = await requests.player.matchmaking.getMatchById(
        parseInt(matchId)
      );
      
      if (response.data.success) {
        setMatch(response.data.data);
      }
    } catch (error: any) {
      toast.error('Failed to load match details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Match not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Match Details */}
        <MatchDetailCard 
          match={match} 
          onUpdate={fetchMatch} // Refresh after requesting
        />

        {/* Match Requests (only for creator) */}
        {match.isCreator && (
          <MatchRequestsManager matchId={match.matchId} />
        )}
      </div>
    </div>
  );
};

export default MatchDetailPage;
```

---

## 6. Real-time Notifications with Polling

If you want to poll for new notifications periodically:

**File:** `frontend/src/hooks/useNotifications.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';
import requests from '@/helper/requests';
import type { INotification } from '@/types/notification.types';

export const useNotifications = (pollInterval = 30000) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const { data } = await requests.notifications.getUnreadCount();
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await requests.notifications.getUnreadNotifications({
        page: 1,
        perPage: 10,
      });
      setNotifications(data.data);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();

    // Poll for new notifications
    const interval = setInterval(fetchUnreadCount, pollInterval);
    return () => clearInterval(interval);
  }, [fetchUnreadCount, pollInterval]);

  return {
    unreadCount,
    notifications,
    fetchUnreadCount,
    fetchNotifications,
  };
};
```

---

## 7. Update the Match Request Button Logic Summary

### Key States to Handle:

```typescript
// 1. Can request (show request form)
const canRequest = !match.isCreator && 
                   match.status === 'OPEN' && 
                   !match.hasRequested &&
                   match.currentPlayers < match.requiredPlayers;

// 2. Request pending (show waiting message)
const isPending = match.hasRequested && match.requestStatus === 'PENDING';

// 3. Request accepted (show success message)
const isAccepted = match.hasRequested && match.requestStatus === 'ACCEPTED';

// 4. Request rejected (show rejection message, could allow re-request)
const isRejected = match.hasRequested && match.requestStatus === 'REJECTED';

// 5. Match is full (show full message)
const isFull = match.currentPlayers >= match.requiredPlayers;

// 6. User is creator (show manage requests)
const isCreator = match.isCreator;
```

---

## ✅ Testing Checklist

### Frontend:
1. **[ ]** "Request to Join" button only shows when eligible
2. **[ ]** Button is disabled when request is pending
3. **[ ]** Appropriate message shows for accepted requests
4. **[ ]** Notification bell shows updated count after acceptance
5. **[ ]** Clicking notification navigates to match
6. **[ ]** Match creator can see and respond to requests
7. **[ ]** Match data refreshes after responding to request

### User Experience Flow:
1. **[ ]** Player A finds a match
2. **[ ]** Player A clicks "Request to Join"
3. **[ ]** Player A sees "Request Pending" message
4. **[ ]** Player A cannot request again
5. **[ ]** Player B sees the request
6. **[ ]** Player B clicks "Accept"
7. **[ ]** Player A receives email (check inbox/spam)
8. **[ ]** Player A sees notification bell badge increase
9. **[ ]** Player A clicks notification
10. **[ ]** Player A navigates to match details
11. **[ ]** Player A sees "Request Accepted" message

---

## 🔄 Complete Data Flow

```
User Action                     Frontend                Backend                   Notifications
──────────────────────────────────────────────────────────────────────────────────────────────────
1. Player A requests to join    POST /player/matches/   Create MatchRequest      -
                               {matchId}/request

2. Player B accepts request     PUT /player/matches/    Update MatchRequest      Create Notification
                               requests/{requestId}     Increment players        Send Email
                                                                                (async)

3. Player A checks dashboard    GET /notifications/     Return notifications     -
                               unread-count

4. Player A opens notifications GET /notifications/     Return notification      -
                               unread                  list

5. Player A clicks notification Navigate to match       -                        -
                               PUT /notifications/     Mark as read
                               {id}/read

6. Player A views match         GET /player/matches/    Return match with        -
                               {matchId}               hasRequested: true
                                                       requestStatus: ACCEPTED
```

---

## 📧 Email Preview

When a request is accepted, Player A will receive an email like this:

```
Subject: 🎉 Your Match Request Has Been Accepted!

Hi [Player Name],

Great news! [Creator Name] has accepted your request to join their match!

Match Details:
━━━━━━━━━━━━━━━━
Match: [Match Title]
Date & Time: [Match DateTime]
Location: [Location]
Organized by: [Creator Name]

You can now view match details and chat with other players in your dashboard.

[View Match Details Button]

See you on the field!

Best regards,
The Athletix Team
```

---

## 🚀 Next Steps

1. Create the `match.types.ts` file with proper interfaces
2. Update your match detail components to show request status
3. Implement the Match Requests Manager component
4. Test the complete flow from request to acceptance
5. Verify emails are sent and notifications appear
6. Handle edge cases (match full, duplicate requests, etc.)

---

## 💡 Additional Enhancements

### Future Improvements:
1. **WebSocket Support:** Real-time notifications without polling
2. **Push Notifications:** Browser notifications for immediate alerts
3. **Email Templates:** More sophisticated email designs with branding
4. **Request Expiration:** Auto-reject requests after X days
5. **Player Profiles:** View player details before accepting
6. **Chat System:** Enable messaging between accepted players
7. **Calendar Integration:** Add accepted matches to calendar
8. **Reminders:** Send reminder emails 24 hours before match

---

## 🐛 Common Issues & Solutions

### Issue: Button still shows after requesting
**Solution:** Ensure backend returns `hasRequested: true` and `requestStatus` in the match response

### Issue: Notification doesn't appear immediately
**Solution:** Implement shorter polling interval or use WebSockets for real-time updates

### Issue: Email not received
**Solution:** 
- Check spam folder
- Verify SMTP configuration
- Check application logs for email sending errors
- Test with a different email provider

### Issue: Can request multiple times
**Solution:** Backend should check `existsByMatchAndPlayer` before creating a new request

---

## 📚 Resources

- [Spring Mail Documentation](https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#mail)
- [React Toast Notifications](https://sonner.emilkowal.ski/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
