import type { RouteObject } from 'react-router-dom'
import AdminLayout from '@/layout/AdminLayout'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import UserManagement from '@/pages/admin/UserManagement'
import VenueManagement from '@/pages/admin/VenueManagement'
import EditVenue from '@/pages/admin/EditVenue'
import ContentModeration from '@/pages/admin/ContentModeration'
import ActivityMonitor from '@/pages/admin/ActivityMonitor'

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <AdminLayout><AdminDashboard /></AdminLayout>,
  },
  {
    path: '/admin/users',
    element: <AdminLayout><UserManagement /></AdminLayout>,
  },
  {
    path: '/admin/venues',
    element: <AdminLayout><VenueManagement /></AdminLayout>,
  },
  {
    path: '/admin/venues/edit/:id',
    element: <AdminLayout><EditVenue /></AdminLayout>,
  },
  {
    path: '/admin/content',
    element: <AdminLayout><ContentModeration /></AdminLayout>,
  },
  {
    path: '/admin/activity',
    element: <AdminLayout><ActivityMonitor /></AdminLayout>,
  },
  {
    path: '/admin/analytics',
    element: <AdminLayout><div className="p-6"><h2 className="text-2xl font-bold text-gray-900">Platform Analytics</h2><p className="text-gray-600">Coming soon</p></div></AdminLayout>,
  },
]
