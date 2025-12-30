import type { RouteObject } from 'react-router-dom';
import VenueOwnerLayout from '@/layout/VenueOwnerLayout';
import VenueOwnerDashboard from '@/pages/venueOwner/VenueOwnerDashboard';
import VenueManagement from '@/pages/venueOwner/VenueManagement';
import VenueForm from '@/pages/venueOwner/VenueForm';
import VenueDetails from '@/pages/venueOwner/VenueDetails';
import BookingManagement from '@/pages/venueOwner/BookingManagement';
import BookingDetails from '@/pages/venueOwner/BookingDetails';
import Schedules from '@/pages/venueOwner/Schedules';
import Analytics from '@/pages/venueOwner/Analytics';
import Payments from '@/pages/venueOwner/Payments';
import Profile from '@/pages/venueOwner/Profile';
import ProtectedRoute from '@/routes/common/ProtectedRoute';

export const venueOwnerRoutes: RouteObject[] = [
  {
    path: '/venue-owner',
    element: (
      <ProtectedRoute allowedRoles={['VENUE_OWNER']}>
        <VenueOwnerLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <VenueOwnerDashboard /> },
      { path: 'dashboard', element: <VenueOwnerDashboard /> },
      { path: 'venues', element: <VenueManagement /> },
      { path: 'venues/add', element: <VenueForm /> },
      { path: 'venues/edit/:id', element: <VenueForm /> },
      { path: 'venues/view/:id', element: <VenueDetails /> },
      { path: 'bookings', element: <BookingManagement /> },
      { path: 'bookings/:id', element: <BookingDetails /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'schedules', element: <Schedules /> },
      { path: 'payments', element: <Payments /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
];
