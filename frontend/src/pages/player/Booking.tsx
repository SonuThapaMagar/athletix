import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PlayerNavLayout from "@/layout/PlayerNavLayout";
import { MdLocationOn, MdStar, MdAccessTime, MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import type { StateType } from "@/redux/slices";
import { Skeleton } from "@/components/ui/skeleton";
import { FETCH_VENUE_BY_ID_ACTION } from "@/redux/actions/user/playerVenue.actions";

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedVenue: venue, loading: venueLoading } = useSelector(
    (state: StateType) => state.playerVenueSlice
  );

  // Prefill from state passed from VenueDetails
  const prefill = (location.state as any) || {};
  const [selectedDate, setSelectedDate] = useState(prefill.selectedDate || "");
  const [selectedTime, setSelectedTime] = useState(prefill.selectedTime || "");
  const [selectedDuration, setSelectedDuration] = useState(
    prefill.selectedDuration || "1"
  );
  const [showConfirmation, setShowConfirmation] = useState(false);

  // If venue not in Redux but ID in URL, fetch it
  useEffect(() => {
    if (id && !venue) {
      FETCH_VENUE_BY_ID_ACTION(Number(id));
    }
  }, [id, venue]);

  const timeSlots = [
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
  ];

  const calculateTotal = () => {
    if (!venue) return 0;
    return venue.pricePerHour * Number(selectedDuration || 1);
  };

  const handleBookingConfirm = () => {
    setShowConfirmation(true);
  };

  const handleFinalConfirm = () => {
    setShowConfirmation(false);
    // TODO: Call your CREATE_BOOKING_ACTION here when ready
    navigate("/player/history");
  };

  // Loading state
  if (venueLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // No venue found
  if (!venue) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">Venue not found</p>
        <button onClick={() => navigate("/player")} className="text-[#2c5aa0]">
          Back to venues
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PlayerNavLayout />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Back to Venue Details</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Complete Your Booking
          </h1>
          <p className="text-gray-600 mt-2">
            Review your selection and confirm your booking
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Booking Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20"
                    min={new Date().toISOString().split("T")[0]}
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
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Players
                  </label>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Venue Information
              </h2>

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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {venue.name}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MdLocationOn className="w-4 h-4 mr-1" />
                    {venue.location}
                  </div>
                  {/* <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MdStar className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-medium">{venue.rating}</span>
                      <span className="ml-1">({venue.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <MdAccessTime className="w-4 h-4 mr-1" />
                      {venue.availability}
                    </div>
                  </div> */}

                  <div className="mt-3">
                    <div className="text-sm text-gray-600 mb-2">
                      Available Sports:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {venue.sports.map((sport, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Summary
              </h3>

              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Date</span>
                    <span className="text-sm font-medium">
                      {selectedDate || "Select date"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Time</span>
                    <span className="text-sm font-medium">
                      {selectedTime || "Select time"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="text-sm font-medium">
                      {selectedDuration} hours
                    </span>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Base Price</span>
                    <span className="text-sm font-medium">{venue.pricePerHour}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Duration</span>
                    {/* <span className="text-sm font-medium">
                      ${pricing.subtotal.toFixed(2)}
                    </span> */}
                  </div>
                  {venue.pricePerHour && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-green-600">
                        Discount (20% OFF)
                      </span>
                      {/* <span className="text-sm font-medium text-green-600">
                        -${pricing.discount.toFixed(2)}
                      </span> */}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  {/* <span>${pricing.total.toFixed(2)}</span> */}
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
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Booking
                </h3>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {venue.name}
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Date: {selectedDate}</div>
                    <div>Time: {selectedTime}</div>
                    <div>Duration: {selectedDuration} hours</div>
                    {/* <div>Total: ${pricing.total.toFixed(2)}</div> */}
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
  );
};

export default Booking;
