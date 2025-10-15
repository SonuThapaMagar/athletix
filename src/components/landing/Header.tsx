import { useState } from 'react';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

type HeaderProps = {
  onLogin: () => void;
  onSignup: () => void;
};

const Header = ({ onLogin, onSignup }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      {/* Full-width navbar */}
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-gradient-to-br from-primary to-primary-80 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-white font-bold text-lg lg:text-xl">A</span>
              </div>
              <span className="font-bold text-xl lg:text-2xl text-gray-900 group-hover:text-primary transition-colors duration-300">
                ATHLETIX
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-primary font-medium transition-colors duration-300 relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#sports"
                className="text-gray-700 hover:text-primary font-medium transition-colors duration-300 relative group"
              >
                Sports
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#how"
                className="text-gray-700 hover:text-primary font-medium transition-colors duration-300 relative group"
              >
                How it works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={onLogin}
                className="px-6 py-2.5 text-gray-700 cursor-pointer font-medium hover:text-primary transition-colors duration-300"
              >
                Log in
              </button>
              <button
                onClick={onSignup}
                className="px-6 py-2.5 bg-primary text-white cursor-pointer font-medium rounded-lg hover:bg-primary-80 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Sign up
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <HiX className="h-6 w-6" />
              ) : (
                <HiMenuAlt3 className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
              <nav className="flex flex-col space-y-4">
                <a
                  href="#features"
                  className="text-gray-700 hover:text-primary font-medium py-2 transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#sports"
                  className="text-gray-700 hover:text-primary font-medium py-2 transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sports
                </a>
                <a
                  href="#how"
                  className="text-gray-700 hover:text-primary font-medium py-2 transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How it works
                </a>
                
                {/* Mobile Action Buttons */}
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      onLogin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors duration-300"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => {
                      onSignup();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-80 transition-colors duration-300 shadow-lg"
                  >
                    Sign up
                  </button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
