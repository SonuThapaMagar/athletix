import type { RouteObject } from 'react-router-dom';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import VenueManagement from '@/pages/admin/VenueManagement';
import EditVenue from '@/pages/admin/EditVenue';
import BookingManagement from '@/pages/admin/BookingManagement';
import PaymentsTransactions from '@/pages/admin/PaymentsTransactions';
import ContentModeration from '@/pages/admin/ContentModeration';
import ActivityMonitor from '@/pages/admin/ActivityMonitor';
import PlatformAnalytics from '@/pages/admin/PlatformAnalytics';
import ProtectedRoute from '@/routes/common/ProtectedRoute';
import AdminLayout from '@/layout/AdminLayout';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <UserManagement /> },
      { path: 'venues', element: <VenueManagement /> },
      { path: 'venues/edit/:id', element: <EditVenue /> },
      { path: 'bookings', element: <BookingManagement /> },
      { path: 'payments', element: <PaymentsTransactions /> },
      { path: 'content', element: <ContentModeration /> },
      { path: 'activity', element: <ActivityMonitor /> },
      { path: 'analytics', element: <PlatformAnalytics /> },
    ],
  },
];
