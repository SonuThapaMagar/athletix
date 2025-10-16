import { useState } from 'react'
import { 
  MdHome, 
  MdBookOnline, 
  MdPeople, 
  MdHistory, 
  MdNotifications, 
  MdPerson,
  MdMenu,
  MdClose,
  MdKeyboardArrowDown
} from 'react-icons/md'

const PlayerNavLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  const navigationItems = [
    { name: 'Home', icon: MdHome, href: '/player' },
    { name: 'Booking', icon: MdBookOnline, href: '/player/booking' },
    { name: 'Matchmaking', icon: MdPeople, href: '/player/matchmaking' },
    { name: 'History', icon: MdHistory, href: '/player/history' },
  ]

  const profileMenuItems = [
    { name: 'Profile', href: '/player/profile' },
    { name: 'Settings', href: '/player/settings' },
    { name: 'Help & Support', href: '/player/help' },
    { name: 'Logout', href: '/logout' },
  ]

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="w-8 h-8 bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f] rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <span className="text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900 group-hover:text-[#2c5aa0] transition-colors duration-300">Athletix</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group relative flex items-center space-x-2 text-gray-700 hover:text-[#2c5aa0] px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer"
                  >
                    {/* Icon with enhanced hover effect */}
                    <Icon className="w-5 h-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
                    
                    {/* Text with slide effect */}
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                    
                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#2c5aa0] rounded-full group-hover:w-full transition-all duration-300"></div>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <button className="group relative p-2 text-gray-700 hover:text-[#2c5aa0] transition-all duration-300 cursor-pointer">
              <MdNotifications className="w-6 h-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                3
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="group flex items-center space-x-2 text-gray-700 hover:text-[#2c5aa0] transition-all duration-300 cursor-pointer"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <MdPerson className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">John Doe</span>
                <MdKeyboardArrowDown className={`w-4 h-4 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : 'group-hover:rotate-180'}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-300">
                  {profileMenuItems.map((item, index) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:text-[#2c5aa0] transition-all duration-300 cursor-pointer relative"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Text with slide effect */}
                      <span className="group-hover:translate-x-2 transition-transform duration-300">{item.name}</span>
                      
                      {/* Hover icon effect */}
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="group inline-flex items-center justify-center p-2 text-gray-700 hover:text-[#2c5aa0] transition-all duration-300 cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <MdClose className="w-6 h-6 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
              ) : (
                <MdMenu className="w-6 h-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-in slide-in-from-top-2 duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
            {/* Mobile Navigation Items */}
            {navigationItems.map((item, index) => {
              const Icon = item.icon
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center space-x-3 text-gray-700 hover:text-[#2c5aa0] block px-3 py-3 text-base font-medium transition-all duration-300 cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                  
                  {/* Hover arrow effect */}
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              )
            })}

            {/* Mobile Notifications */}
            <div className="group flex items-center justify-between px-3 py-3 transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-3">
                <MdNotifications className="w-5 h-5 text-gray-700 group-hover:text-[#2c5aa0] group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                <span className="text-base font-medium text-gray-700 group-hover:text-[#2c5aa0] group-hover:translate-x-1 transition-all duration-300">Notifications</span>
              </div>
              <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                3
              </span>
            </div>

            {/* Mobile Profile Section */}
            <div className="border-t border-gray-200 pt-3">
              <div className="group flex items-center space-x-3 px-3 py-3 transition-all duration-300 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <MdPerson className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="group-hover:translate-x-1 transition-transform duration-300">
                  <div className="text-base font-medium text-gray-900 group-hover:text-[#2c5aa0] transition-colors duration-300">John Doe</div>
                  <div className="text-sm text-gray-500">john@example.com</div>
                </div>
              </div>

              {/* Mobile Profile Menu */}
              <div className="mt-2 space-y-1">
                {profileMenuItems.map((item, index) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-3 py-3 text-base text-gray-700 hover:text-[#2c5aa0] transition-all duration-300 cursor-pointer"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                    
                    {/* Hover arrow effect */}
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default PlayerNavLayout
