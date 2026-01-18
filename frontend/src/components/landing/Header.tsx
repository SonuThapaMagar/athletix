import { useState } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import logo from "@/assets/landing/final_logo-removebg-preview.png";

interface HeaderProps {
  onLogin?: () => void;
  onSignup?: () => void;
}

const Header = ({ onLogin, onSignup }: HeaderProps = {}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = ["Home", "Features", "About Us", "Contact"];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Floating Pill - now properly centered overall, with nav items centered on desktop */}
      <div className="pointer-events-auto mx-auto">
        <div className="bg-gradient-to-r from-primary/30 to-primary rounded-b-xl px-6 py-3 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center">
            {/* Logo - left aligned */}
            <div className="flex-shrink-0">
              <img src={logo} alt="Athletix" className="h-10 lg:h-12 w-auto" />
            </div>

            {/* Desktop Navigation - centered in the available space */}
            <nav className="hidden lg:flex flex-1 justify-center gap-10 px-8">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-white/90 hover:text-white text-sm lg:text-base font-medium tracking-wide transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Optional: Add Login/Signup buttons on the right (uncomment if you pass the props) */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
              <button
                onClick={onLogin}
                className="text-white/90 hover:text-white font-medium cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={onSignup}
                className="px-5 py-2 bg-white/20 rounded-full text-white font-medium hover:bg-white/30 transition cursor-pointer"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Button - pushed to the right */}
            <button
              className="lg:hidden ml-auto text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="mt-6 pb-4 flex flex-col items-center gap-5 lg:hidden">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-white text-lg font-medium hover:text-white/80 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
