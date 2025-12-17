import type { RouteObject } from 'react-router-dom';
import PlayerDashboard from '@/pages/player/PlayerDashboard';
import ProtectedRoute from '@/routes/common/ProtectedRoute';

import VenueDetails from "@/pages/player/VenueDetails";
import Booking from '@/pages/player/Booking';
import PaymentSuccess from '@/pages/payment/PaymentSuccess';
import PaymentFailure from '@/pages/payment/PaymentFailure';

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
  path: '/payment/success',
  element: <PaymentSuccess />
},
{
  path: '/payment/failure',
  element: <PaymentFailure />
}

];

