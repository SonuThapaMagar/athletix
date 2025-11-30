import { 
  MdTrendingUp,
  MdAttachMoney,
  MdSportsSoccer,
  MdBusiness,
  MdSchedule,
  MdAnalytics,
  MdPayment
} from 'react-icons/md'

const VenueOwnerDashboard = () => {
  const stats = [
    { label: 'Total Revenue', value: '$12,450', change: '+12%', icon: MdAttachMoney, color: 'text-green-600' },
    { label: 'Active Bookings', value: '24', change: '+8%', icon: MdSportsSoccer, color: 'text-blue-600' },
    { label: 'Total Venues', value: '3', change: '+1', icon: MdBusiness, color: 'text-purple-600' },
    { label: 'Customer Rating', value: '4.8', change: '+0.2', icon: MdTrendingUp, color: 'text-yellow-600' }
  ]

  const recentBookings = [
    { id: 1, venue: 'Central Sports Complex', sport: 'Football', time: '2:00 PM', date: 'Today', status: 'confirmed' },
    { id: 2, venue: 'Elite Tennis Club', sport: 'Tennis', time: '4:30 PM', date: 'Today', status: 'pending' },
    { id: 3, venue: 'Metro Basketball Court', sport: 'Basketball', time: '6:00 PM', date: 'Tomorrow', status: 'confirmed' },
    { id: 4, venue: 'Riverside Badminton', sport: 'Badminton', time: '8:00 AM', date: 'Tomorrow', status: 'confirmed' }
  ]

  return (
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stat.color === 'text-green-600' ? 'bg-green-100' :
                stat.color === 'text-blue-600' ? 'bg-blue-100' :
                stat.color === 'text-purple-600' ? 'bg-purple-100' :
                'bg-yellow-100'
              }`}>
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
            <button className="text-[#2c5aa0] hover:text-[#1e3d6f] font-medium cursor-pointer">View All</button>
          </div>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f] rounded-xl flex items-center justify-center">
                    <MdSportsSoccer className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{booking.venue}</h3>
                    <p className="text-sm text-gray-600">{booking.sport} • {booking.date} at {booking.time}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 bg-[#2c5aa0] text-white rounded-xl hover:bg-[#1e3d6f] transition-colors cursor-pointer">
              <MdBusiness className="w-5 h-5" />
              <span className="font-medium">Add New Venue</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <MdSchedule className="w-5 h-5" />
              <span className="font-medium">Set Schedule</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <MdAnalytics className="w-5 h-5" />
              <span className="font-medium">View Reports</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
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