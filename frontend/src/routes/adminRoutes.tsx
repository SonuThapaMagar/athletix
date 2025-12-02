import type { RouteObject } from 'react-router-dom';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import VenueManagement from '@/pages/admin/VenueManagement';
import EditVenue from '@/pages/admin/EditVenue';
import ContentModeration from '@/pages/admin/ContentModeration';
import ActivityMonitor from '@/pages/admin/ActivityMonitor';
import ProtectedRoute from '@/routes/common/ProtectedRoute';
import AdminNavLayout from '@/layout/AdminNavLayout';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AdminNavLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <UserManagement /> },
      { path: 'venues', element: <VenueManagement /> },
      { path: 'venues/edit/:id', element: <EditVenue /> },
      { path: 'content', element: <ContentModeration /> },
      { path: 'activity', element: <ActivityMonitor /> },
    ],
  },
];
