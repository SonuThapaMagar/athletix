import { useState } from 'react'
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdAccessTime,
  MdDateRange,
  MdSportsSoccer
} from 'react-icons/md'

const Schedules = () => {
  const [schedules] = useState([
    {
      id: 1,
      venue: 'Elite Sports Complex',
      sport: 'Football',
      date: '2024-12-20',
      startTime: '10:00',
      endTime: '12:00',
      available: true
    },
    {
      id: 2,
      venue: 'City Sports Center',
      sport: 'Tennis',
      date: '2024-12-20',
      startTime: '14:00',
      endTime: '16:00',
      available: true
    },
    {
      id: 3,
      venue: 'Elite Sports Complex',
      sport: 'Basketball',
      date: '2024-12-21',
      startTime: '18:00',
      endTime: '20:00',
      available: false
    }
  ])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Venue Schedules</h2>
          <p className="text-gray-600">Manage your venue availability and schedules</p>
        </div>
        <button className="bg-[#2c5aa0] text-white px-4 py-2 rounded-lg hover:bg-[#1e3d6f] transition-colors flex items-center gap-2 cursor-pointer">
          <MdAdd className="w-4 h-4" />
          Add Schedule
        </button>
      </div>

      {/* Schedule Calendar View */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              Today
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              Week
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              Month
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="aspect-square border border-gray-200 rounded-lg p-2 hover:bg-gray-50">
              <div className="text-sm text-gray-900 mb-1">{index + 1}</div>
              <div className="space-y-1">
                {schedules.filter(s => s.date === `2024-12-${String(index + 18).padStart(2, '0')}`).map(schedule => (
                  <div key={schedule.id} className={`text-xs p-1 rounded ${
                    schedule.available ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {schedule.sport}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Schedules</h3>
        
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f] rounded-lg flex items-center justify-center">
                    <MdDateRange className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{schedule.venue}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <MdSportsSoccer className="w-4 h-4" />
                        {schedule.sport}
                      </div>
                      <div className="flex items-center gap-1">
                        <MdDateRange className="w-4 h-4" />
                        {schedule.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <MdAccessTime className="w-4 h-4" />
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      schedule.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {schedule.available ? 'Available' : 'Booked'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-600 hover:text-[#2c5aa0] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                      <MdEdit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                      <MdDelete className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Schedules
