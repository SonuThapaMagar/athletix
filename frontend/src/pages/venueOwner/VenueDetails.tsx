import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdLocationOn,
  MdStar,
  MdAccessTime,
  MdArrowBack,
  MdCheckCircle,
  MdPhone,
  MdEmail,
  MdAttachMoney,
  MdEdit,
} from "react-icons/md";
import { FETCH_VENUE_DETAIL_BY_ID } from "@/redux/actions/venue/venue.actions";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Skeleton } from "@/components/ui/skeleton";
import type { VenueDetail } from "@/types/venue.types/venue.types";

const VenueDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [venue, setVenue] = useState<VenueDetail | null>(null);

  const fetchVenueDetail=(id: number) => {
    FETCH_VENUE_DETAIL_BY_ID(id)
      .then((data) => {
              console.log("Venue data fetched:", data);
        setVenue(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id) fetchVenueDetail(Number(id));
  }, [id]);
 
  const [error, setError] = useState(false);

  const handleEdit = () => {
    if (id) navigate(`/venue-owner/venues/edit/${id}`);
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

  if (error || !venue) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">Venue not found</p>
        <button
          onClick={() => navigate("/venue-owner/venues")}
          className="text-[#2c5aa0] hover:text-[#1e3d6f] transition-colors"
        >
          Back to Venues
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b mb-6">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/venue-owner/venues")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <MdArrowBack className="w-5 h-5" />
              <span>Back to Venues</span>
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-[#2c5aa0] text-white px-4 py-2 rounded-lg hover:bg-[#1e3d6f] transition-colors"
            >
              <MdEdit className="w-4 h-4" />
              Edit Venue
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="relative">
                {venue.images && venue.images.length > 0 ? (
                  <div className="aspect-video relative">
                    <img
                      src={venue.images[0]}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                    {venue.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {venue.images.slice(0, 5).map((_, index) => (
                          <div
                            key={index}
                            className="w-3 h-3 rounded-full bg-white/50"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f] flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-6xl mb-4">🏟️</div>
                      <div className="text-lg opacity-90">Sports Venue</div>
                    </div>
                  </div>
                )}
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
                    <span className="text-sm">
                      {venue.location || "Location not specified"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {/* {venue.rating && (
                      <div className="flex items-center">
                        <MdStar className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="font-medium">{venue.rating}</span>
                        {venue.reviewCount && (
                          <span className="ml-1">({venue.reviewCount} reviews)</span>
                        )}
                      </div>
                    )} */}
                    <div className="flex items-center">
                      <MdAttachMoney className="w-4 h-4 mr-1" />
                      <span>
                        ${venue.pricePerHour || venue.pricePerHour || "N/A"}
                        /hour
                      </span>
                    </div>
                    {venue.bookings !== undefined && (
                      <div className="flex items-center">
                        <MdAccessTime className="w-4 h-4 mr-1" />
                        <span>{venue.bookings} bookings</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      venue.isVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {venue.isVerified ? "Verified" : "Pending Verification"}
                  </span>
                </div> */}
              </div>

              {/* Sports Tags */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Available Sports
                </h3>
                <div className="flex flex-wrap gap-2">
                  {venue.sports && venue.sports.length > 0 ? (
                    venue.sports.map((sport: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
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
                  {venue.amenities && venue.amenities.length > 0 ? (
                    venue.amenities.map((amenity: string, index: number) => (
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
                  {venue.operatingHours && venue.operatingHours.length > 0 ? (
                    venue.operatingHours.map((schedule: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="font-medium text-gray-900">
                          {schedule.day}
                        </span>
                        <span className="text-gray-600">
                          {schedule.openTime} - {schedule.closeTime}
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
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                {venue.phone && (
                  <div className="flex items-center gap-3">
                    <MdPhone className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{venue.phone}</span>
                  </div>
                )}
                {venue.email && (
                  <div className="flex items-center gap-3">
                    <MdEmail className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{venue.email}</span>
                  </div>
                )}
                {!venue.phone && !venue.email && (
                  <p className="text-sm text-gray-500">
                    No contact information available
                  </p>
                )}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Venue Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Bookings</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {venue.bookings || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Price per Hour</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ${venue.pricePerHour || venue.pricePerHour || "N/A"}
                  </span>
                </div>
                {/* {venue.rating && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Rating</span>
                    <div className="flex items-center gap-1">
                      <MdStar className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-semibold text-gray-900">
                        {venue.rating}
                      </span>
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
