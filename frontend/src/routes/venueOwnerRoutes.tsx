import type { RouteObject } from "react-router-dom";
import VenueOwnerLayout from "@/layout/VenueOwnerLayout";
import VenueOwnerDashboard from "@/pages/venueOwner/VenueOwnerDashboard";
import VenueManagement from "@/pages/venueOwner/VenueManagement";
import VenueForm from "@/pages/venueOwner/VenueForm";
import BookingManagement from "@/pages/venueOwner/BookingManagement";
import Schedules from "@/pages/venueOwner/Schedules";
import Analytics from "@/pages/venueOwner/Analytics";
import Payments from "@/pages/venueOwner/Payments";
import Profile from "@/pages/venueOwner/Profile";

export const venueOwnerRoutes: RouteObject[] = [
  {
    path: "/venue-owner",
    element: <VenueOwnerLayout />,
    children: [
      { index: true, element: <VenueOwnerDashboard /> },
      { path: "dashboard", element: <VenueOwnerDashboard /> },
      { path: "venues", element: <VenueManagement /> },
      { path: "venues/add", element: <VenueForm /> },
      { path: "venues/edit/:id", element: <VenueForm /> },
      { path: "bookings", element: <BookingManagement /> },
      { path: "analytics", element: <Analytics /> },
      { path: "schedules", element: <Schedules /> },
      { path: "payments", element: <Payments /> },
      { path: "profile", element: <Profile /> },
    ],
  },
];