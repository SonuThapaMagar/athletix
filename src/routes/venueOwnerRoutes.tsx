import type { RouteObject } from 'react-router-dom'
import VenueOwnerLayout from '@/layout/VenueOwnerLayout'
import VenueOwnerDashboard from '@/pages/venueOwner/VenueOwnerDashboard'
import VenueManagement from '@/pages/venueOwner/VenueManagement'
import VenueForm from '@/pages/venueOwner/VenueForm'
import BookingManagement from '@/pages/venueOwner/BookingManagement'
import Schedules from '@/pages/venueOwner/Schedules'
import Analytics from '@/pages/venueOwner/Analytics'
import Payments from '@/pages/venueOwner/Payments'
import Profile from '@/pages/venueOwner/Profile'

export const venueOwnerRoutes: RouteObject[] = [
  {
    path: '/venue-owner',
    element: <VenueOwnerLayout><VenueOwnerDashboard /></VenueOwnerLayout>,
  },
  {
    path: '/venue-owner/dashboard',
    element: <VenueOwnerLayout><VenueOwnerDashboard /></VenueOwnerLayout>,
  },
  {
    path: '/venue-owner/venues',
    element: <VenueOwnerLayout><VenueManagement /></VenueOwnerLayout>,
  },
  {
    path: '/venue-owner/venues/add',
    element: <VenueOwnerLayout><VenueForm /></VenueOwnerLayout>,
  },
  {
    path: '/venue-owner/venues/edit/:id',
    element: <VenueOwnerLayout><VenueForm /></VenueOwnerLayout>,
  },
  {
    path: '/venue-owner/bookings',
    element: <VenueOwnerLayout><BookingManagement /></VenueOwnerLayout>,
  },
  {
    path: '/venue-owner/schedules',
    element: <VenueOwnerLayout><Schedules /></VenueOwnerLayout>,
  },
  {
    path: '/venue-owner/analytics',
    element: <VenueOwnerLayout><Analytics /></VenueOwnerLayout>,
  },
  {
    path: '/venue-owner/payments',
    element: <VenueOwnerLayout><Payments /></VenueOwnerLayout>,
  },
  {
    path: '/venue-owner/profile',
    element: <VenueOwnerLayout><Profile /></VenueOwnerLayout>,
  },
]
