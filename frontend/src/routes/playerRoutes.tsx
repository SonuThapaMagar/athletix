// src/routes/playerRoutes.ts
import type { RouteObject } from "@/types/route";
import PlayerLayout from "@/layout/PlayerLayout";
import PlayerDashboard from "@/pages/player/PlayerDashboard";
import Booking from "@/pages/player/Booking";
import History from "@/pages/player/History";
import Matchmaking from "@/pages/player/Matchmaking";
import Profile from "@/pages/player/Profile";
import Settings from "@/pages/player/Settings";
import Help from "@/pages/player/Help";
import VenueDetails from "@/pages/player/VenueDetails";

export const playerRoutes: RouteObject[] = [
  {
    path: "/player",
    element: <PlayerLayout />,
    children: [
      { index: true, element: <PlayerDashboard /> },
      { path: "booking", element: <Booking /> },
      { path: "history", element: <History /> },
      { path: "matchmaking", element: <Matchmaking /> },
      { path: "profile", element: <Profile /> },
      { path: "settings", element: <Settings /> },
      { path: "help", element: <Help /> },
      { path: "venue/:id", element: <VenueDetails /> },
    ],
  },
];