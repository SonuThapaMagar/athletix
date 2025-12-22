import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlayerNavLayout from "@/layout/PlayerNavLayout";
import { useSelector } from "react-redux";
import type { StateType } from "@/redux/slices";
import { FETCH_MY_BOOKINGS_ACTION, CANCEL_BOOKING_ACTION } from "@/redux/actions/user/venueBooking.actions";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const MyBookings = () => {
  const navigate = useNavigate();
  const { bookings, loading, error } = useSelector(
    (state: StateType) => state.venueBookingSlice
  );
  const [selectedFilter, setSelectedFilter] = useState<"all" | "PENDING" | "CONFIRMED" | "CANCELLED">("all");

  const handleBookingClick = (booking: any) => {
    if (booking.status === "CONFIRMED") {
      // Navigate to booking details page for confirmed bookings
      navigate(`/player/booking-details/${booking.id}`);
    } else if (booking.venueId) {
      // Navigate to booking page for pending/cancelled bookings
      navigate(`/player/booking/${booking.venueId}?bookingId=${booking.id}`);
    }
  };

  useEffect(() => {
    FETCH_MY_BOOKINGS_ACTION().catch((err) => {
      console.error("Failed to fetch bookings:", err);
    });
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    if (selectedFilter === "all") return true;
    return booking.status === selectedFilter;
  });

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await CANCEL_BOOKING_ACTION(bookingId);
      toast.success("Booking cancelled successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel booking");
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

  return (
    <div className="min-h-screen bg-gray-50">
      <PlayerNavLayout />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">View and manage all your bookings</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                  selectedFilter === "all"
                    ? "border-[#2c5aa0] text-[#2c5aa0]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                All Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setSelectedFilter("CONFIRMED")}
                className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                  selectedFilter === "CONFIRMED"
                    ? "border-[#2c5aa0] text-[#2c5aa0]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Confirmed ({bookings.filter((b) => b.status === "CONFIRMED").length})
              </button>
              <button
                onClick={() => setSelectedFilter("PENDING")}
                className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                  selectedFilter === "PENDING"
                    ? "border-[#2c5aa0] text-[#2c5aa0]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Pending ({bookings.filter((b) => b.status === "PENDING").length})
              </button>
              <button
                onClick={() => setSelectedFilter("CANCELLED")}
                className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                  selectedFilter === "CANCELLED"
                    ? "border-[#2c5aa0] text-[#2c5aa0]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Cancelled ({bookings.filter((b) => b.status === "CANCELLED").length})
              </button>
            </nav>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <Skeleton className="h-6 w-48 mb-4" />
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600">
              {selectedFilter === "all"
                ? "You haven't made any bookings yet."
                : `You don't have any ${selectedFilter.toLowerCase()} bookings.`}
            </p>
          </div>
        ) : (
          /* Bookings List */
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => handleBookingClick(booking)}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {booking.venueName?.charAt(0) || "V"}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.venueName || "Unknown Venue"}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {formatDate(booking.startTime)} • {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Booking ID: #{booking.id}
                          {booking.paid && (
                            <span className="ml-2 text-green-600">• Paid</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        Rs. {booking.amount?.toFixed(2) || "0.00"}
                      </p>
                      {booking.status === "PENDING" && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
