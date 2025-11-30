import PlayerNavLayout from '@/layout/PlayerNavLayout'

const History = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PlayerNavLayout />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Booking History</h1>
          <p className="text-gray-600 mt-2">View all your past and upcoming bookings</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button className="py-4 px-1 border-b-2 border-[#2c5aa0] text-[#2c5aa0] font-medium">
                All Bookings
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                Upcoming
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                Completed
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                Cancelled
              </button>
            </nav>
          </div>
        </div>

        {/* Booking History */}
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">FB</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Football Court - Central Park</h3>
                      <p className="text-gray-600">Court A • 2 hours</p>
                      <p className="text-sm text-gray-500">Dec 15, 2024 • 6:00 PM - 8:00 PM</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        item <= 2 ? 'bg-green-100 text-green-800' : 
                        item === 3 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {item <= 2 ? 'Completed' : item === 3 ? 'Upcoming' : 'Cancelled'}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">$50.00</p>
                    <div className="flex space-x-2 mt-2">
                      <button className="text-[#2c5aa0] hover:underline text-sm">View Details</button>
                      {item === 3 && (
                        <button className="text-red-600 hover:underline text-sm">Cancel</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-700">Showing 1-5 of 25 bookings</p>
          <div className="flex space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-2 bg-[#2c5aa0] text-white rounded-lg text-sm">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default History




