import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdLocationOn,
  MdSportsSoccer,
  MdAccessTime,
  MdAttachMoney,
} from "react-icons/md";

import requests from "@/helper/requests";
import DeleteVenueDialog from "@/components/venueOwner/DeleteVenueDialog";
import { type Venue, type VenueDisplay } from "@/types/venue.types/venue.types";
import { toast } from "sonner";

const VenueManagement = () => {
  const navigate = useNavigate();
  const venueMgmt = requests.venueMgmt;

  const [venues, setVenues] = useState<VenueDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    venueId: null as number | null,
    venueName: "",
  });

  // Fetch venues
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await venueMgmt.getMy();
        const apiVenues: Venue[] = response.data;

        const displayVenues = apiVenues.map((v) => ({
          id: v.id,
          name: v.name,
          location: `${v.location || "Unknown"}`,
          price: `$${v.pricePerHour}/hour`,
          bookings: v.bookings || 0,
          sports: v.sports || [],
          status: v.isVerified ? "Active" : "Pending",
        }));

        setVenues(displayVenues);
      } catch (error) {
        console.error("Error fetching venues:", error);
        toast.error("Failed to load venues");
        setVenues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [venueMgmt]);

  const handleAddVenue = () => navigate("/venue-owner/venues/add");
  const handleEditVenue = (id: number) =>
    navigate(`/venue-owner/venues/edit/${id}`);

  const handleDeleteVenue = (id: number, name: string) => {
    setDeleteDialog({ isOpen: true, venueId: id, venueName: name });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.venueId) return;

    setIsDeleting(true);
    try {
      await venueMgmt.deleteVenue(deleteDialog.venueId);

      setVenues((prev) => prev.filter((v) => v.id !== deleteDialog.venueId));

      toast.success("Venue deleted successfully");
      setDeleteDialog({ isOpen: false, venueId: null, venueName: "" });
    } catch (error) {
      console.error("Error deleting venue:", error);
      toast.error("Failed to delete venue");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, venueId: null, venueName: "" });
  };

  if (loading) return <div className="p-6">Loading venues...</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Venue Management</h2>

        <button
          onClick={handleAddVenue}
          className="bg-[#2c5aa0] text-white px-4 py-2 rounded-lg hover:bg-[#1e3d6f] transition-colors flex items-center gap-2"
        >
          <MdAdd className="w-4 h-4" /> Add Venue
        </button>
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
                          {venue.location}
                        </div>

                        <div className="flex items-center gap-1">
                          <MdAttachMoney className="w-4 h-4" />
                          {venue.price}
                        </div>

                        <div className="flex items-center gap-1">
                          <MdAccessTime className="w-4 h-4" />
                          {venue.bookings} bookings
                        </div>
                      </div>

                      <div className="flex gap-2 mt-2">
                        {venue.sports.slice(0, 3).map((sport, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {sport}
                          </span>
                        ))}
                        {venue.sports.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{venue.sports.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        venue.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {venue.status}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditVenue(venue.id)}
                        className="p-2 text-gray-600 hover:text-[#2c5aa0] hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <MdEdit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteVenue(venue.id, venue.name)}
                        className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
      </div>

      <DeleteVenueDialog
        isOpen={deleteDialog.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        venueName={deleteDialog.venueName}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default VenueManagement;