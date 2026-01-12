import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import PlayerDashboard from '@/pages/player/PlayerDashboard';
import ProtectedRoute from '@/routes/common/ProtectedRoute';

import VenueDetails from "@/pages/player/VenueDetails";
import Booking from '@/pages/player/Booking';
import BookingDetails from '@/pages/player/BookingDetails';
import MyBookings from '@/pages/player/MyBookings';
import PaymentSuccess from '@/pages/payment/PaymentSuccess';
import PaymentFailure from '@/pages/payment/PaymentFailure';
import History from '@/pages/player/History';
import Profile from '@/pages/player/Profile';
import Settings from '@/pages/player/Settings';
import Matchmaking from '@/pages/player/Matchmaking';
import FindMatches from '@/pages/player/FindMatches';
import CreateMatch from '@/pages/player/CreateMatch';
import MyMatchPosts from '@/pages/player/MyMatchPosts';
import MatchDetail from '@/pages/player/MatchDetail';
import MatchChat from '@/pages/player/MatchChat';

export const playerRoutes: RouteObject[] = [
  {
    path: '/player',
    element: (
      <ProtectedRoute allowedRoles={['PLAYER']}>
        <PlayerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/player/history',
    element: (
      <ProtectedRoute allowedRoles={['PLAYER']}>
        <History />
      </ProtectedRoute>
    ),
  },
  {
    path: '/player/venue/:id',
    element: (
      <ProtectedRoute allowedRoles={['PLAYER']}>
        <VenueDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/player/booking/:id',  
    element: (
      <ProtectedRoute allowedRoles={['PLAYER']}>
        <Booking />
      </ProtectedRoute>
    ),
  },
  {
    path: '/player/booking',
    element: <Navigate to="/player/bookings" replace />,
  },
  {
    path: '/player/bookings',
    element: (
      <ProtectedRoute allowedRoles={['PLAYER']}>
        <MyBookings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/player/booking-details/:id',
    element: (
      <ProtectedRoute allowedRoles={['PLAYER']}>
        <BookingDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payment/success',
    element: <PaymentSuccess />
  },
  {
    path: '/payment/failure',
    element: <PaymentFailure />
  },
  {
    path: '/player/profile',
    element: (
      <ProtectedRoute allowedRoles={['PLAYER']}>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/player/settings',
    element: (
      <ProtectedRoute allowedRoles={['PLAYER']}>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/player/matchmaking',
    element: (
      <ProtectedRoute allowedRoles={['PLAYER']}>
        <Matchmaking />
      </ProtectedRoute>
    ),
  },
  {
    path: '/player/matchmaking/find',
    element: (
      <ProtectedRoute allowedRoles={['PLAYER']}>
        <FindMatches />
      </ProtectedRoute>
    ),
  },
  {
    path: '/player/matchmaking/create',
    element: (
      <ProtectedRoute allowedRoles={['PLAYER']}>
        <CreateMatch />
      </ProtectedRoute>
    ),
  },
  {
    path: '/player/matchmaking/my-posts',
    element: (
      <ProtectedRoute allowedRoles={['PLAYER']}>
        <MyMatchPosts />
      </ProtectedRoute>
    ),
  },
  {
    path: '/player/matches/:id',
    element: (
      <ProtectedRoute allowedRoles={['PLAYER']}>
        <MatchDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: '/player/matches/:id/chat',
    element: (
      <ProtectedRoute allowedRoles={['PLAYER']}>
        <MatchChat />
      </ProtectedRoute>
    ),
  },
];

