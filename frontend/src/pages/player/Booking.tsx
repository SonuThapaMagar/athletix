import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import PlayerNavLayout from "@/layout/PlayerNavLayout";
import {
  MdLocationOn,
  MdClose,
  MdCheckCircle,
  MdWarning,
  MdRefresh,
} from "react-icons/md";
import { useSelector } from "react-redux";
import type { StateType } from "@/redux/slices";
import { Skeleton } from "@/components/ui/skeleton";
import { FETCH_VENUE_BY_ID_ACTION } from "@/redux/actions/user/playerVenue.actions";
import {
  CREATE_PENDING_BOOKING_ACTION,
  INITIATE_ESEWA_PAYMENT_ACTION,
} from "@/redux/actions/user/venueBooking.actions";
import { toast } from "sonner";
import { submitEsewaPayment } from "@/lib/esewa";
import api from "@/api/api";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedVenue: venue, loading: venueLoading } = useSelector(
    (state: StateType) => state.playerVenueSlice,
  );
  const { currentBooking, bookings } = useSelector(
    (state: StateType) => state.venueBookingSlice,
  );

  const bookingIdFromUrl = searchParams.get("bookingId");
  const prefill = (location.state as any) || {};

  // Form state
  const [selectedDate, setSelectedDate] = useState(prefill.selectedDate || "");
  const [selectedTime, setSelectedTime] = useState(prefill.selectedTime || "");
  const [selectedDuration, setSelectedDuration] = useState(
    prefill.selectedDuration || "1",
  );
  const [selectedSport, setSelectedSport] = useState("");

  // Availability state
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState("");

  // UI state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingFromPayment, setBookingFromPayment] = useState<any>(null);

  // Fetch venue
  useEffect(() => {
    if (bookingIdFromUrl) {
      const booking =
        bookings.find((b) => b.id === Number(bookingIdFromUrl)) ||
        currentBooking;
      if (booking && booking.venueId) {
        setBookingFromPayment(booking);
        if (!venue || venue.id !== booking.venueId) {
          FETCH_VENUE_BY_ID_ACTION(booking.venueId);
        }
      }
    } else if (currentBooking && currentBooking.venueId) {
      setBookingFromPayment(currentBooking);
      if (!venue || venue.id !== currentBooking.venueId) {
        FETCH_VENUE_BY_ID_ACTION(currentBooking.venueId);
      }
    } else if (id && !venue) {
      FETCH_VENUE_BY_ID_ACTION(Number(id));
    }
  }, [id, venue, bookingIdFromUrl, currentBooking, bookings]);

  // Set default sport when venue loads
  useEffect(() => {
    if (venue && venue.sports && venue.sports.length > 0 && !selectedSport) {
      setSelectedSport(venue.sports[0]);
    }
  }, [venue]);

  // ✅ Check availability when selections change
  const checkAvailability = async () => {
    if (!selectedDate || !selectedTime || !venue?.id) return;

    setIsChecking(true);
    setIsAvailable(null);

    try {
      const startTime = `${selectedDate}T${selectedTime}:00`;
      const res = await api.post("/bookings/check-availability", {
        venueId: venue.id,
        startTime,
        durationHours: Number(selectedDuration),
      });

      setIsAvailable(res.data.available);
      setAvailabilityMessage(res.data.message);
    } catch (err: any) {
      setIsAvailable(false);
      setAvailabilityMessage(
        err.response?.data?.message || "Error checking availability",
      );
    } finally {
      setIsChecking(false);
    }
  };

  // Auto-check when date/time/duration changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedDate && selectedTime) {
        checkAvailability();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedDate, selectedTime, selectedDuration]);

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
    if (!selectedSport) {
      toast.error("Please select a sport");
      return;
    }
    if (isAvailable !== true) {
      toast.error(
        "Please wait for availability check or select a different time",
      );
      return;
    }
    setShowConfirmation(true);
  };

  const handleFinalConfirm = async () => {
    if (!venue?.id) return;
    setIsProcessing(true);

    try {
      const startTime = `${selectedDate}T${selectedTime}:00`;

      // Step 1: Create pending booking with sport type
      const booking = await CREATE_PENDING_BOOKING_ACTION({
        venueId: venue.id,
        startTime,
        durationHours: Number(selectedDuration),
        sportType: selectedSport,
      });

      console.log("✅ Booking created:", booking);

      // Step 2: Initiate payment record in backend (creates payment record)
      try {
        await INITIATE_ESEWA_PAYMENT_ACTION(booking.id);
        console.log("✅ Payment record created for booking:", booking.id);
      } catch (initError: any) {
        console.error("⚠️ Failed to initiate payment record:", initError);
        // Continue anyway - backend might create it during verification
        // But log the error for debugging
        toast.warning("Payment initiation had issues, but continuing...");
      }

      toast.success("Redirecting to eSewa...");

      // Step 3: Redirect to eSewa payment
      submitEsewaPayment({
        bookingId: booking.id,
        amount: calculateTotal(),
        successUrl: "http://localhost:5173/payment/success",
        failureUrl: `http://localhost:5173/payment/failure?bid=${booking.id}`,
      });
    } catch (err: any) {
      console.error("Error:", err);
      const errorMsg =
        err.response?.data?.message || err?.message || "Booking failed";
      toast.error(errorMsg);
      setIsProcessing(false);
      setShowConfirmation(false);

      // Re-check availability if slot was just taken
      if (
        errorMsg.includes("already booked") ||
        errorMsg.includes("just been taken")
      ) {
        checkAvailability();
      }
    }
  };

  const showPaymentSuccess =
    bookingFromPayment &&
    bookingFromPayment.paid &&
    bookingFromPayment.status === "CONFIRMED";

  if (venueLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PlayerNavLayout />
        <div className="p-6">
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PlayerNavLayout />
        <div className="p-6 text-center">
          <p className="text-red-500 mb-4">Venue not found</p>
          <button
            onClick={() => navigate("/player")}
            className="text-[#2c5aa0]"
          >
            Back to venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PlayerNavLayout />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Success Banner */}
        {showPaymentSuccess && bookingFromPayment && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <MdCheckCircle className="w-6 h-6 text-green-600" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900">
                  Booking Confirmed!
                </h3>
                <p className="text-sm text-green-700">
                  Your booking #{bookingFromPayment.id} for{" "}
                  {bookingFromPayment.sportType || "sports"} has been confirmed.
                  Payment received successfully.
                </p>
              </div>
              <button
                onClick={() => navigate("/player/bookings")}
                className="text-sm text-green-700 hover:text-green-900 font-medium underline"
              >
                View All Bookings
              </button>
            </div>
          </div>
        )}

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
            {showPaymentSuccess ? "Booking Details" : "Complete Your Booking"}
          </h1>
          <p className="text-gray-600 mt-2">
            {showPaymentSuccess
              ? "View your confirmed booking details"
              : "Select your sport, date, and time to continue"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {!showPaymentSuccess && (
              <>
                {/* Sport Selection */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Select Sport *
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {venue.sports?.map((sport) => (
                      <button
                        key={sport}
                        onClick={() => setSelectedSport(sport)}
                        disabled={showPaymentSuccess}
                        className={`px-6 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                          selectedSport === sport
                            ? "bg-primary text-white shadow-md scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {sport}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Booking Details Form */}
                <Card className="rounded-2xl shadow-sm">
                  <CardHeader>
                    <CardTitle>Booking Details</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* 📅 Date */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Select Date *
                        </label>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left"
                            >
                              {selectedDate ? (
                                format(selectedDate, "PPP")
                              ) : (
                                <span className="text-muted-foreground">
                                  Pick a date
                                </span>
                              )}
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Time */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Select Time *
                        </label>

                        <Select
                          value={selectedTime}
                          onValueChange={setSelectedTime}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose time" />
                          </SelectTrigger>

                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* ⌛ Duration */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Duration *
                        </label>

                        <Select
                          value={selectedDuration}
                          onValueChange={setSelectedDuration}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="1">1 hour</SelectItem>
                            <SelectItem value="2">2 hours</SelectItem>
                            <SelectItem value="3">3 hours</SelectItem>
                            <SelectItem value="4">4 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* ✅ Availability Status */}
                    {selectedDate && selectedTime && (
                      <div>
                        {isChecking ? (
                          <Badge variant="secondary" className="gap-2">
                            <span className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-primary rounded-full" />
                            Checking availability...
                          </Badge>
                        ) : isAvailable === true ? (
                          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-green-700">
                              <MdCheckCircle className="text-lg" />
                              <span className="font-medium">
                                {availabilityMessage}
                              </span>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={checkAvailability}
                            >
                              <MdRefresh className="mr-1" />
                              Refresh
                            </Button>
                          </div>
                        ) : isAvailable === false ? (
                          <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-red-700">
                              <MdWarning className="text-lg" />
                              <span className="font-medium">
                                {availabilityMessage}
                              </span>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={checkAvailability}
                            >
                              <MdRefresh className="mr-1" />
                              Retry
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Confirmed Booking Details */}
            {showPaymentSuccess && bookingFromPayment && (
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Confirmed Booking Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Booking ID
                    </label>
                    <p className="text-sm font-semibold text-gray-900">
                      #{bookingFromPayment.id}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Sport
                    </label>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      {bookingFromPayment.sportType || "N/A"}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Date
                    </label>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(
                        bookingFromPayment.startTime,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Time
                    </label>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(
                        bookingFromPayment.startTime,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -
                      {new Date(bookingFromPayment.endTime).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Amount Paid
                    </label>
                    <p className="text-sm font-semibold text-gray-900">
                      Rs. {bookingFromPayment.amount?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Status
                    </label>
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {bookingFromPayment.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Venue Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Venue Information
              </h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={venue.images?.[0] || "/api/placeholder/128/96"}
                  alt={venue.name}
                  className="w-32 h-24 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {venue.name}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MdLocationOn className="w-4 h-4 mr-1" />
                    {venue.location}
                  </div>
                  <div>
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

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Summary
              </h3>

              <div className="space-y-4">
                <div className="border-b pb-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sport</span>
                    <span className="text-sm font-medium">
                      {selectedSport || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Date</span>
                    <span className="text-sm font-medium">
                      {selectedDate || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
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

                <div className="border-b pb-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Price per hour
                    </span>
                    <span className="text-sm font-medium">
                      NPR {venue.pricePerHour}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
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

                {showPaymentSuccess ? (
                  <button
                    onClick={() => navigate("/player/bookings")}
                    className="w-full bg-[#2c5aa0] text-white py-3 px-4 rounded-lg hover:bg-[#1e3d6f] transition-colors font-medium"
                  >
                    View All Bookings
                  </button>
                ) : (
                  <button
                    onClick={handleBookingConfirm}
                    disabled={
                      !selectedDate ||
                      !selectedTime ||
                      !selectedSport ||
                      isAvailable !== true ||
                      isProcessing
                    }
                    className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-[#1e3d6f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isProcessing ? "Processing..." : "Proceed to Payment"}
                  </button>
                )}
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
                    <div>
                      <strong>Sport:</strong> {selectedSport}
                    </div>
                    <div>
                      <strong>Date:</strong> {selectedDate}
                    </div>
                    <div>
                      <strong>Time:</strong> {selectedTime}
                    </div>
                    <div>
                      <strong>Duration:</strong> {selectedDuration} hours
                    </div>
                    <div className="font-semibold text-gray-900 mt-2">
                      Total: NPR {calculateTotal()}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  You will be redirected to eSewa for payment. Your booking will
                  be confirmed instantly after successful payment.
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
