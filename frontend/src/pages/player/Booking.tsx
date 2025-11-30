import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PlayerNavLayout from '@/layout/PlayerNavLayout'
import { MdLocationOn, MdStar, MdAccessTime, MdClose } from 'react-icons/md'

interface Venue {
  id: number
  name: string
  image: string
  location: string
  rating: number
  reviews: number
  price: string
  originalPrice?: string
  sports: string[]
  availability: string
  distance: string
  features: string[]
  isRecommended?: boolean
  discount?: string
}

const Booking = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedDuration, setSelectedDuration] = useState('2')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [booking, setBooking] = useState(null);

  // Mock venue data - in real app, this would come from state or API
  const venue: Venue = {
    id: 1,
    name: "Elite Sports Complex",
    image: "/api/placeholder/300/200",
    location: "Downtown District",
    rating: 4.9,
    reviews: 234,
    price: "$28/hour",
    originalPrice: "$35/hour",
    sports: ["Football", "Basketball", "Tennis"],
    availability: "3 slots available",
    distance: "0.5 km",
    features: ["Premium Courts", "Locker Rooms", "Equipment Rental", "Café"],
    isRecommended: true,
    discount: "20% OFF"
  }

  const timeSlots = [
    "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
    "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"
  ]

  const handleBookingConfirm = () => {
    
    setShowConfirmation(true)
  }

  const handleFinalConfirm = () => {
    setShowConfirmation(false)
    navigate('/player/history')
  }

  const calculateTotal = () => {
    const basePrice = parseFloat(venue.price.replace('$', ''))
    const duration = parseInt(selectedDuration)
    const total = basePrice * duration
    const discount = venue.discount ? total * 0.2 : 0
    return {
      subtotal: total,
      discount: discount,
      total: total - discount
    }
  }

  const pricing = calculateTotal()

  return (
    <div className="min-h-screen bg-gray-50">
      <PlayerNavLayout />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Venue Details</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
          <p className="text-gray-600 mt-2">Review your selection and confirm your booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                  <select 
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20"
                  >
                    <option value="">Choose time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select 
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20"
                  >
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Players</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20">
                    <option value="1">1 player</option>
                    <option value="2">2 players</option>
                    <option value="4">4 players</option>
                    <option value="6">6 players</option>
                    <option value="8">8 players</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Venue Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Venue Information</h2>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-32 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-2xl mb-1">🏟️</div>
                      <div className="text-xs opacity-90">Venue</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{venue.name}</h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MdLocationOn className="w-4 h-4 mr-1" />
                    {venue.location}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MdStar className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-medium">{venue.rating}</span>
                      <span className="ml-1">({venue.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <MdAccessTime className="w-4 h-4 mr-1" />
                      {venue.availability}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-sm text-gray-600 mb-2">Available Sports:</div>
                    <div className="flex flex-wrap gap-2">
                      {venue.sports.map((sport, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {sport}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Date</span>
                    <span className="text-sm font-medium">
                      {selectedDate || 'Select date'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Time</span>
                    <span className="text-sm font-medium">
                      {selectedTime || 'Select time'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="text-sm font-medium">{selectedDuration} hours</span>
                  </div>
                </div>
                
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Base Price</span>
                    <span className="text-sm font-medium">{venue.price}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="text-sm font-medium">${pricing.subtotal.toFixed(2)}</span>
                  </div>
                  {venue.discount && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-green-600">Discount (20% OFF)</span>
                      <span className="text-sm font-medium text-green-600">-${pricing.discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${pricing.total.toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={handleBookingConfirm}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full bg-[#2c5aa0] text-white py-3 px-4 rounded-lg hover:bg-[#1e3d6f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Confirm Booking</h3>
                <button 
                  onClick={() => setShowConfirmation(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{venue.name}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Date: {selectedDate}</div>
                    <div>Time: {selectedTime}</div>
                    <div>Duration: {selectedDuration} hours</div>
                    <div>Total: ${pricing.total.toFixed(2)}</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleFinalConfirm}
                    className="flex-1 bg-[#2c5aa0] text-white py-2 px-4 rounded-lg hover:bg-[#1e3d6f] transition-colors"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Booking


