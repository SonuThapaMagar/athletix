import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PlayerNavLayout from "@/layout/PlayerNavLayout";
import { MdLocationOn, MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import type { StateType } from "@/redux/slices";
import { Skeleton } from "@/components/ui/skeleton";
import { FETCH_VENUE_BY_ID_ACTION } from "@/redux/actions/user/playerVenue.actions";
import { CREATE_PENDING_BOOKING_ACTION } from "@/redux/actions/user/venueBooking.actions";
import { toast } from "sonner";
import requests from "@/helper/requests";
import { submitEsewaPayment } from "@/lib/esewa";

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedVenue: venue, loading: venueLoading } = useSelector(
    (state: StateType) => state.playerVenueSlice
  );

  // Prefill from VenueDetails state
  const prefill = (location.state as any) || {};
  const [selectedDate, setSelectedDate] = useState(prefill.selectedDate || "");
  const [selectedTime, setSelectedTime] = useState(prefill.selectedTime || "");
  const [selectedDuration, setSelectedDuration] = useState(
    prefill.selectedDuration || "1"
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (id && !venue) {
      FETCH_VENUE_BY_ID_ACTION(Number(id));
    }
  }, [id, venue]);

  const timeSlots = [
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  const calculateTotal = () => {
    if (!venue) return 0;
    return venue.pricePerHour * Number(selectedDuration || 1);
  };

  const handleBookingConfirm = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select both date and time");
      return;
    }
    setShowConfirmation(true);
  };

const handleFinalConfirm = async () => {
  if (!venue?.id) return;

  setIsProcessing(true);

  try {
    const startTime = `${selectedDate}T${selectedTime}:00`;

    // Create pending booking
    const booking = await CREATE_PENDING_BOOKING_ACTION({
      venueId: venue.id,
      startTime,
      durationHours: Number(selectedDuration),
    });

    console.log("✅ Booking created:", booking);

    toast.success("Redirecting to eSewa...");

    // 🛠️ Use client-side POST form submission (this sends proper POST)
    submitEsewaPayment({
      bookingId: booking.id,
      amount: calculateTotal(), // Whole number, e.g., 1000
      successUrl: "http://localhost:5173/payment/success",
      failureUrl: `http://localhost:5173/payment/failure?bid=${booking.id}`,
    });

  } catch (err: any) {
    console.error("Error:", err);
    toast.error(err?.message || "Payment initiation failed");
    setIsProcessing(false);
    setShowConfirmation(false);
  }
};

  if (venueLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

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
            Review your selection and proceed to payment
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
                    Select Date *
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time *
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20"
                    required
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
                    Duration *
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
                  <img
                    src={venue.images?.[0] || "/api/placeholder/128/96"}
                    alt={venue.name}
                    className="w-32 h-24 rounded-lg object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {venue.name}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MdLocationOn className="w-4 h-4 mr-1" />
                    {venue.location}
                  </div>

                  <div className="mt-3">
                    <div className="text-sm text-gray-600 mb-2">
                      Available Sports:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {venue.sports?.map((sport, index) => (
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
                      {selectedDate || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Time</span>
                    <span className="text-sm font-medium">
                      {selectedTime || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="text-sm font-medium">
                      {selectedDuration}{" "}
                      {Number(selectedDuration) === 1 ? "hour" : "hours"}
                    </span>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Price per hour
                    </span>
                    <span className="text-sm font-medium">
                      NPR {venue.pricePerHour}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="text-sm font-medium">
                      {selectedDuration}h
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>NPR {calculateTotal()}</span>
                </div>

                <button
                  onClick={handleBookingConfirm}
                  disabled={!selectedDate || !selectedTime || isProcessing}
                  className="w-full bg-[#2c5aa0] text-white py-3 px-4 rounded-lg hover:bg-[#1e3d6f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isProcessing ? "Processing..." : "Proceed to Payment"}
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
                  disabled={isProcessing}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
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
                    <div className="font-semibold text-gray-900 mt-2">
                      Total: NPR {calculateTotal()}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  You will be redirected to eSewa to complete the payment.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    disabled={isProcessing}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFinalConfirm}
                    disabled={isProcessing}
                    className="flex-1 bg-[#2c5aa0] text-white py-2 px-4 rounded-lg hover:bg-[#1e3d6f] transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : "Confirm & Pay"}
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
