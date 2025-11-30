import { playerRoutes } from "./playerRoutes";
import { venueOwnerRoutes } from "./venueOwnerRoutes";
import { adminRoutes } from "./adminRoutes";
import Signup from "@/pages/auth/Signup";
import Login from "@/pages/auth/Login";
import LandingPage from "@/pages/LandingPage";
import ProtectedRoute from "./common/ProtectedRoute";

export const appRoutes = [
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  // Protected Player Routes
  ...playerRoutes.map((route) => ({
    ...route,
    element: (
      <ProtectedRoute allowedRoles={["PLAYER"]}>{route.element}</ProtectedRoute>
    ),
    children: route.children?.map((child) => ({
      ...child,
      element: child.element,
    })),
  })),

  // Protected Venue Owner Routes
  ...venueOwnerRoutes.map((route) => ({
    ...route,
    element: (
      <ProtectedRoute allowedRoles={["VENUE_OWNER"]}>
        {route.element}
      </ProtectedRoute>
    ),
    children: route.children?.map((child) => ({
      ...child,
      element: child.element,
    })),
  })),

  // Admin (if any)
  ...adminRoutes.map((route) => ({
    ...route,
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>{route.element}</ProtectedRoute>
    ),
  })),

  { path: "*", element: <LandingPage /> },
];
