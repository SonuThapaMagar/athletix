import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PlayerNavLayout from "@/layout/PlayerNavLayout";
import { MdLocationOn, MdCheckCircle, MdAccessTime, MdCalendarToday, MdSports } from "react-icons/md";
import { useSelector } from "react-redux";
import type { StateType } from "@/redux/slices";
import { Skeleton } from "@/components/ui/skeleton";
import { FETCH_BOOKING_BY_ID_ACTION } from "@/redux/actions/user/venueBooking.actions";
import { FETCH_VENUE_BY_ID_ACTION } from "@/redux/actions/user/playerVenue.actions";
import { toast } from "sonner";
import { AppDispatch } from "@/redux/store";
import { venueBookingActions } from "@/redux/slices/player/venueBooking.slice";

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { selectedBooking, loading, error, bookings } = useSelector(
    (state: StateType) => state.venueBookingSlice
  );
  const { selectedVenue: venue, loading: venueLoading } = useSelector(
    (state: StateType) => state.playerVenueSlice
  );

  useEffect(() => {
    if (id) {
      const bookingId = Number(id);
      // console.log("🔄 Fetching booking details for ID:", bookingId);
      
      // First, check if booking exists in the bookings list
      const existingBooking = bookings.find(b => b.id === bookingId);
      if (existingBooking) {
        // console.log("✅ Found booking in existing list:", existingBooking);
        AppDispatch(venueBookingActions.setSelectedBooking(existingBooking));
        // Fetch venue details if not already loaded
        if (existingBooking.venueId && (!venue || venue.id !== existingBooking.venueId)) {
          console.log("🔄 Fetching venue details for venueId:", existingBooking.venueId);
          FETCH_VENUE_BY_ID_ACTION(existingBooking.venueId).catch((err) => {
            console.error("Failed to fetch venue:", err);
          });
        }
      } else {
        // Fetch from API
        FETCH_BOOKING_BY_ID_ACTION(bookingId)
          .then((booking) => {
            console.log("✅ Booking fetched successfully from API:", booking);
            // Fetch venue details if not already loaded
            if (booking && booking.venueId && (!venue || venue.id !== booking.venueId)) {
              console.log("🔄 Fetching venue details for venueId:", booking.venueId);
              FETCH_VENUE_BY_ID_ACTION(booking.venueId).catch((err) => {
                console.error("Failed to fetch venue:", err);
              });
            }
          })
          .catch((err) => {
            console.error("❌ Failed to fetch booking:", err);
            console.error("Error details:", err.response?.data);
            toast.error(err.response?.data?.message || err.message || "Failed to load booking details");
          });
      }
    }
  }, [id, bookings, venue]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, "0")}, ${date.getFullYear()}`;
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutesStr = minutes.toString().padStart(2, "0");
      return `${hours}:${minutesStr} ${ampm}`;
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "FAILED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading || venueLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PlayerNavLayout />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedBooking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PlayerNavLayout />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 mb-4">{error || "Booking not found"}</p>
            <button
              onClick={() => navigate("/player/bookings")}
              className="text-primary hover:text-[#1e3d6f] font-medium"
            >
              Back to My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PlayerNavLayout />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/player/bookings")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to My Bookings</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
          <p className="text-gray-600 mt-2">View your confirmed booking information</p>
        </div>

        {/* Success Banner */}
        {selectedBooking.status === "CONFIRMED" && selectedBooking.paid && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <MdCheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900">Booking Confirmed</h3>
                <p className="text-sm text-green-700">
                  Your booking has been confirmed and payment received successfully.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Booking Information Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Booking Information</h2>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                  selectedBooking.status
                )}`}
              >
                {selectedBooking.status}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Booking ID</label>
                <p className="text-lg font-semibold text-gray-900">#{selectedBooking.id}</p>
              </div>

              {selectedBooking.sportType && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Sport</label>
                  <div className="flex items-center gap-2">
                    <MdSports className="w-5 h-5 text-primary" />
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                      {selectedBooking.sportType}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                  <MdCalendarToday className="w-4 h-4" />
                  Date
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(selectedBooking.startTime)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                  <MdAccessTime className="w-4 h-4" />
                  Time
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Amount Paid</label>
                <p className="text-lg font-semibold text-gray-900">
                  Rs. {selectedBooking.amount?.toFixed(2) || "0.00"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Payment Status</label>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedBooking.paid ? (
                    <span className="text-green-600">Paid</span>
                  ) : (
                    <span className="text-yellow-600">Pending</span>
                  )}
                </p>
              </div>

              {selectedBooking.paymentRefId && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Payment Reference</label>
                  <p className="text-sm font-mono text-gray-700">{selectedBooking.paymentRefId}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Venue Information Card */}
        {venue && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Venue Information</h2>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {venue.images && venue.images.length > 0 && (
                  <img
                    src={venue.images[0]}
                    alt={venue.name}
                    className="w-full sm:w-48 h-48 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{venue.name}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MdLocationOn className="w-5 h-5 mr-2 text-primary" />
                    <span>{venue.location}</span>
                  </div>
                  {venue.sports && venue.sports.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-600 mb-2">Available Sports:</div>
                      <div className="flex flex-wrap gap-2">
                        {venue.sports.map((sport, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {sport}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {venue.pricePerHour && (
                    <div className="mt-4">
                      <span className="text-sm text-gray-600">Price per hour: </span>
                      <span className="text-lg font-semibold text-gray-900">
                        Rs. {venue.pricePerHour}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate("/player/bookings")}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
          >
            Back to Bookings
          </button>
          {venue && (
            <button
              onClick={() => navigate(`/player/venue/${venue.id}`)}
              className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-[#2666ce] transition-colors font-medium cursor-pointer"
            >
              View Venue Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
