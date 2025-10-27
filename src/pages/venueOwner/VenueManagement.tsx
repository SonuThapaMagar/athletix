import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  MdArrowBack,
  MdAdd,
  MdEdit,
  MdDelete,
  MdLocationOn,
  MdSportsSoccer,
  MdAccessTime,
  MdAttachMoney,
  MdCheckCircle
} from 'react-icons/md'

const VenueManagement = () => {
  const navigate = useNavigate()
  const [isAddingVenue, setIsAddingVenue] = useState(false)

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
            <h1 className="text-xl font-semibold text-gray-900">Venue Management</h1>
            <button 
              onClick={() => setIsAddingVenue(true)}
              className="bg-[#2c5aa0] text-white px-4 py-2 rounded-lg hover:bg-[#1e3d6f] transition-colors flex items-center gap-2"
            >
              <MdAdd className="w-4 h-4" />
              Add Venue
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Manage Your Venues</h2>
          
          {/* Add Venue Form */}
          {isAddingVenue && (
            <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-gray-50">
              <h3 className="text-md font-medium text-gray-900 mb-4">Add New Venue</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Venue Name</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20"
                    placeholder="Enter venue name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20"
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Hour</label>
                  <input 
                    type="number" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20"
                    placeholder="Enter price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Sports</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20">
                    <option>Basketball</option>
                    <option>Football</option>
                    <option>Tennis</option>
                    <option>Badminton</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button className="bg-[#2c5aa0] text-white px-4 py-2 rounded-lg hover:bg-[#1e3d6f] transition-colors">
                  Save Venue
                </button>
                <button 
                  onClick={() => setIsAddingVenue(false)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Venues List */}
          <div className="space-y-4">
            {[
              { 
                name: "Elite Sports Complex", 
                location: "Downtown District", 
                price: "$28/hour",
                sports: ["Basketball", "Football", "Tennis"],
                status: "Active",
                bookings: 12
              },
              { 
                name: "City Sports Center", 
                location: "Midtown", 
                price: "$25/hour",
                sports: ["Tennis", "Badminton"],
                status: "Active",
                bookings: 8
              },
              { 
                name: "Community Gym", 
                location: "Suburbs", 
                price: "$20/hour",
                sports: ["Basketball", "Volleyball"],
                status: "Maintenance",
                bookings: 4
              }
            ].map((venue, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f] rounded-lg flex items-center justify-center">
                      <MdSportsSoccer className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{venue.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MdLocationOn className="w-4 h-4" />
                          {venue.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <MdAttachMoney className="w-4 h-4" />
                          {venue.price}
                        </div>
                        <div className="flex items-center gap-1">
                          <MdAccessTime className="w-4 h-4" />
                          {venue.bookings} bookings
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {venue.sports.map((sport, sportIndex) => (
                          <span key={sportIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {sport}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        venue.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {venue.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-600 hover:text-[#2c5aa0] hover:bg-blue-50 rounded-lg transition-colors">
                        <MdEdit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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
    </div>
  )
}

export default VenueManagement
