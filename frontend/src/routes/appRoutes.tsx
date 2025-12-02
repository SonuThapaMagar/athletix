import type { RouteObject } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import { playerRoutes } from './playerRoutes';

export const appRoutes: RouteObject[] = [
  // Public routes
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <Login/> },
  { path: '/signup', element: <Signup/> },

  // Protected routes
  ...playerRoutes,
  // ...venueOwnerRoutes,
  // ...adminRoutes,

  // Catch-all
  { path: '*', element: <LandingPage /> },
];
