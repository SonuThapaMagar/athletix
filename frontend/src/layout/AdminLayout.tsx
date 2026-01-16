import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  MdDashboard,
  MdBusiness,
  MdPeople,
  MdContentCopy,
  MdTimeline,
  MdAnalytics,
  MdLogout,
  MdMenu,
  MdClose,
  MdNotifications,
  MdSettings,
  MdSecurity,
  MdEvent,
  MdPayment
} from 'react-icons/md'
import LogoutModal from '@/components/common/LogoutModalNew'
import { LOGOUT_ACTION } from '@/redux/actions/auth.actions'
import { FETCH_PROFILE } from '@/redux/actions/user.actions'
import type { StateType } from '@/redux/slices'
import { toast } from 'sonner'

interface MenuItem {
  id: string
  label: string
  icon: any
  path: string
  badge?: number
}

const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = useSelector((state: StateType) => state.authSlice)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // Fetch profile on mount if not already loaded
  useEffect(() => {
    if (!profile) {
      FETCH_PROFILE().catch((err) => {
        console.error('Failed to fetch profile:', err)
      })
    }
  }, [profile])

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: MdDashboard, path: '/admin' },
    { id: 'users', label: 'User Management', icon: MdPeople, path: '/admin/users' },
    { id: 'venues', label: 'Venue Management', icon: MdBusiness, path: '/admin/venues' },
    { id: 'bookings', label: 'Booking Management', icon: MdEvent, path: '/admin/bookings' },
    // { id: 'payments', label: 'Payments & Transactions', icon: MdPayment, path: '/admin/payments' },
    { id: 'analytics', label: 'Platform Analytics', icon: MdAnalytics, path: '/admin/analytics' },
    // { id: 'content', label: 'Reports & Moderation', icon: MdContentCopy, path: '/admin/content' },
    // { id: 'activity', label: 'Activity Log', icon: MdTimeline, path: '/admin/activity' },
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

  const handleLogout = async () => {
    setShowLogoutModal(false)
    await LOGOUT_ACTION()
    toast.success("Logged out successfully")
    navigate('/')
  }

  const getCurrentPageTitle = () => {
    const currentPath = location.pathname
    if (currentPath.startsWith('/admin/venues/edit')) return 'Edit Venue'
    if (currentPath.startsWith('/admin/bookings/') && currentPath !== '/admin/bookings') return 'Booking Details'
    const currentItem = menuItems.find(item => item.path === currentPath)
    return currentItem ? currentItem.label : 'Dashboard'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-lg text-gray-900">Athletix Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <MdClose className="w-6 h-6" /> : <MdMenu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900">Athletix</span>
                <p className="text-xs text-indigo-600">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>

          {/* User Info - Removed static user info from sidebar */}

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto min-h-0">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path === '/admin/venues' &&
                  (location.pathname.startsWith('/admin/venues/edit')))
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${isActive
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                    }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-indigo-600'}`} />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className={`ml-auto px-2 py-1 text-xs rounded-full ${isActive ? 'bg-white text-indigo-600' : 'bg-indigo-500 text-white'
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
          {/* Top Bar */}
          <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 px-6 py-4 hidden lg:block">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{getCurrentPageTitle()}</h1>
                <p className="text-gray-600">Manage and monitor the Athletix platform</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {profile?.name || "Admin User"}
                    </p>
                    <p className="text-xs text-gray-500">{profile?.email || ""}</p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {profile?.name ? profile.name.charAt(0).toUpperCase() : "A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 p-6">
            <Outlet />
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

export default AdminLayout
