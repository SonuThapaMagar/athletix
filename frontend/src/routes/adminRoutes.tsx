import type { RouteObject } from 'react-router-dom';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import UserDetail from '@/pages/admin/UserDetail';
import VenueManagement from '@/pages/admin/VenueManagement';
import VenueDetail from '@/pages/admin/VenueDetail';
import EditVenue from '@/pages/admin/EditVenue';
import BookingManagement from '@/pages/admin/BookingManagement';
import BookingDetail from '@/pages/admin/BookingDetail';
import PaymentsTransactions from '@/pages/admin/PaymentsTransactions';
import PaymentDetail from '@/pages/admin/PaymentDetail';
import ContentModeration from '@/pages/admin/ContentModeration';
import ContentDetail from '@/pages/admin/ContentDetail';
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
      { path: 'users/:id', element: <UserDetail /> },
      { path: 'venues', element: <VenueManagement /> },
      { path: 'venues/:id', element: <VenueDetail /> },
      { path: 'venues/edit/:id', element: <EditVenue /> },
      { path: 'bookings', element: <BookingManagement /> },
      { path: 'bookings/:id', element: <BookingDetail /> },
      { path: 'payments', element: <PaymentsTransactions /> },
      { path: 'payments/:id', element: <PaymentDetail /> },
      { path: 'content', element: <ContentModeration /> },
      { path: 'content/:id', element: <ContentDetail /> },
      { path: 'activity', element: <ActivityMonitor /> },
      { path: 'analytics', element: <PlatformAnalytics /> },
    ],
  },
];
