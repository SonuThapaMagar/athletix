import type { RouteObject } from 'react-router-dom';
import PlayerDashboard from '@/pages/player/PlayerDashboard';
import ProtectedRoute from '@/routes/common/ProtectedRoute';

import VenueDetails from "@/pages/player/VenueDetails";

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
];

