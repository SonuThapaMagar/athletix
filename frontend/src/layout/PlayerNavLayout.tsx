import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { CiBasketball } from "react-icons/ci";
import { BiBullseye } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { MdSportsHandball } from "react-icons/md";

import logo from "@/assets/landing/final_logo-removebg-preview.png";

import { MdMenu, MdClose, MdKeyboardArrowDown } from "react-icons/md";

import LogoutModal from "@/components/common/LogoutModalNew";
import { FETCH_PROFILE } from "@/redux/actions/user.actions";
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
      FETCH_PROFILE().catch(console.error);
    }
  }, [user]);

  const navigationItems = [
    { name: "Home", icon: MdSportsHandball, href: "/player" },
    { name: "Booking", icon: CiBasketball, href: "/player/bookings" },
    { name: "Find Matches", icon: BiBullseye, href: "/player/matchmaking" },
  ];

  const profileMenuItems = [
    { name: "Profile", action: () => navigate("/player/profile") },
    { name: "Settings", action: () => navigate("/player/settings") },
    { name: "Logout", action: () => setShowLogoutModal(true) },
  ];

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await LOGOUT_ACTION();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="bg-white backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center">
          {/* Logo */}
          <Link to="/player" className="flex-shrink-0">
            <img src={logo} alt="Athletix" className="h-10 lg:h-12 w-auto" />
          </Link>

          {/* Desktop Nav (Centered) */}
          <nav className="hidden lg:flex flex-1 justify-center gap-10 px-10 text-[#004369]">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 text-sm font-medium tracking-wide transition
                    ${
                      isActive
                        ? "bg-[#1061dc]/20 text-[#1061dc] rounded-2xl px-2 py-1"
                        : "text-[#1061dc] hover:text-[#043b8d]"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Profile (Desktop) */}
          <div className="hidden lg:flex items-center relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 text-[#1061dc] hover:text-[#1061dc]/90 transition cursor-pointer"
            >
              <div className="text-right leading-tight">
                <p className="text-sm font-semibold">
                  {user?.name || "Player"}
                </p>
                <p className="text-xs text-[#1061dc]">{user?.email}</p>
              </div>

              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <FaUserCircle className="w-5 h-5" />
              </div>

              <MdKeyboardArrowDown
                className={`transition-transform  ${
                  isProfileDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 top-full mt-3 w-48 bg-white rounded-xl shadow-lg border py-2">
                {profileMenuItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={item.action}
                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition cursor-pointer"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden ml-auto text-[#004369]"
          >
            {isMobileMenuOpen ? <MdClose size={26} /> : <MdMenu size={26} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          <div className="bg-[#1061dc] text-white px-4 py-4 flex flex-col gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 py-3 px-3 rounded-lg transition
                    ${
                      isActive
                        ? "bg-[#1061dc]/30 text-white"
                        : "text-white hover:bg-[#1061dc]/20 hover:text-white"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile Profile */}
            <div className="border-t border-white/20 mt-2 pt-2 flex flex-col gap-2">
              {profileMenuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    item.action();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 py-2 px-3 rounded-lg text-white hover:bg-[#1061dc]/20 hover:text-white text-left transition"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </header>
  );
};

export default PlayerNavLayout;
