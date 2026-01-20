import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";
import { HiOutlineHome, HiOutlineLightBulb, HiOutlineInformationCircle, HiOutlineMailOpen } from "react-icons/hi";
import logo from "@/assets/landing/final_logo-removebg-preview.png";

interface HeaderProps {
  onLogin?: () => void;
  onSignup?: () => void;
}

const Header = ({ onLogin, onSignup }: HeaderProps = {}) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", icon: HiOutlineHome, href: "#home" },
    { name: "Features", icon: HiOutlineLightBulb, href: "#features" },
    { name: "About Us", icon: HiOutlineInformationCircle, href: "#about-us" },
    { name: "Contact", icon: HiOutlineMailOpen, href: "#contact" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 shadow-md">
      <div className="bg-white backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center">
          {/* Logo - Clickable */}
          <button
            onClick={() => navigate("/")}
            className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img src={logo} alt="Athletix" className="h-10 lg:h-12 w-auto" />
          </button>

          {/* Desktop Navigation - centered */}
          <nav className="hidden lg:flex flex-1 justify-center gap-10 px-10 text-[#004369]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 text-sm font-medium tracking-wide text-[#1061dc] hover:text-[#043b8d] transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Login/Signup Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <button
              onClick={onLogin}
              className="text-[#1061dc] hover:text-[#043b8d] font-medium cursor-pointer transition-colors"
            >
              Login
            </button>
            <button
              onClick={onSignup}
              className="px-5 py-2 bg-[#1061dc] hover:bg-[#043b8d] rounded-full text-white font-medium transition-colors cursor-pointer"
            >
              Sign Up
            </button>
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
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-3 rounded-lg text-white hover:bg-[#1061dc]/20 hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </a>
              );
            })}

            {/* Mobile Auth Buttons */}
            <div className="border-t border-white/20 mt-2 pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onLogin?.();
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 px-3 rounded-lg text-white hover:bg-[#1061dc]/20 font-medium transition-colors text-left cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => {
                  onSignup?.();
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 px-3 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium transition-colors cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
