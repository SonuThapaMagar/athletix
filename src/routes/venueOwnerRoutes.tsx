import type { RouteObject } from 'react-router-dom'
import VenueOwnerDashboard from '@/pages/venueOwner/VenueOwnerDashboard'
import VenueManagement from '@/pages/venueOwner/VenueManagement'
import BookingManagement from '@/pages/venueOwner/BookingManagement'

export const venueOwnerRoutes: RouteObject[] = [
  {
    path: '/venue-owner',
    element: <VenueOwnerDashboard />,
  },
  {
    path: '/venue-owner/venues',
    element: <VenueManagement />,
  },
  {
    path: '/venue-owner/bookings',
    element: <BookingManagement />,
  },
]
