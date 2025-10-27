import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  MdArrowBack,
  MdCalendarToday,
  MdPeople,
  MdAttachMoney,
  MdCheckCircle,
  MdCancel,
  MdPending
} from 'react-icons/md'

const BookingManagement = () => {
  const navigate = useNavigate()
  const [selectedFilter, setSelectedFilter] = useState('all')

  const filters = [
    { id: 'all', label: 'All Bookings' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'cancelled', label: 'Cancelled' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <MdArrowBack className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Booking Management</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-[#2c5aa0] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Bookings</h2>
          
          <div className="space-y-4">
            {[
              {
                id: 1,
                venue: "Elite Sports Complex",
                customer: "John Doe",
                date: "Dec 20, 2024",
                time: "6:00 PM - 8:00 PM",
                sport: "Basketball",
                amount: "$56.00",
                status: "confirmed"
              },
              {
                id: 2,
                venue: "City Sports Center",
                customer: "Sarah Wilson",
                date: "Dec 21, 2024",
                time: "2:00 PM - 4:00 PM",
                sport: "Tennis",
                amount: "$50.00",
                status: "pending"
              },
              {
                id: 3,
                venue: "Community Gym",
                customer: "Mike Chen",
                date: "Dec 19, 2024",
                time: "7:00 PM - 9:00 PM",
                sport: "Football",
                amount: "$40.00",
                status: "cancelled"
              }
            ].map((booking) => (
              <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f] rounded-lg flex items-center justify-center">
                      <MdCalendarToday className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{booking.venue}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MdPeople className="w-4 h-4" />
                          {booking.customer}
                        </div>
                        <div className="flex items-center gap-1">
                          <MdCalendarToday className="w-4 h-4" />
                          {booking.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <MdAttachMoney className="w-4 h-4" />
                          {booking.amount}
                        </div>
                      </div>
                      <div className="mt-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {booking.sport}
                        </span>
                        <span className="ml-2 text-sm text-gray-600">{booking.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
                            <MdCheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                            <MdCancel className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                          <MdCancel className="w-4 h-4" />
                        </button>
                      )}
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

export default BookingManagement
