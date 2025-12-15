import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdLocationOn } from "react-icons/md";
import type { StateType } from "@/redux/slices";
import { Skeleton } from "@/components/ui/skeleton";
import { FETCH_ALL_VENUES_ACTION } from "@/redux/actions/user/playerVenue.actions";

const HeroSection = () => {
  const navigate = useNavigate();

  // Use playerVenueSlice instead of venueSlice
  const {
    venues = [],
    pagination,
    loading,
  } = useSelector((state: StateType) => state.playerVenueSlice);

  useEffect(() => {
    console.log("🔄 Fetching venues...");
    FETCH_ALL_VENUES_ACTION({ page: 1, perPage: 6 })
      .then(({ venues, pagination }) => {
        console.log("✅ Venues loaded in component:", venues.length);
        console.log("✅ Pagination:", pagination);
      })
      .catch((error) => {
        console.error("❌ Error in HeroSection:", error);
      });
  }, []);

  // Debug: Log current state
  useEffect(() => {
    console.log("📊 Current venues in state:", venues);
    console.log("📊 Current pagination:", pagination);
    console.log("📊 Loading status:", loading);
  }, [venues, pagination, loading]);

  const handlePageChange = (newPage: number) => {
    FETCH_ALL_VENUES_ACTION({ page: newPage, perPage: 6 });
  };

  if (loading) {
    return (
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-[600px] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!loading && venues.length === 0) {
    return (
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏟️</div>
            <p className="text-gray-500 text-lg">
              No venues available at the moment.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Check back later for new venues!
            </p>
          </div>
        </div>
      </section>
    );
  }

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
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={venue.images?.[0] || "/api/placeholder/300/200"}
                alt={venue.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/api/placeholder/300/200";
                }}
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {venue.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MdLocationOn className="w-4 h-4 mr-1" />
                      {venue.location || "Location not specified"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#2c5aa0]">
                      ${venue.pricePerHour}
                    </div>
                    <div className="text-sm text-gray-500">per hour</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {venue.sports?.slice(0, 3).map((sport, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {sport}
                    </span>
                  ))}
                  {venue.sports && venue.sports.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{venue.sports.length - 3} more
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {venue.description || "No description available"}
                </p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/player/booking/${venue.id}`)}
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

        {/* Pagination */}
        {pagination && pagination.total_page > 1 && (
          <div className="flex justify-center items-center mt-8 gap-4">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {pagination.page} of {pagination.total_page}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.total_page}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
