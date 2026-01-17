import { MdLocationOn, MdStar, MdAccessTime, MdPeople, MdFavorite, MdShare } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

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
  isFavorite?: boolean
}

const Recommendations = () => {
  const navigate = useNavigate()
  
  const recommendedVenues: Venue[] = [
    {
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
      discount: "20% OFF",
      isFavorite: false
    },
    {
      id: 2,
      name: "Riverside Tennis Club",
      image: "/api/placeholder/300/200",
      location: "Riverside Area",
      rating: 4.8,
      reviews: 156,
      price: "$32/hour",
      sports: ["Tennis", "Badminton"],
      availability: "2 slots available",
      distance: "1.1 km",
      features: ["Professional Courts", "Coaching", "Pro Shop", "Parking"],
      isRecommended: true,
      isFavorite: true
    },
    {
      id: 3,
      name: "City Sports Arena",
      image: "/api/placeholder/300/200",
      location: "Sports Quarter",
      rating: 4.7,
      reviews: 189,
      price: "$22/hour",
      originalPrice: "$28/hour",
      sports: ["Football", "Cricket", "Volleyball"],
      availability: "6 slots available",
      distance: "0.8 km",
      features: ["Floodlights", "Parking", "Refreshments", "Changing Rooms"],
      isRecommended: true,
      discount: "15% OFF",
      isFavorite: false
    },
    {
      id: 4,
      name: "Olympic Swimming Center",
      image: "/api/placeholder/300/200",
      location: "Olympic Park",
      rating: 4.9,
      reviews: 298,
      price: "$18/hour",
      sports: ["Swimming", "Water Polo"],
      availability: "4 slots available",
      distance: "1.5 km",
      features: ["Olympic Pool", "Sauna", "Locker Rooms", "Cafeteria"],
      isRecommended: true,
      isFavorite: false
    },
    {
      id: 5,
      name: "Metro Basketball Court",
      image: "/api/placeholder/300/200",
      location: "Metro Station",
      rating: 4.6,
      reviews: 142,
      price: "$25/hour",
      sports: ["Basketball", "Volleyball"],
      availability: "5 slots available",
      distance: "0.3 km",
      features: ["Indoor Court", "AC", "Parking", "Equipment"],
      isRecommended: true,
      isFavorite: false
    },
    {
      id: 6,
      name: "Greenfield Badminton Club",
      image: "/api/placeholder/300/200",
      location: "Greenfield Area",
      rating: 4.8,
      reviews: 167,
      price: "$20/hour",
      sports: ["Badminton", "Table Tennis"],
      availability: "7 slots available",
      distance: "1.2 km",
      features: ["Wooden Courts", "AC", "Parking", "Equipment Rental"],
      isRecommended: true,
      isFavorite: false
    }
  ]

  const toggleFavorite = (venueId: number) => {
    // This would typically update state or make an API call
    console.log('Toggle favorite for venue:', venueId)
  }

  const handleShare = (venueId: number) => {
    // This would typically open share dialog or copy link
    console.log('Share venue:', venueId)
  }

  const handleBookNow = (venueId: number) => {
    navigate('/player/bookings')
  }

  const handleViewDetails = (venueId: number) => {
    navigate(`/venue/${venueId}`)
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-20">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Recommended for You
              </h2>
              <p className="text-gray-600">
                Top-rated venues based on your preferences and location
              </p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-[#2c5aa0] hover:text-[#1e3d6f] transition-colors cursor-pointer">
              <span className="font-medium">View All</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedVenues.map((venue) => (
            <div key={venue.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              {/* Venue Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🏟️</div>
                  <div className="text-sm opacity-90">Sports Venue</div>
                </div>
                
                {/* Discount Badge */}
                {venue.discount && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {venue.discount}
                  </div>
                )}

                {/* Recommended Badge */}
                {venue.isRecommended && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Recommended
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <button
                    onClick={() => toggleFavorite(venue.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      venue.isFavorite 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <MdFavorite className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare(venue.id)}
                    className="w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <MdShare className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Venue Details */}
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#2c5aa0] transition-colors">
                      {venue.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MdLocationOn className="w-4 h-4 mr-1" />
                      {venue.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-[#2c5aa0]">{venue.price}</span>
                      {venue.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">{venue.originalPrice}</span>
                      )}
                    </div>
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
                  <div className="text-sm text-gray-600 mb-2">Key Features:</div>
                  <div className="flex flex-wrap gap-1">
                    {venue.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {feature}
                      </span>
                    ))}
                    {venue.features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{venue.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleBookNow(venue.id)}
                    className="flex-1 bg-[#2c5aa0] text-white py-2 px-4 rounded-lg hover:bg-[#1e3d6f] transition-colors font-medium cursor-pointer"
                  >
                    Book Now
                  </button>
                  <button 
                    onClick={() => handleViewDetails(venue.id)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
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
          <button className="bg-white text-[#2c5aa0] border border-[#2c5aa0] px-8 py-3 rounded-lg hover:bg-[#2c5aa0] hover:text-white transition-colors font-medium cursor-pointer">
            Load More Recommendations
          </button>
        </div>
      </div>
    </div>
  )
}

export default Recommendations

