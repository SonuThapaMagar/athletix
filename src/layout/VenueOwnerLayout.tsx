import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  MdDashboard,
  MdBusiness,
  MdSchedule,
  MdEvent,
  MdAnalytics,
  MdPayment,
  MdPerson,
  MdLogout,
  MdMenu,
  MdClose,
  MdNotifications,
  MdSettings
} from 'react-icons/md'
import LogoutModal from '@/components/common/LogoutModalNew'

interface MenuItem {
  id: string
  label: string
  icon: any
  path: string
  badge?: number
}

interface VenueOwnerLayoutProps {
  children: React.ReactNode
}

const VenueOwnerLayout = ({ children }: VenueOwnerLayoutProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: MdDashboard, path: '/venue-owner/dashboard' },
    { id: 'venues', label: 'Manage Venues', icon: MdBusiness, path: '/venue-owner/venues' },
    { id: 'schedules', label: 'Schedules', icon: MdSchedule, path: '/venue-owner/schedules' },
    { id: 'bookings', label: 'Bookings', icon: MdEvent, path: '/venue-owner/bookings', badge: 5 },
    { id: 'analytics', label: 'Analytics', icon: MdAnalytics, path: '/venue-owner/analytics' },
    { id: 'payments', label: 'Payments', icon: MdPayment, path: '/venue-owner/payments' },
    { id: 'profile', label: 'Profile', icon: MdPerson, path: '/venue-owner/profile' },
    { id: 'logout', label: 'Logout', icon: MdLogout, path: '/logout' }
  ]

  const handleMenuClick = (item: MenuItem) => {
    if (item.id === 'logout') {
      setShowLogoutModal(true)
    } else {
      navigate(item.path)
    }
    setSidebarOpen(false) // Close mobile menu
  }

  const handleLogout = () => {
    setShowLogoutModal(false)
    navigate('/')
  }

  const getCurrentPageTitle = () => {
    const currentPath = location.pathname
    
    // Handle specific pages
    if (currentPath.startsWith('/venue-owner/venues/add')) {
      return 'Add New Venue'
    }
    if (currentPath.startsWith('/venue-owner/venues/edit')) {
      return 'Edit Venue'
    }
    
    const currentItem = menuItems.find(item => item.path === currentPath)
    return currentItem ? currentItem.label : 'Dashboard'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-lg text-gray-900">Athletix</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {sidebarOpen ? <MdClose className="w-6 h-6" /> : <MdMenu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900">Athletix</span>
                <p className="text-xs text-gray-500">Venue Owner</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">VO</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">John Smith</h3>
                <p className="text-sm text-gray-500">Venue Owner</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto min-h-0">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path === '/venue-owner/venues' && 
                 (location.pathname.startsWith('/venue-owner/venues/add') || 
                  location.pathname.startsWith('/venue-owner/venues/edit')))
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-[#2c5aa0] text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-[#2c5aa0]'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#2c5aa0]'}`} />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                      isActive ? 'bg-white text-[#2c5aa0]' : 'bg-red-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <MdNotifications className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New Booking</p>
                <p className="text-xs text-gray-500">You have 3 new bookings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
          {/* Top Bar */}
          <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 px-6 py-4 hidden lg:block">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{getCurrentPageTitle()}</h1>
                <p className="text-gray-600">Manage your venues and bookings efficiently</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                  <MdNotifications className="w-6 h-6" />
                </button>
                <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                  <MdSettings className="w-6 h-6" />
                </button>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">JS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  )
}

export default VenueOwnerLayout
