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
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#2c5aa0] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Athletix</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-700 hover:text-[#2c5aa0] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-700 hover:text-[#2c5aa0] transition-colors">
              <MdNotifications className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-[#2c5aa0] transition-colors"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <MdPerson className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">John Doe</span>
                <MdKeyboardArrowDown className="w-4 h-4" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {profileMenuItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {item.name}
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
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#2c5aa0] hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <MdClose className="w-6 h-6" />
              ) : (
                <MdMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {/* Mobile Navigation Items */}
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 text-gray-700 hover:text-[#2c5aa0] hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </a>
              )
            })}

            {/* Mobile Notifications */}
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center space-x-3">
                <MdNotifications className="w-5 h-5 text-gray-700" />
                <span className="text-base font-medium text-gray-700">Notifications</span>
              </div>
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </div>

            {/* Mobile Profile Section */}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex items-center space-x-3 px-3 py-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <MdPerson className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-medium text-gray-900">John Doe</div>
                  <div className="text-sm text-gray-500">john@example.com</div>
                </div>
              </div>

              {/* Mobile Profile Menu */}
              <div className="mt-2 space-y-1">
                {profileMenuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-base text-gray-700 hover:text-[#2c5aa0] hover:bg-gray-100 rounded-md transition-colors"
                  >
                    {item.name}
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
