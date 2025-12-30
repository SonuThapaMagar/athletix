import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdLocationOn,
  MdCheckCircle,
  MdAccessTime,
  MdCalendarToday,
  MdPerson,
  MdAttachMoney,
  MdPhone,
  MdEmail,
  MdArrowBack,
} from "react-icons/md";
import { useSelector } from "react-redux";
import type { StateType } from "@/redux/slices";
import { Skeleton } from "@/components/ui/skeleton";
import { FETCH_VENUE_OWNER_BOOKING_BY_ID_ACTION, CONFIRM_BOOKING_ACTION, CANCEL_VENUE_OWNER_BOOKING_ACTION } from "@/redux/actions/venueOwner/venueOwnerBooking.actions";
import { FETCH_VENUE_DETAIL_BY_ID } from "@/redux/actions/venue/venue.actions";
import { venueOwnerBookingActions } from "@/redux/slices/venueOwner/venueOwnerBooking.slice";
import { AppDispatch } from "@/redux/store";
import { toast } from "sonner";

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<any>(null);
  const [venueLoading, setVenueLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { selectedBooking, loading, error, bookings } = useSelector(
    (state: StateType) => state.venueOwnerBookingSlice
  );

  useEffect(() => {
    if (id) {
      const bookingId = Number(id);
      console.log("🔄 Fetching booking details for ID:", bookingId);

      // First, check if booking exists in the bookings list
      const existingBooking = bookings.find((b) => b.id === bookingId);
      if (existingBooking) {
        console.log("✅ Found booking in existing list:", existingBooking);
        // Set as selected booking
        AppDispatch(venueOwnerBookingActions.setSelectedBooking(existingBooking));
        // Fetch venue details
        if (existingBooking.venueId) {
          setVenueLoading(true);
          FETCH_VENUE_DETAIL_BY_ID(existingBooking.venueId)
            .then((venueData) => {
              setVenue(venueData);
              console.log("✅ Venue details loaded:", venueData);
            })
            .catch((err) => {
              console.error("Failed to fetch venue:", err);
            })
            .finally(() => setVenueLoading(false));
        }
      } else {
        // Fetch from API
        FETCH_VENUE_OWNER_BOOKING_BY_ID_ACTION(bookingId)
          .then((booking) => {
            console.log("✅ Booking fetched successfully from API:", booking);
            // Fetch venue details
            if (booking && booking.venueId) {
              setVenueLoading(true);
              FETCH_VENUE_DETAIL_BY_ID(booking.venueId)
                .then((venueData) => {
                  setVenue(venueData);
                  console.log("✅ Venue details loaded:", venueData);
                })
                .catch((err) => {
                  console.error("Failed to fetch venue:", err);
                })
                .finally(() => setVenueLoading(false));
            }
          })
          .catch((err) => {
            console.error("❌ Failed to fetch booking:", err);
            toast.error(err.response?.data?.message || err.message || "Failed to load booking details");
          });
      }
    }
  }, [id, bookings]);

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

  const booking = selectedBooking || bookings.find((b) => b.id === Number(id));

  const handleConfirmBooking = async () => {
    if (!booking) return;
    setIsProcessing(true);
    try {
      await CONFIRM_BOOKING_ACTION(booking.id);
      toast.success("Booking confirmed successfully");
      // Refresh the booking details
      await FETCH_VENUE_OWNER_BOOKING_BY_ID_ACTION(booking.id);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to confirm booking");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }
    setIsProcessing(true);
    try {
      await CANCEL_VENUE_OWNER_BOOKING_ACTION(booking.id);
      toast.success("Booking cancelled successfully");
      navigate("/venue-owner/bookings");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to cancel booking");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || venueLoading) {
    return (
      <div className="max-w-4xl mx-auto">
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
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 mb-4">{error || "Booking not found"}</p>
          <button
            onClick={() => navigate("/venue-owner/bookings")}
            className="text-[#2c5aa0] hover:text-[#1e3d6f] font-medium"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/venue-owner/bookings")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <MdArrowBack className="w-5 h-5" />
          <span>Back to Bookings</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
        <p className="text-gray-600 mt-2">View booking information and manage status</p>
      </div>

      {/* Status Banner */}
      {booking.status === "CONFIRMED" && booking.paid && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <MdCheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900">Booking Confirmed</h3>
              <p className="text-sm text-green-700">
                This booking has been confirmed and payment received successfully.
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
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(booking.status)}`}
                >
                  {booking.status}
                </span>
              </div>
            </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Booking ID</label>
              <p className="text-lg font-semibold text-gray-900">#{booking.id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                <MdCalendarToday className="w-4 h-4" />
                Date
              </label>
              <p className="text-lg font-semibold text-gray-900">{formatDate(booking.startTime)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                <MdAccessTime className="w-4 h-4" />
                Time
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                <MdAttachMoney className="w-4 h-4" />
                Amount
              </label>
              <p className="text-lg font-semibold text-gray-900">
                Rs. {booking.amount?.toFixed(2) || "0.00"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Payment Status</label>
              <p className="text-lg font-semibold text-gray-900">
                {booking.paid ? (
                  <span className="text-green-600">Paid</span>
                ) : (
                  <span className="text-yellow-600">Pending</span>
                )}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
              <p className="text-sm text-gray-700">{formatDate(booking.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Player Information Card */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <MdPerson className="w-5 h-5" />
            Player Information
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Player Name</label>
              <p className="text-lg font-semibold text-gray-900">{booking.playerName}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Player ID</label>
              <p className="text-sm text-gray-700">#{booking.playerId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Venue Information Card */}
      {venue && (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
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
                  <MdLocationOn className="w-5 h-5 mr-2 text-[#2c5aa0]" />
                  <span>{venue.location}</span>
                </div>
                {venue.sports && venue.sports.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Available Sports:</div>
                    <div className="flex flex-wrap gap-2">
                      {venue.sports.map((sport: string, index: number) => (
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
                {(venue.phone || venue.email) && (
                  <div className="mt-4 space-y-2">
                    {venue.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MdPhone className="w-4 h-4" />
                        <span>{venue.phone}</span>
                      </div>
                    )}
                    {venue.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MdEmail className="w-4 h-4" />
                        <span>{venue.email}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
        <div className="flex flex-wrap gap-4">
          {booking.status === "PENDING" && (
            <>
              <button
                onClick={handleConfirmBooking}
                disabled={isProcessing}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdCheckCircle className="w-5 h-5" />
                {isProcessing ? "Processing..." : "Confirm Booking"}
              </button>
              {/* <button
                onClick={handleCancelBooking}
                disabled={isProcessing}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel Booking
              </button> */}
            </>
          )}
          {/* {booking.status === "CONFIRMED" && (
            <button
              onClick={handleCancelBooking}
              disabled={isProcessing}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel Booking
            </button>
          )} */}
          {venue && (
            <button
              onClick={() => navigate(`/venue-owner/venues/view/${venue.id}`)}
              className="flex items-center gap-2 bg-[#2c5aa0] text-white px-6 py-3 rounded-lg hover:bg-[#1e3d6f] transition-colors font-medium"
            >
              View Venue Details
            </button>
          )}
          <button
            onClick={() => navigate("/venue-owner/bookings")}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <MdArrowBack className="w-5 h-5" />
            Back to Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
