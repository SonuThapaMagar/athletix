import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { 
  MdPeople,
  MdLocationOn,
  MdAttachMoney,
  MdTrendingUp,
  MdBarChart
} from 'react-icons/md'
import type { StateType } from '@/redux/slices'
import { FETCH_ADMIN_DASHBOARD_DATA_ACTION } from '@/redux/actions/admin/dashboard.actions'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { stats, recentActivities, loading, error } = useSelector(
    (state: StateType) => state.adminDashboardSlice
  )

  useEffect(() => {
    FETCH_ADMIN_DASHBOARD_DATA_ACTION().catch((err) => {
      console.error('Failed to fetch dashboard data:', err)
      toast.error('Failed to load dashboard data')
    })
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NRP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatChange = (change?: number) => {
    if (change === undefined || change === null) return '+0%'
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(1)}%`
  }

  const statsData = stats ? [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), change: formatChange(stats.usersChange), icon: MdPeople, color: 'text-blue-500' },
    { label: 'Active Venues', value: stats.activeVenues.toLocaleString(), change: formatChange(stats.venuesChange), icon: MdLocationOn, color: 'text-green-500' },
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), change: formatChange(stats.revenueChange), icon: MdAttachMoney, color: 'text-yellow-500' },
    { label: 'Total Bookings', value: stats.totalBookings.toLocaleString(), change: formatChange(stats.bookingsChange), icon: MdTrendingUp, color: 'text-purple-500' }
  ] : []

  if (loading && !stats) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          ) : statsData.length > 0 ? (
            statsData.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      {stat.change && (
                        <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                      )}
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
              )
            })
          ) : (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))
          )}
        </div>

        {/* Additional Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        )}

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
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
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
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
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
              className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors cursor-pointer"
            >
              View Analytics
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-32 mb-4" />
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No recent activities
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'venue' ? 'bg-green-500' :
                    activity.type === 'user' ? 'bg-blue-500' :
                    activity.type === 'payment' ? 'bg-yellow-500' :
                    activity.type === 'booking' ? 'bg-purple-500' :
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
          )}
        </div>
    </div>
  )
}

export default AdminDashboard
