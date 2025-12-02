import type { RouteObject } from 'react-router-dom';
import PlayerDashboard from '@/pages/player/PlayerDashboard';
import ProtectedRoute from '@/routes/common/ProtectedRoute';

export const playerRoutes: RouteObject[] = [
  {
    path: '/player',
    element: (
      <ProtectedRoute allowedRoles={['PLAYER']}>
        <PlayerDashboard />
      </ProtectedRoute>
    ),
  },
];
