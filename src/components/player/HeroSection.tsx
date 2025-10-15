import { MdLocationOn, MdStar, MdAccessTime } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
  const navigate = useNavigate()
  
  const venues = [
    {
      id: 1,
      name: "Central Park Sports Complex",
      image: "/api/placeholder/300/200",
      location: "Downtown, City Center",
      rating: 4.8,
      reviews: 124,
      price: "$25/hour",
      sports: ["Football", "Basketball", "Tennis"],
      availability: "5 slots available",
      distance: "0.8 km",
      features: ["Parking", "Changing Rooms", "Equipment Rental"]
    },
    {
      id: 2,
      name: "Elite Tennis Academy",
      image: "/api/placeholder/300/200",
      location: "Sports District",
      rating: 4.9,
      reviews: 89,
      price: "$35/hour",
      sports: ["Tennis", "Badminton"],
      availability: "3 slots available",
      distance: "1.2 km",
      features: ["Professional Courts", "Coaching Available", "Pro Shop"]
    },
    {
      id: 3,
      name: "Riverside Football Ground",
      image: "/api/placeholder/300/200",
      location: "Riverside Area",
      rating: 4.6,
      reviews: 156,
      price: "$20/hour",
      sports: ["Football", "Cricket"],
      availability: "8 slots available",
      distance: "2.1 km",
      features: ["Floodlights", "Parking", "Refreshments"]
    },
  ]

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Your Perfect Sports Venue
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover top-rated sports facilities in your area. Book instantly and play with confidence.
          </p>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <div key={venue.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Venue Image */}
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🏟️</div>
                  <div className="text-sm opacity-90">Sports Venue</div>
                </div>
              </div>

              {/* Venue Details */}
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{venue.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MdLocationOn className="w-4 h-4 mr-1" />
                      {venue.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#2c5aa0]">{venue.price}</div>
                    <div className="text-sm text-gray-500">per hour</div>
                  </div>
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <MdStar className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium text-gray-900">{venue.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500 ml-2">({venue.reviews} reviews)</span>
                </div>

                {/* Sports Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {venue.sports.map((sport, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {sport}
                    </span>
                  ))}
                </div>

                {/* Availability and Distance */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MdAccessTime className="w-4 h-4 mr-1" />
                    {venue.availability}
                  </div>
                  <div className="flex items-center">
                    <MdLocationOn className="w-4 h-4 mr-1" />
                    {venue.distance}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Features:</div>
                  <div className="flex flex-wrap gap-1">
                    {venue.features.map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => navigate('/player/booking')}
                    className="flex-1 bg-[#2c5aa0] text-white py-2 px-4 rounded-lg hover:bg-[#1e3d6f] transition-colors font-medium"
                  >
                    Book Now
                  </button>
                  <button 
                    onClick={() => navigate(`/venue/${venue.id}`)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <button className="bg-white text-[#2c5aa0] border border-[#2c5aa0] px-8 py-3 rounded-lg hover:bg-[#2c5aa0] hover:text-white transition-colors font-medium">
            Load More Venues
          </button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection

