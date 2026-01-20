import type { RouteObject } from 'react-router-dom';
import { playerRoutes } from './playerRoutes';
import { adminRoutes } from './adminRoutes';
import { venueOwnerRoutes } from './venueOwnerRoutes';
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import NotFound from '@/pages/NotFound';

export const appRoutes: RouteObject[] = [
  // Public routes
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <Login/> },
  { path: '/signup', element: <Signup/> },

  // Error pages (accessible via direct navigation)
  { path: '/404', element: <NotFound type="notfound" /> },
  { path: '/forbidden', element: <NotFound type="forbidden" /> },

  // Protected routes
  ...adminRoutes,
  ...venueOwnerRoutes,
  ...playerRoutes,

  // Catch-all - 404 Not Found (MUST be last)
  { path: '*', element: <NotFound type="notfound" /> },
];
