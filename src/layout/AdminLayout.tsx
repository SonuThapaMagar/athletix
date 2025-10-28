import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
  MdSecurity
} from 'react-icons/md'
import LogoutModal from '@/components/common/LogoutModalNew'

interface MenuItem {
  id: string
  label: string
  icon: any
  path: string
  badge?: number
}

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: MdDashboard, path: '/admin' },
    { id: 'venues', label: 'Manage Venues', icon: MdBusiness, path: '/admin/venues' },
    { id: 'users', label: 'User Management', icon: MdPeople, path: '/admin/users' },
    { id: 'content', label: 'Moderate Content', icon: MdContentCopy, path: '/admin/content', badge: 3 },
    { id: 'activity', label: 'Activity Monitor', icon: MdTimeline, path: '/admin/activity' },
    { id: 'analytics', label: 'Platform Analytics', icon: MdAnalytics, path: '/admin/analytics' },
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

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">AD</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Admin User</h3>
                <p className="text-sm text-gray-500">Super Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto min-h-0">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-indigo-600'}`} />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                      isActive ? 'bg-white text-indigo-600' : 'bg-indigo-500 text-white'
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
            <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <MdSecurity className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Security Status</p>
                <p className="text-xs text-gray-500">All systems operational</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden cursor-pointer"
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
                <p className="text-gray-600">Manage and monitor the Athletix platform</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer relative">
                  <MdNotifications className="w-6 h-6" />
                  <span className="absolute top-1 right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    5
                  </span>
                </button>
                <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
                  <MdSettings className="w-6 h-6" />
                </button>
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AD</span>
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

export default AdminLayout
