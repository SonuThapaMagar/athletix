import type { RouteObject } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/Signup'
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
    element: <Login onSwitchToSignup={() => { window.location.href = '/signup' }} />,
  },
  {
    path: '/signup',
    element: <Signup onSwitchToLogin={() => { window.location.href = '/login' }} />,
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
