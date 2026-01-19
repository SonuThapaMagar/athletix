import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { 
  MdTrendingUp,
  MdAttachMoney,
  MdSportsSoccer,
  MdBusiness,
  MdSchedule,
  MdAnalytics,
  MdPayment,
  MdRefresh,
} from 'react-icons/md'
import type { StateType } from '@/redux/slices'
import { FETCH_DASHBOARD_DATA_ACTION } from '@/redux/actions/venueOwner/dashboard.actions'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

const VenueOwnerDashboard = () => {
  const navigate = useNavigate()
  const { stats, recentBookings, loading, error } = useSelector(
    (state: StateType) => state.dashboardSlice
  )

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      await FETCH_DASHBOARD_DATA_ACTION()
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err)
      toast.error(err?.response?.data?.message || 'Failed to load dashboard data')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NRP',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const dateStr = date.toDateString()
      const todayStr = today.toDateString()
      const tomorrowStr = tomorrow.toDateString()

      if (dateStr === todayStr) {
        return 'Today'
      } else if (dateStr === tomorrowStr) {
        return 'Tomorrow'
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      }
    } catch {
      return dateString
    }
  }

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      let hours = date.getHours()
      const minutes = date.getMinutes()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12
      hours = hours ? hours : 12
      const minutesStr = minutes.toString().padStart(2, '0')
      return `${hours}:${minutesStr} ${ampm}`
    } catch {
      return dateString
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'FAILED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatChange = (change?: number) => {
    if (change === undefined || change === null) return null
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(1)}%`
  }

  const statsData = stats ? [
    { 
      label: 'Total Revenue', 
      value: formatCurrency(stats.totalRevenue), 
      change: formatChange(stats.revenueChange) || '+0%', 
      icon: MdAttachMoney, 
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      label: 'Active Bookings', 
      value: stats.activeBookings.toString(), 
      change: formatChange(stats.bookingsChange) || '+0%', 
      icon: MdSportsSoccer, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      label: 'Total Venues', 
      value: stats.totalVenues.toString(), 
      change: stats.venuesChange ? `+${stats.venuesChange}` : '+0', 
      icon: MdBusiness, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    { 
      label: 'Customer Rating', 
      value: stats.customerRating.toFixed(1), 
      change: stats.ratingChange ? `+${stats.ratingChange.toFixed(1)}` : '+0.0', 
      icon: MdTrendingUp, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ] : []

  if (loading && !stats) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <Skeleton className="h-12 w-12 rounded-xl mb-4" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Overview of your business performance</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="p-2 text-gray-600 hover:text-[#2c5aa0] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          title="Refresh data"
        >
          <MdRefresh className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
            <button 
              onClick={() => navigate('/venue-owner/bookings')}
              className="text-[#2c5aa0] hover:text-[#1e3d6f] font-medium cursor-pointer"
            >
              View All
            </button>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No recent bookings</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/venue-owner/bookings/${booking.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {booking.venueImage ? (
                          <img
                            src={booking.venueImage}
                            alt={booking.venueName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {booking.venueName?.charAt(0) || "V"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.venueName}</h3>
                      <p className="text-sm text-gray-600">
                        {booking.sport || 'Sports'} • {formatDate(booking.startTime)} at {formatTime(booking.startTime)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/venue-owner/venues/add')}
              className="w-full flex items-center gap-3 p-3 bg-primary text-white rounded-xl hover:bg-[#2c5aa0] transition-colors cursor-pointer"
            >
              <MdBusiness className="w-5 h-5" />
              <span className="font-medium">Add New Venue</span>
            </button>
            <button 
              onClick={() => navigate('/venue-owner/schedules')}
              className="w-full flex items-center gap-3 p-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <MdSchedule className="w-5 h-5" />
              <span className="font-medium">Set Schedule</span>
            </button>
            <button 
              onClick={() => navigate('/venue-owner/analytics')}
              className="w-full flex items-center gap-3 p-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <MdAnalytics className="w-5 h-5" />
              <span className="font-medium">View Reports</span>
            </button>
            <button 
              onClick={() => navigate('/venue-owner/payments')}
              className="w-full flex items-center gap-3 p-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <MdPayment className="w-5 h-5" />
              <span className="font-medium">Payment History</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VenueOwnerDashboard
