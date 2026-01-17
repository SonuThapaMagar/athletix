// src/layout/PlayerNavLayout.tsx
import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import logo from '@/assets/athletix-logo-icon.svg';
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
import { toast } from "sonner";

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
    { name: "Find Matches", icon: MdPeople, href: "/player/matchmaking" },
    // { name: "History", icon: MdHistory, href: "/player/history" },
  ];

  const profileMenuItems = [
    {
      name: "Profile",
      href: "/player/profile",
      action: () => navigate("/player/profile"),
    },
    // {
    //   name: "My Match Posts",
    //   href: "/player/matchmaking/my-posts",
    //   action: () => navigate("/player/matchmaking/my-posts"),
    // },
    {
      name: "Settings",
      href: "/player/settings",
      action: () => navigate("/player/settings"),
    },
    // {
    //   name: "Help & Support",
    //   href: "/player/help",
    //   action: () => navigate("/player/help"),
    // },
    { name: "Logout", href: "#", action: () => setShowLogoutModal(true) },
  ];

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await LOGOUT_ACTION();
    toast.success("Logged out successfully");
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
    <nav className="bg-gradient-to-r from-[#C8E8F0] via-[#D4F5E3] to-[#C8E8F0] shadow-sm border-b border-[#A8DFE8]/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/player" className="flex items-center cursor-pointer group">
            <img 
              src={logo} 
              alt="Athletix Logo" 
              className="h-12 transition-transform duration-300 group-hover:scale-110 object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg cursor-pointer ${
                    isActive
                      ? "text-[#00425b] bg-white/60 shadow-sm"
                      : "text-[#2c5aa0] hover:text-[#00425b] hover:bg-white/40"
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
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 text-[#2c5aa0] hover:text-[#00425b] cursor-pointer px-3 py-2 rounded-lg hover:bg-white/40 transition-colors"
              >
                <div className="text-right">
                  <p className="text-sm font-medium text-[#00425b]">
                    {user?.name || "Player"}
                  </p>
                  <p className="text-xs text-[#2c5aa0]">{user?.email || ""}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-[#B0DFE8] to-[#98D6E0] rounded-full flex items-center justify-center shadow-sm">
                  <MdPerson className="w-5 h-5 text-[#00425b]" />
                </div>
                <MdKeyboardArrowDown
                  className={`w-4 h-4 text-[#2c5aa0] transition-transform ${
                    isProfileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#D4F5E3]/40 py-2 z-50">
                  {profileMenuItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item)}
                      className="w-full text-left px-4 py-3 text-sm text-[#2c5aa0] hover:text-[#00425b] hover:bg-[#C8E8F0]/30 cursor-pointer transition-colors"
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
            className="md:hidden p-2 text-[#2c5aa0] cursor-pointer hover:text-[#00425b]"
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
        <div className="md:hidden bg-gradient-to-b from-white/80 to-[#C8E8F0]/20 border-t border-[#A8DFE8]/30">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 transition-colors cursor-pointer ${
                  isActive
                    ? "text-[#00425b] bg-[#C8E8F0]/40"
                    : "text-[#2c5aa0] hover:text-[#00425b] hover:bg-[#D4F5E3]/20"
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
