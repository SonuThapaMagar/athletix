import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdLocationOn, MdStar, MdAccessTime } from "react-icons/md";
import type { StateType } from "@/redux/slices";
import { FETCH_VENUES_ACTION } from "@/redux/actions/venue/venue.actions";

const HeroSection = () => {
  const navigate = useNavigate();
  const { venues = [], pagination } = useSelector(
    (state: StateType) => state.venueSlice
  );

  const [loading, setLoading] = useState(true);

  const fetchAllVenues = async () => {
    await FETCH_VENUES_ACTION({ page: 1, perPage: 6 });
  };

  useEffect(() => {
    fetchAllVenues().finally(() => setLoading(false));
  }, []);

  const enhancedVenues = venues.map((venue) => ({
    ...venue,
    rating: 4.7,
    reviews: Math.floor(Math.random() * 200) + 50,
    availability: `${Math.floor(Math.random() * 10) + 1} slots available`,
    distance: `${(Math.random() * 3 + 0.5).toFixed(1)} km`,
    image: venue.images?.[0] || "/api/placeholder/300/200",
  }));

  // Simple fallback if no venues yet
  if (venues.length === 0)
    return <p className="text-center py-8">Loading venues...</p>;

  return (
    <section className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Your Perfect Sports Venue
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover top-rated sports facilities in your area. Book instantly
            and play with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enhancedVenues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={venue.image}
                alt={venue.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {venue.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MdLocationOn className="w-4 h-4 mr-1" />
                      {venue.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#2c5aa0]">
                      ${venue.pricePerHour}/hour
                    </div>
                    <div className="text-sm text-gray-500">per hour</div>
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  <MdStar className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium text-gray-900">
                    {venue.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({venue.reviews} reviews)
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {venue.sports.map((sport, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {sport}
                    </span>
                  ))}
                </div>

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

                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      navigate(`/player/booking?venueId=${venue.id}`)
                    }
                    className="flex-1 bg-[#2c5aa0] text-white py-2 px-4 rounded-lg hover:bg-[#1e3d6f] transition-colors font-medium"
                  >
                    Book Now
                  </button>
                  <button
                    onClick={() => navigate(`/player/venue/${venue.id}`)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
