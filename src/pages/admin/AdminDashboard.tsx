import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  MdArrowBack,
  MdPeople,
  MdLocationOn,
  MdAttachMoney,
  MdTrendingUp,
  MdSecurity,
  MdSettings,
  MdBarChart,
  MdNotifications
} from 'react-icons/md'

const AdminDashboard = () => {
  const navigate = useNavigate()

  const stats = [
    { label: 'Total Users', value: '2,450', icon: MdPeople, color: 'text-blue-500' },
    { label: 'Active Venues', value: '156', icon: MdLocationOn, color: 'text-green-500' },
    { label: 'Total Revenue', value: '$45,230', icon: MdAttachMoney, color: 'text-yellow-500' },
    { label: 'Growth Rate', value: '+12.5%', icon: MdTrendingUp, color: 'text-purple-500' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <MdNotifications className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MdPeople className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">User Management</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Manage users, roles, and permissions</p>
            <button 
              onClick={() => navigate('/admin/users')}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Manage Users
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MdLocationOn className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Venue Management</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Approve and manage venues</p>
            <button 
              onClick={() => navigate('/admin/venues')}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              Manage Venues
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MdBarChart className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Analytics</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">View detailed analytics and reports</p>
            <button 
              onClick={() => navigate('/admin/analytics')}
              className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
            >
              View Analytics
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: "New venue registered", user: "Elite Sports Complex", time: "2 hours ago", type: "venue" },
              { action: "User account created", user: "john.doe@example.com", time: "4 hours ago", type: "user" },
              { action: "Payment processed", user: "$1,200 transaction", time: "6 hours ago", type: "payment" },
              { action: "Booking cancelled", user: "City Sports Center", time: "8 hours ago", type: "booking" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'venue' ? 'bg-green-500' :
                  activity.type === 'user' ? 'bg-blue-500' :
                  activity.type === 'payment' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
