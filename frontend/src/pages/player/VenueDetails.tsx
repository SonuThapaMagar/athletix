import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdLocationOn,
  MdStar,
  MdAccessTime,
  MdFavorite,
  MdShare,
  MdPhone,
  MdEmail,
  MdArrowBack,
  MdCheckCircle,
  MdClose,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import type { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { FETCH_VENUE_DETAIL_BY_ID } from "@/redux/actions/venue/venue.actions";
import type { VenueDetail } from "@/types/venue.types/venue.types";
import type { StateType } from "@/redux/slices";
import { FETCH_VENUE_BY_ID_ACTION } from "@/redux/actions/user/playerVenue.actions";
import { Skeleton } from "@/components/ui/skeleton";

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { selectedVenue: venue, loading } = useSelector(
    (state: StateType) => state.playerVenueSlice
  );

  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("1");

  // const { selectedVenue: venue } = useSelector(
  //   (state: RootState) => state.venueSlice
  // );
  // const [venue, setVenue] = useState<VenueDetail | null>(null);

  // const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      console.log("🔄 Fetching venue details for ID:", id);
      FETCH_VENUE_BY_ID_ACTION(Number(id))
        .then((venue) => {
          console.log("✅ Venue details loaded:", venue);
        })
        .catch((error) => {
          console.error("❌ Error loading venue details:", error);
        });
    }
  }, [id]);

  const handleBookNow = () => {
    setShowBookingModal(true);
  };

  const handleBookingConfirm = () => {
    if (!venue?.id) return; // safety

    setShowBookingModal(false);

    // Pass pre-filled selections via state + venue ID in URL
    navigate(`/player/booking/${venue.id}`, {
      state: {
        selectedDate,
        selectedTime,
        selectedDuration: selectedDuration || "1",
      },
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <MdStar
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };
  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">Venue not found</p>
        <button
          onClick={() => navigate("/player")}
          className="text-[#2c5aa0] hover:text-[#1e3d6f] transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }
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
            <div className="flex items-center gap-3">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite
                    ? "bg-red-100 text-red-500"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                <MdFavorite className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                <MdShare className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-4">🏟️</div>
                    <div className="text-lg opacity-90">Sports Venue</div>
                  </div>
                </div>

                {/* Discount Badge */}
                {/* {venue.discount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {venue.discount}
                  </div>
                )} */}

                {/* Image Navigation */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {/* {venue.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === selectedImageIndex
                          ? "bg-white scale-110"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))} */}
                  <img
                    src={venue.images?.[0] || "/api/placeholder/800/600"}
                    alt={venue.name}
                    className="w-full h-72 object-cover rounded-xl shadow"
                  />
                </div>
              </div>
            </div>

            {/* Venue Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {venue.name}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MdLocationOn className="w-5 h-5 mr-2" />
                    <span className="text-sm">{venue.location}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {/* <div className="flex items-center">
                      <MdStar className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-medium">{venue.rating}</span>
                      <span className="ml-1">
                        ({venue.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MdAccessTime className="w-4 h-4 mr-1" />
                      {venue.availability}
                    </div>
                    <div className="flex items-center">
                      <MdLocationOn className="w-4 h-4 mr-1" />
                      {venue.distance}
                    </div> */}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-3xl font-bold text-[#2c5aa0]">
                      {venue.pricePerHour}
                    </span>
                    {venue.pricePerHour && (
                      <span className="text-lg text-gray-500 line-through">
                        {venue.pricePerHour}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">per hour</div>
                </div>
              </div>

              {/* Sports Tags */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Available Sports
                </h3>
                <div className="flex flex-wrap gap-2">
                  {venue.sports?.length ? (
                    venue.sports.map((sport: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {sport}
                      </span>
                    ))
                  ) : (
                    <p>No sports listed</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  About This Venue
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {venue.description || "No description available."}
                </p>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Amenities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {venue.amenities?.length ? (
                    venue.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <MdCheckCircle className="w-4 h-4 text-green-500" />
                        <span>{amenity}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No amenities listed</p>
                  )}
                </div>
              </div>

              {/* Operating Hours */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Operating Hours
                </h3>
                <div className="space-y-2">
                  {venue.operatingHours?.length ? (
                    venue.operatingHours.map((schedule, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="font-medium text-gray-900">
                          {schedule.day}
                        </span>
                        <span className="text-gray-600">
                          {schedule.openTime}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      Operating hours not available
                    </p>
                  )}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Reviews
                  </h3>
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="text-[#2c5aa0] hover:text-[#1e3d6f] transition-colors flex items-center gap-1"
                  >
                    {showAllReviews ? (
                      <>
                        <span>Show Less</span>
                        <MdExpandLess className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Show All</span>
                        <MdExpandMore className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
                {/* 
                <div className="space-y-4">
                  {(showAllReviews
                    ? venue.reviews
                    : venue.reviews.slice(0, 2)
                  ).map((review) => (
                    <div
                      key={review.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {review.user.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                {review.user}
                              </span>
                              {review.verified && (
                                <MdCheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                              <span className="text-sm text-gray-500 ml-2">
                                {review.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div> */}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Book This Venue
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20"
                  >
                    <option value="">Choose time</option>
                    {[
                      "6:00 AM",
                      "7:00 AM",
                      "8:00 AM",
                      "9:00 AM",
                      "10:00 AM",
                      "11:00 AM",
                      "12:00 PM",
                      "1:00 PM",
                      "2:00 PM",
                      "3:00 PM",
                      "4:00 PM",
                      "5:00 PM",
                      "6:00 PM",
                      "7:00 PM",
                      "8:00 PM",
                      "9:00 PM",
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
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

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Base Price</span>
                    <span className="text-sm font-medium">
                      {venue.pricePerHour}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Duration (2 hours)
                    </span>
                    <span className="text-sm font-medium">$56.00</span>
                  </div>
                  {venue.pricePerHour && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-green-600">
                        Discount (20% OFF)
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        -$11.20
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-lg font-semibold text-gray-900 border-t pt-2">
                    <span>Total</span>
                    <span>{venue.pricePerHour ? "$44.80" : "$56.00"}</span>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  className="w-full bg-[#2c5aa0] text-white py-3 px-4 rounded-lg hover:bg-[#1e3d6f] transition-colors font-medium"
                >
                  Book Now
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MdPhone className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">{venue.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MdEmail className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">{venue.email}</span>
                </div>
              </div>
            </div>

            {/* Policies */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Policies
              </h3>
              {/* <ul className="space-y-2">
                {venue.policies.map((policy, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <MdCheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{policy}</span>
                  </li>
                ))}
              </ul> */}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Booking
              </h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{venue.name}</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Date: Tomorrow, Dec 16, 2024</div>
                  <div>Time: 6:00 PM - 8:00 PM</div>
                  <div>Duration: 2 hours</div>
                  <div>Total: {venue.pricePerHour ? "$44.80" : "$56.00"}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookingConfirm}
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
  );
};

export default VenueDetails;
