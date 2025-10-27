import { 
  MdTrendingUp,
  MdTrendingDown,
  MdAttachMoney,
  MdPeople,
  MdCalendarToday,
  MdStar,
  MdFileDownload
} from 'react-icons/md'

const Analytics = () => {
  const exportToExcel = () => {
    // Create CSV data
    const csvData = [
      ['Metric', 'Value', 'Change'],
      ['Total Revenue', '$45,678', '+12.5%'],
      ['Total Bookings', '1,234', '+8.3%'],
      ['Active Customers', '456', '+5.2%'],
      ['Average Rating', '4.8', '-0.1%']
    ]

    // Convert to CSV string
    const csv = csvData.map(row => row.join(',')).join('\n')

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `analytics_report_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const stats = [
    { 
      label: 'Total Revenue', 
      value: '$45,678', 
      change: '+12.5%', 
      trend: 'up',
      icon: MdAttachMoney, 
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      label: 'Total Bookings', 
      value: '1,234', 
      change: '+8.3%', 
      trend: 'up',
      icon: MdCalendarToday, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      label: 'Active Customers', 
      value: '456', 
      change: '+5.2%', 
      trend: 'up',
      icon: MdPeople, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    { 
      label: 'Average Rating', 
      value: '4.8', 
      change: '-0.1', 
      trend: 'down',
      icon: MdStar, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ]

  const topVenues = [
    { name: 'Elite Sports Complex', bookings: 456, revenue: '$15,234', growth: '+15%' },
    { name: 'City Sports Center', bookings: 389, revenue: '$12,890', growth: '+12%' },
    { name: 'Community Gym', bookings: 234, revenue: '$8,456', growth: '+8%' }
  ]

  const revenueData = [
    { month: 'Jan', revenue: 8500 },
    { month: 'Feb', revenue: 9200 },
    { month: 'Mar', revenue: 8800 },
    { month: 'Apr', revenue: 10100 },
    { month: 'May', revenue: 12400 },
    { month: 'Jun', revenue: 14500 }
  ]

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-[#2c5aa0] text-white rounded-lg hover:bg-[#1e3d6f] transition-colors flex items-center gap-2 cursor-pointer"
        >
          <MdFileDownload className="w-4 h-4" />
          Export to Excel
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
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
          <div className="h-64 flex items-end justify-between gap-2">
            {revenueData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-[#2c5aa0] to-[#4a7bc8] rounded-t-lg hover:opacity-80 transition-opacity mb-2"
                  style={{ height: `${(data.revenue / Math.max(...revenueData.map(d => d.revenue))) * 200}px` }}
                />
                <span className="text-xs text-gray-600">{data.month}</span>
                <span className="text-xs font-medium text-gray-900">${data.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Venues */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Venues</h3>
          <div className="space-y-4">
            {topVenues.map((venue, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{venue.name}</h4>
                    <p className="text-sm text-gray-600">{venue.bookings} bookings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{venue.revenue}</p>
                  <p className="text-sm text-green-600">{venue.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sport Popularity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Sport Popularity</h3>
          <div className="space-y-4">
            {[
              { sport: 'Football', percentage: 35, bookings: 432 },
              { sport: 'Basketball', percentage: 28, bookings: 345 },
              { sport: 'Tennis', percentage: 20, bookings: 247 },
              { sport: 'Badminton', percentage: 12, bookings: 148 },
              { sport: 'Others', percentage: 5, bookings: 62 }
            ].map((item, index) => (
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
        </div>

        {/* Time Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Peak Booking Times</h3>
          <div className="space-y-3">
            {[
              { time: '8:00 AM - 10:00 AM', bookings: 45, color: 'bg-blue-500' },
              { time: '10:00 AM - 12:00 PM', bookings: 78, color: 'bg-blue-600' },
              { time: '12:00 PM - 2:00 PM', bookings: 65, color: 'bg-blue-700' },
              { time: '2:00 PM - 4:00 PM', bookings: 92, color: 'bg-[#2c5aa0]' },
              { time: '4:00 PM - 6:00 PM', bookings: 145, color: 'bg-[#1e3d6f]' },
              { time: '6:00 PM - 8:00 PM', bookings: 158, color: 'bg-[#0f1f3f]' }
            ].map((slot, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600">{slot.time}</div>
                <div className="flex-1 relative">
                  <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div 
                      className={`${slot.color} h-6 flex items-center justify-end pr-2 text-white text-xs font-medium`}
                      style={{ width: `${(slot.bookings / 158) * 100}%` }}
                    >
                      {slot.bookings}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
