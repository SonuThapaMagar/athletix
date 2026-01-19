import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdLocationOn,
  MdAccessTime,
  MdPhone,
  MdEmail,
  MdArrowBack,
  MdCheckCircle,
  MdClose,
  MdChat,
} from "react-icons/md";
import { useSelector } from "react-redux";
import type { StateType } from "@/redux/slices";
import { FETCH_VENUE_BY_ID_ACTION } from "@/redux/actions/user/playerVenue.actions";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { selectedVenue: venue, loading } = useSelector(
    (state: StateType) => state.playerVenueSlice,
  );

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("1");

  useEffect(() => {
    if (id) {
      FETCH_VENUE_BY_ID_ACTION(Number(id));
    }
  }, [id]);

  const handleBookNow = () => {
    setShowBookingModal(true);
  };

  const handleBookingConfirm = () => {
    if (!venue?.id) return;

    setShowBookingModal(false);

    navigate(`/player/booking/${venue.id}`, {
      state: {
        selectedDate,
        selectedTime,
        selectedDuration: selectedDuration || "1",
      },
    });
  };

  const calculateEndTime = (start: string, duration: number): string => {
    if (!start) return "";

    const [time, period] = start.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    let endHours = hours + duration;
    let endPeriod = endHours >= 12 ? "PM" : "AM";
    if (endHours > 12) endHours -= 12;
    if (endHours === 0) endHours = 12;

    return `${endHours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${endPeriod}`;
  };

  const endTime = calculateEndTime(selectedTime, Number(selectedDuration || 0));
  const totalPrice = venue?.pricePerHour
    ? venue.pricePerHour * Number(selectedDuration || 0)
    : 0;

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96 w-full mb-6 rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">Venue not found</p>
        <button
          onClick={() => navigate("/player")}
          className="text-[#2c5aa0] hover:text-[#1e3d6f] transition-colors cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <MdArrowBack className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <h2 className="text-base font-semibold text-gray-900 truncate max-w-md">
            {venue.name}
          </h2>

          <button
            onClick={() => navigate(`/player/venues/${id}/chat`)}
            className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
          >
            <MdChat className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative">
        <img
          src={venue.images?.[0] || "/placeholder.jpg"}
          alt={venue.name}
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl sm:text-4xl font-bold">{venue.name}</h1>
          <div className="flex items-center gap-2 text-sm mt-2">
            <MdLocationOn className="w-5 h-5" />
            <span>{venue.location}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Additional Images */}
            {venue.images && venue.images.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {venue.images.slice(1).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${venue.name} image ${i + 2}`}
                    className="w-full h-48 object-cover rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  />
                ))}
              </div>
            )}

            {/* Venue Info Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    {venue.name}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MdLocationOn className="w-5 h-5" />
                    <span>{venue.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#2c5aa0]">
                    Rs. {venue.pricePerHour}
                  </div>
                  <div className="text-sm text-gray-500">per hour</div>
                </div>
              </div>

              {/* Sports */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Available Sports
                </h3>
                <div className="flex flex-wrap gap-2">
                  {venue.sports?.length ? (
                    venue.sports.map((sport: string, i: number) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {sport}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No sports listed</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  About This Venue
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {venue.description || "No description available."}
                </p>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Amenities
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {venue.amenities?.length ? (
                    venue.amenities.map((amenity: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-gray-600"
                      >
                        <MdCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No amenities listed</p>
                  )}
                </div>
              </div>

              {/* Operating Hours */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Operating Hours
                </h3>
                <div className="space-y-2">
                  {venue.operatingHours?.length ? (
                    venue.operatingHours.map((schedule: any, i: number) => (
                      <div
                        key={i}
                        className="flex justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="font-medium text-gray-900">
                          {schedule.day}
                        </span>
                        <span className="text-gray-600">
                          {schedule.openTime} - {schedule.closeTime || "??"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Hours not available</p>
                  )}
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <a
                    href={`tel:${venue.phone}`}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <MdPhone className="w-6 h-6 text-green-600" />
                    <span className="font-medium">{venue.phone}</span>
                  </a>
                  <a
                    href={`mailto:${venue.email}`}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <MdEmail className="w-6 h-6 text-blue-600" />
                    <span className="font-medium">{venue.email}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking & Contact */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Book This Venue
              </h3>

              <div className="space-y-5">
                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-11 border border-gray-300 rounded-lg px-4 text-sm focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20",
                          !selectedDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(new Date(selectedDate), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          selectedDate ? new Date(selectedDate) : undefined
                        }
                        onSelect={(date) =>
                          setSelectedDate(
                            date ? date.toISOString().split("T")[0] : "",
                          )
                        }
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time
                  </label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger className="w-full h-11 border border-gray-300 rounded-lg px-4 text-sm focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20">
                      <SelectValue placeholder="Choose time" />
                    </SelectTrigger>
                    <SelectContent>
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
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <Select
                    value={selectedDuration}
                    onValueChange={setSelectedDuration}
                  >
                    <SelectTrigger className="w-full h-11 border border-gray-300 rounded-lg px-4 text-sm focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="3">3 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Summary */}
                <div className="border-t pt-5">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm text-gray-600">
                      Base Price (per hour)
                    </span>
                    <span className="text-sm font-medium">
                      Rs. {venue.pricePerHour}
                    </span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="text-sm font-medium">
                      {selectedDuration
                        ? `${selectedDuration} ${Number(selectedDuration) === 1 ? "hour" : "hours"}`
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-900 border-t pt-3">
                    <span>Total</span>
                    <span>Rs. {totalPrice}</span>
                  </div>
                </div>

                <Button
                  onClick={handleBookNow}
                  disabled={!selectedDate || !selectedTime || !selectedDuration}
                  className="w-full h-12 bg-[#2c5aa0] hover:bg-[#1e3d6f] text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Confirm Booking
              </h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">{venue.name}</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Date:</span>{" "}
                  {selectedDate ? format(new Date(selectedDate), "PPP") : "-"}
                </div>
                <div>
                  <span className="font-medium">Time:</span>{" "}
                  {selectedTime && endTime
                    ? `${selectedTime} - ${endTime}`
                    : "-"}
                </div>
                <div>
                  <span className="font-medium">Duration:</span>{" "}
                  {selectedDuration
                    ? `${selectedDuration} ${Number(selectedDuration) === 1 ? "hour" : "hours"}`
                    : "-"}
                </div>
                <div className="text-base font-semibold text-gray-900 pt-2 border-t">
                  Total: Rs. {totalPrice}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowBookingModal(false)}
                className="flex-1 h-11"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBookingConfirm}
                className="flex-1 h-11 bg-[#2c5aa0] hover:bg-[#1e3d6f]"
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueDetails;
