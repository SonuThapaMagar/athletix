import type { RouteObject } from 'react-router-dom'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import UserManagement from '@/pages/admin/UserManagement'

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <AdminDashboard />,
  },
  {
    path: '/admin/users',
    element: <UserManagement />,
  },
]
