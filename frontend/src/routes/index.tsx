import type { RouteObject } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/Signup'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import ResetPassword from '@/pages/auth/ResetPassword'
import { playerRoutes } from './playerRoutes'
import { venueOwnerRoutes } from './venueOwnerRoutes'
import { adminRoutes } from './adminRoutes'

export const appRoutes: RouteObject[] = [
  // Public routes
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  
  // Player routes
  ...playerRoutes,
  
  // Venue Owner routes
  ...venueOwnerRoutes,
  
  // Admin routes
  ...adminRoutes,
  
  // Catch-all route
  {
    path: '*',
    element: <LandingPage />,
  },
]
