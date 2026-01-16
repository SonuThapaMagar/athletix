import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdLocationOn,
  MdSportsSoccer,
  MdAccessTime,
  MdAttachMoney,
  MdVisibility,
  MdRefresh,
} from "react-icons/md";

import DeleteVenueDialog from "@/components/venueOwner/DeleteVenueDialog";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { StateType } from "@/redux/slices";
import {
  DELETE_VENUE_ACTION,
  FETCH_MY_VENUES_ACTION,
} from "@/redux/actions/venue/venue.actions";
import { FETCH_VENUE_OWNER_BOOKINGS_ACTION } from "@/redux/actions/venueOwner/venueOwnerBooking.actions";
import { Skeleton } from "@/components/ui/skeleton";

const VenueManagement = () => {
  const navigate = useNavigate();
  const { venues = [], pagination } = useSelector(
    (state: StateType) => state.venueSlice
  );
  const { bookings: venueBookings = [] } = useSelector(
    (state: StateType) => state.venueOwnerBookingSlice
  );

  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    venueId: null as number | null,
    venueName: "",
  });

  // Calculate booking counts per venue from bookings list
  const venueBookingCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    venueBookings.forEach((booking) => {
      // Only count confirmed bookings
      if (booking.status === 'CONFIRMED' || booking.status === 'PENDING') {
        counts[booking.venueId] = (counts[booking.venueId] || 0) + 1;
      }
    });
    return counts;
  }, [venueBookings]);

  const fetchVenues = async (page = 1) => {
    setLoading(true);
    try {
      await FETCH_MY_VENUES_ACTION({ page, perPage: 5 }); 
      setCurrentPage(page);
    } catch (error: any) {
      console.error("Error fetching venues:", error);
      toast.error(error?.message || "Failed to fetch venues");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      await FETCH_VENUE_OWNER_BOOKINGS_ACTION();
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      // Don't show error toast for bookings, just log it
    }
  };

  useEffect(() => {
    // Fetch both venues and bookings on mount
    const loadData = async () => {
      await Promise.all([
        fetchVenues(currentPage),
        fetchBookings()
      ]);
    };
    loadData();
  }, []);

  // Refresh bookings when page becomes visible (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchBookings();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchVenues(currentPage),
        fetchBookings()
      ]);
      toast.success('Venue list refreshed');
    } catch (error: any) {
      console.error('Error refreshing:', error);
      toast.error('Failed to refresh');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVenue = () => navigate("/venue-owner/venues/add");
  const handleEditVenue = (id: number) =>
    navigate(`/venue-owner/venues/edit/${id}`);
  const handleViewVenue = (id: number) =>
    navigate(`/venue-owner/venues/view/${id}`);

  const handleDeleteVenue = (id: number, name: string) => {
    setDeleteDialog({ isOpen: true, venueId: id, venueName: name });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.venueId) return;
    setIsDeleting(true);
    try {
      await DELETE_VENUE_ACTION(deleteDialog.venueId);
      toast.success("Venue deleted successfully");
      fetchVenues(currentPage); // Refresh current page
      setDeleteDialog({ isOpen: false, venueId: null, venueName: "" });
    } catch (error: any) {
      console.error("Error deleting venue:", error);
      toast.error(error?.message || "Failed to delete venue");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, venueId: null, venueName: "" });
  };

  const goToNextPage = () => {
    if (currentPage < pagination.total_page) fetchVenues(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) fetchVenues(currentPage - 1);
  };

  return (
    <div className="p-6">
      {loading ? (
        <div className="space-y-4 mb-6">
          <Skeleton className="h-35 w-full rounded-md" />
          <Skeleton className="h-35 w-full rounded-md" />
          <Skeleton className="h-35 w-full rounded-md" />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Venue Management
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                title="Refresh venue list"
              >
                <MdRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleAddVenue}
                className="bg-[#2c5aa0] text-white px-4 py-2 rounded-lg hover:bg-[#1e3d6f] cursor-pointer transition-colors flex items-center gap-2"
              >
                <MdAdd className="w-4 h-4" /> Add Venue
              </button>
            </div>
          </div>

          {/* Venues List */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Your Venues</h2>

            {venues.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No venues yet. Add one to get started!
              </p>
            ) : (
              <div className="space-y-4">
                {venues.map((venue) => (
                  <div
                    key={venue.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f] rounded-lg flex items-center justify-center">
                          <MdSportsSoccer className="w-6 h-6 text-white" />
                        </div>

                        <div>
                          <h3 className="font-medium text-gray-900">
                            {venue.name}
                          </h3>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MdLocationOn className="w-4 h-4" />
                              {venue.location || "Unknown"}
                            </div>

                            <div className="flex items-center gap-1">
                              <MdAttachMoney className="w-4 h-4" />
                              ${venue.pricePerHour}/hour
                            </div>

                            <div className="flex items-center gap-1">
                              <MdAccessTime className="w-4 h-4" />
                              {venueBookingCounts[venue.id] || venue.bookings || 0} bookings
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            venue.isVerified
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {venue.isVerified ? "Active" : "Pending"}
                        </span> */}

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewVenue(venue.id)}
                            className="p-2 text-gray-600 hover:text-[#2c5aa0] hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <MdVisibility className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleEditVenue(venue.id)}
                            className="p-2 text-gray-600 hover:text-[#2c5aa0] hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Venue"
                          >
                            <MdEdit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteVenue(venue.id, venue.name)
                            }
                            className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Venue"
                          >
                            <MdDelete className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {venues.length > 0 && (
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {pagination.total_page}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === pagination.total_page}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <DeleteVenueDialog
            isOpen={deleteDialog.isOpen}
            onClose={cancelDelete}
            onConfirm={confirmDelete}
            venueName={deleteDialog.venueName}
            isLoading={isDeleting}
          />
        </>
      )}
    </div>
  );
};

export default VenueManagement;
