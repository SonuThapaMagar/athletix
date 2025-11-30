import { useState } from 'react'
import {
  MdToday,
  MdTrendingUp,
  MdPeople,
  MdSportsSoccer,
  MdAttachMoney,
  MdEvent
} from 'react-icons/md'

const ActivityMonitor = () => {
  const [timeRange, setTimeRange] = useState('today')

  const stats = [
    { label: 'Active Users', value: '1,234', change: '+12%', icon: MdPeople, color: 'text-gray-600' },
    { label: 'Bookings Today', value: '89', change: '+8%', icon: MdEvent, color: 'text-gray-600' },
    { label: 'Revenue Today', value: '$4,567', change: '+15%', icon: MdAttachMoney, color: 'text-gray-600' },
    { label: 'Venues Active', value: '45', change: '+3', icon: MdSportsSoccer, color: 'text-gray-600' }
  ]

  const recentActivities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'created a new booking',
      venue: 'Elite Sports Complex',
      time: '5 minutes ago',
      type: 'booking'
    },
    {
      id: 2,
      user: 'Sarah Wilson',
      action: 'rated a venue',
      venue: 'City Sports Center',
      time: '12 minutes ago',
      type: 'review'
    },
    {
      id: 3,
      user: 'Mike Chen',
      action: 'registered as venue owner',
      venue: '-',
      time: '1 hour ago',
      type: 'registration'
    },
    {
      id: 4,
      user: 'Emma Brown',
      action: 'updated venue details',
      venue: 'Metro Sports Hub',
      time: '2 hours ago',
      type: 'update'
    },
    {
      id: 5,
      user: 'David Lee',
      action: 'cancelled booking',
      venue: 'Community Gym',
      time: '3 hours ago',
      type: 'cancellation'
    }
  ]

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'bg-gray-100 text-gray-700'
      case 'review':
        return 'bg-gray-100 text-gray-700'
      case 'registration':
        return 'bg-gray-100 text-gray-700'
      case 'update':
        return 'bg-gray-100 text-gray-700'
      case 'cancellation':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activity Monitor</h2>
          <p className="text-gray-600">Real-time monitoring of platform activity</p>
        </div>
        <div className="flex gap-2">
          {['today', 'week', 'month'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                timeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex items-center gap-1">
                <MdTrendingUp className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">{stat.change}</span>
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
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium cursor-pointer">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  <MdToday className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.venue !== '-' && `${activity.venue} • `}{activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity Timeline</h3>
          <div className="space-y-4">
            {[
              { hour: '00:00', activity: 12 },
              { hour: '04:00', activity: 8 },
              { hour: '08:00', activity: 45 },
              { hour: '12:00', activity: 78 },
              { hour: '16:00', activity: 92 },
              { hour: '20:00', activity: 65 }
            ].map((data, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 text-sm text-gray-600">{data.hour}</div>
                <div className="flex-1 relative">
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 h-4 flex items-center justify-end pr-2 text-white text-xs font-medium"
                      style={{ width: `${(data.activity / 100) * 100}%` }}
                    >
                      {data.activity}
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

export default ActivityMonitor
