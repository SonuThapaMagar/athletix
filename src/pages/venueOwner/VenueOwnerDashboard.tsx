import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  MdArrowBack,
  MdAdd,
  MdEdit,
  MdDelete,
  MdCalendarToday,
  MdPeople,
  MdAttachMoney,
  MdStar,
  MdLocationOn,
  MdSportsSoccer
} from 'react-icons/md'

const VenueOwnerDashboard = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">Venue Owner Dashboard</h1>
            <button className="bg-[#2c5aa0] text-white px-4 py-2 rounded-lg hover:bg-[#1e3d6f] transition-colors flex items-center gap-2">
              <MdAdd className="w-4 h-4" />
              Add Venue
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Venues</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <MdLocationOn className="w-8 h-8 text-[#2c5aa0]" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Bookings</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <MdCalendarToday className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$2,450</p>
              </div>
              <MdAttachMoney className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
              </div>
              <MdStar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Venues List */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">My Venues</h2>
            <button className="bg-[#2c5aa0] text-white px-4 py-2 rounded-lg hover:bg-[#1e3d6f] transition-colors flex items-center gap-2">
              <MdAdd className="w-4 h-4" />
              Add New Venue
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Mock venue data */}
            {[
              { name: "Elite Sports Complex", location: "Downtown", bookings: 12, revenue: "$1,200", rating: 4.9 },
              { name: "City Sports Center", location: "Midtown", bookings: 8, revenue: "$800", rating: 4.7 },
              { name: "Community Gym", location: "Suburbs", bookings: 4, revenue: "$450", rating: 4.5 }
            ].map((venue, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f] rounded-lg flex items-center justify-center">
                      <MdSportsSoccer className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{venue.name}</h3>
                      <p className="text-sm text-gray-600">{venue.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Bookings</p>
                      <p className="font-medium">{venue.bookings}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="font-medium">{venue.revenue}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="font-medium">{venue.rating}</p>
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

export default VenueOwnerDashboard
