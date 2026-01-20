import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import NotFoundImage from "./../assets/403.svg"; 

interface NotFoundProps {
  type?: "forbidden" | "notfound"; 
}

export default function NotFound({ type }: NotFoundProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userRole } = useSelector((state: RootState) => state.authSlice);

  const pageType = type
    ? type
    : location.pathname === "/forbidden"
    ? "forbidden"
    : "notfound";

  const handleGoBack = () => {
    if (pageType === "forbidden") {
      // For forbidden access, redirect to appropriate dashboard based on role
      if (isLoggedIn && userRole) {
        const roleRoutes: Record<string, string> = {
          PLAYER: "/player",
          VENUE_OWNER: "/venue-owner",
          ADMIN: "/admin"
        };
        const dashboardUrl = roleRoutes[userRole] || "/";
        navigate(dashboardUrl);
      } else {
        navigate("/");
      }
    } else {
      // For not found, try to go back or return to home
      if (isLoggedIn && userRole) {
        const roleRoutes: Record<string, string> = {
          PLAYER: "/player",
          VENUE_OWNER: "/venue-owner",
          ADMIN: "/admin"
        };
        const dashboardUrl = roleRoutes[userRole] || "/";
        navigate(dashboardUrl);
      } else {
        navigate("/");
      }
    }
  };

  const title = pageType === "forbidden" ? "403" : "404";
  const message =
    pageType === "forbidden"
      ? "You do not have permission to access this page."
      : "The page you are looking for does not exist.";

  const subTitle = pageType === "forbidden" ? "Forbidden" : "Not Found";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <img
        src={NotFoundImage}
        alt="Not Found"
        className="w-64 md:w-80 mb-6"
      />
      <h1 className="text-7xl font-bold text-primary">{title}</h1>
      <p className="mt-4 text-2xl font-medium text-gray-600">{subTitle}</p>
      <p className="mt-2 text-lg text-gray-500 max-w-md">{message}</p>

      <button
        onClick={handleGoBack}
        className="mt-8 px-8 py-3 bg-primary cursor-pointer text-white font-medium rounded-lg hover:bg-blue-700 transition"
      >
        {pageType === "forbidden" ? "Go to Dashboard" : "Go Home"}
      </button>
    </div>
  );
}