// src/layout/PlayerNavLayout.tsx
import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  MdHome,
  MdBookOnline,
  MdPeople,
  MdHistory,
  MdNotifications,
  MdPerson,
  MdMenu,
  MdClose,
  MdKeyboardArrowDown,
} from "react-icons/md";
import LogoutModal from "@/components/common/LogoutModalNew";
import { FETCH_PROFILE } from "@/redux/actions/user.actions";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { LOGOUT_ACTION } from "@/redux/actions/auth.actions";

const PlayerNavLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.authSlice.profile);

  useEffect(() => {
    if (!user && localStorage.getItem("accessToken")) {
      FETCH_PROFILE().catch((err) =>
        console.error("Failed to fetch profile", err)
      );
    }
  }, [user]);

  const navigationItems = [
    { name: "Home", icon: MdHome, href: "/player" },
    { name: "Booking", icon: MdBookOnline, href: "/player/bookings" },
    { name: "Matchmaking", icon: MdPeople, href: "/player/matchmaking" },
    { name: "History", icon: MdHistory, href: "/player/history" },
  ];

  const profileMenuItems = [
    {
      name: "Profile",
      href: "/player/profile",
      action: () => navigate("/player/profile"),
    },
    {
      name: "Settings",
      href: "/player/settings",
      action: () => navigate("/player/settings"),
    },
    {
      name: "Help & Support",
      href: "/player/help",
      action: () => navigate("/player/help"),
    },
    { name: "Logout", href: "#", action: () => setShowLogoutModal(true) },
  ];

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await LOGOUT_ACTION();
    navigate("/login");
  };

  const handleNavigation = (item: any) => {
    if (item.action) {
      item.action();
      setIsProfileDropdownOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f] rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Athletix</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#2c5aa0] border-b-2 border-[#2c5aa0]"
                      : "text-gray-700 hover:text-[#2c5aa0]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="relative p-2 text-gray-700 hover:text-[#2c5aa0]">
              <MdNotifications className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-[#2c5aa0]"
              >
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || "Player"}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email || ""}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                  <MdPerson className="w-5 h-5" />
                </div>
                {/* <span className="text-sm font-medium">{user?.name || 'Player'}</span> */}
                <MdKeyboardArrowDown
                  className={`w-4 h-4 transition-transform ${
                    isProfileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                  {profileMenuItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item)}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:text-[#2c5aa0]"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isMobileMenuOpen ? (
              <MdClose className="w-6 h-6" />
            ) : (
              <MdMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
                  isActive
                    ? "text-[#2c5aa0] bg-blue-50"
                    : "text-gray-700 hover:text-[#2c5aa0]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </nav>
  );
};

export default PlayerNavLayout;
