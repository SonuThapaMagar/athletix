import type { RouteObject } from 'react-router-dom'
import PlayerDashboard from '@/pages/player/PlayerDashboard'
import Booking from '@/pages/player/Booking'
import Matchmaking from '@/pages/player/Matchmaking'
import History from '@/pages/player/History'
import VenueDetails from '@/pages/player/VenueDetails'
import Profile from '@/pages/player/Profile'
import Settings from '@/pages/player/Settings'
import Help from '@/pages/player/Help'

export const playerRoutes: RouteObject[] = [
  {
    path: '/player',
    element: <PlayerDashboard />,
  },
  {
    path: '/player/booking',
    element: <Booking />,
  },
  {
    path: '/player/matchmaking',
    element: <Matchmaking />,
  },
  {
    path: '/player/history',
    element: <History />,
  },
  {
    path: '/player/profile',
    element: <Profile />,
  },
  {
    path: '/player/settings',
    element: <Settings />,
  },
  {
    path: '/player/help',
    element: <Help />,
  },
  {
    path: '/venue/:id',
    element: <VenueDetails />,
  },
]
