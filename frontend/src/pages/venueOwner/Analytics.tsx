import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { 
  MdTrendingUp,
  MdTrendingDown,
  MdAttachMoney,
  MdPeople,
  MdCalendarToday,
  MdStar,
  MdFileDownload,
  MdRefresh,
} from 'react-icons/md'
import type { StateType } from '@/redux/slices'
import { FETCH_ANALYTICS_DATA_ACTION, EXPORT_ANALYTICS_ACTION } from '@/redux/actions/venueOwner/analytics.actions'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

const Analytics = () => {
  const { stats, revenueData, topVenues, sportPopularity, peakBookingTimes, loading, error } = useSelector(
    (state: StateType) => state.analyticsSlice
  )

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      await FETCH_ANALYTICS_DATA_ACTION()
    } catch (err: any) {
      console.error('Failed to fetch analytics data:', err)
      toast.error(err?.response?.data?.message || 'Failed to load analytics data')
    }
  }

  const exportToExcel = async () => {
    try {
      const blob = await EXPORT_ANALYTICS_ACTION({ format: 'csv' })
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `analytics_report_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success('Analytics exported successfully')
    } catch (err: any) {
      console.error('Export failed:', err)
      toast.error(err?.response?.data?.message || 'Failed to export analytics')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NRP',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatChange = (change?: number) => {
    if (change === undefined || change === null) return null
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(1)}%`
  }

  const getTrend = (change?: number): 'up' | 'down' => {
    if (change === undefined || change === null) return 'up'
    return change >= 0 ? 'up' : 'down'
  }

  const statsData = stats ? [
    { 
      label: 'Total Revenue', 
      value: formatCurrency(stats.totalRevenue), 
      change: formatChange(stats.revenueChange) || '+0%', 
      trend: getTrend(stats.revenueChange),
      icon: MdAttachMoney, 
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      label: 'Total Bookings', 
      value: stats.totalBookings.toLocaleString(), 
      change: formatChange(stats.bookingsChange) || '+0%', 
      trend: getTrend(stats.bookingsChange),
      icon: MdCalendarToday, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      label: 'Active Customers', 
      value: stats.activeCustomers.toLocaleString(), 
      change: formatChange(stats.customersChange) || '+0%', 
      trend: getTrend(stats.customersChange),
      icon: MdPeople, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    { 
      label: 'Average Rating', 
      value: stats.averageRating.toFixed(1), 
      change: stats.ratingChange ? `${stats.ratingChange >= 0 ? '+' : ''}${stats.ratingChange.toFixed(1)}` : '+0.0', 
      trend: getTrend(stats.ratingChange),
      icon: MdStar, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ] : []

  // Calculate max revenue for chart scaling
  const maxRevenue = useMemo(() => {
    if (revenueData.length === 0) return 1
    return Math.max(...revenueData.map(d => d.revenue))
  }, [revenueData])

  // Calculate max bookings for peak times scaling
  const maxPeakBookings = useMemo(() => {
    if (peakBookingTimes.length === 0) return 1
    return Math.max(...peakBookingTimes.map(t => t.bookings))
  }, [peakBookingTimes])

  if (loading && !stats) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <Skeleton className="h-12 w-12 rounded-xl mb-4" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <Skeleton className="h-6 w-48 mb-6" />
              <Skeleton className="h-64 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAnalyticsData}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-[#2c5aa0] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh data"
          >
            <MdRefresh className="w-5 h-5" />
          </button>
          <button
            onClick={exportToExcel}
            disabled={loading}
            className="px-4 py-2 bg-[#2c5aa0] text-white rounded-lg hover:bg-[#1e3d6f] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <MdFileDownload className="w-4 h-4" />
            Export to Excel
          </button>
        </div>
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
              <div className="flex items-center gap-1">
                {stat.trend === 'up' ? (
                  <MdTrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <MdTrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Overview</h3>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : revenueData.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">No revenue data available</p>
            </div>
          ) : (
            <div className="h-64 flex items-end justify-between gap-2">
              {revenueData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-[#2c5aa0] to-[#4a7bc8] rounded-t-lg hover:opacity-80 transition-opacity mb-2"
                    style={{ height: `${(data.revenue / maxRevenue) * 200}px` }}
                  />
                  <span className="text-xs text-gray-600">{data.month}</span>
                  <span className="text-xs font-medium text-gray-900">{formatCurrency(data.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Venues */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Venues</h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : topVenues.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No venue data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topVenues.map((venue, index) => (
                <div key={venue.venueId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f] rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{venue.venueName}</h4>
                      <p className="text-sm text-gray-600">{venue.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(venue.revenue)}</p>
                    {venue.growth !== undefined && (
                      <p className="text-sm text-green-600">+{venue.growth.toFixed(1)}%</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sport Popularity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Sport Popularity</h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          ) : sportPopularity.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No sport data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sportPopularity.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{item.sport}</span>
                    <span className="text-sm text-gray-600">{item.bookings} bookings</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#2c5aa0] to-[#4a7bc8] h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Time Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Peak Booking Times</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : peakBookingTimes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No time data available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {peakBookingTimes.map((slot, index) => {
                const percentage = (slot.bookings / maxPeakBookings) * 100
                const colorClasses = [
                  'bg-blue-500',
                  'bg-blue-600',
                  'bg-blue-700',
                  'bg-[#2c5aa0]',
                  'bg-[#1e3d6f]',
                  'bg-[#0f1f3f]'
                ]
                const color = colorClasses[index % colorClasses.length]
                
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-gray-600">{slot.time}</div>
                    <div className="flex-1 relative">
                      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div 
                          className={`${color} h-6 flex items-center justify-end pr-2 text-white text-xs font-medium`}
                          style={{ width: `${percentage}%` }}
                        >
                          {slot.bookings}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Analytics
