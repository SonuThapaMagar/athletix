import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdLocationOn,
  MdSportsSoccer,
  MdAccessTime,
  MdAttachMoney
} from 'react-icons/md'
import DeleteVenueDialog from '@/components/venueOwner/DeleteVenueDialog'

const VenueManagement = () => {
  const navigate = useNavigate()
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    venueId: number | null
    venueName: string
  }>({
    isOpen: false,
    venueId: null,
    venueName: ''
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const handleAddVenue = () => {
    navigate('/venue-owner/venues/add')
  }

  const handleEditVenue = (venueId: number) => {
    navigate(`/venue-owner/venues/edit/${venueId}`)
  }

  const handleDeleteVenue = (venueId: number, venueName: string) => {
    setDeleteDialog({
      isOpen: true,
      venueId,
      venueName
    })
  }

  const confirmDelete = async () => {
    if (!deleteDialog.venueId) return

    setIsDeleting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In real app, make API call here
      console.log('Deleting venue:', deleteDialog.venueId)
      
      // Close dialog
      setDeleteDialog({
        isOpen: false,
        venueId: null,
        venueName: ''
      })
    } catch (error) {
      console.error('Error deleting venue:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelDelete = () => {
    setDeleteDialog({
      isOpen: false,
      venueId: null,
      venueName: ''
    })
  }

  // Mock venue data
  const venues = [
    {
      id: 1,
      name: "Elite Sports Complex",
      location: "Downtown District",
      price: "$28/hour",
      bookings: 45,
      sports: ["Football", "Basketball", "Tennis"],
      status: "Active"
    },
    {
      id: 2,
      name: "City Sports Center",
      location: "Sports District",
      price: "$35/hour",
      bookings: 32,
      sports: ["Tennis", "Badminton"],
      status: "Active"
    },
    {
      id: 3,
      name: "Community Gym",
      location: "Riverside Area",
      price: "$20/hour",
      bookings: 28,
      sports: ["Football", "Cricket"],
      status: "Maintenance"
    }
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Venue Management</h2>
        <button 
          onClick={handleAddVenue}
          className="bg-[#2c5aa0] text-white px-4 py-2 rounded-lg hover:bg-[#1e3d6f] transition-colors flex items-center gap-2 cursor-pointer"
        >
          <MdAdd className="w-4 h-4" />
          Add Venue
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Venues</h2>
        
        <div className="space-y-4">
          {venues.map((venue) => (
            <div key={venue.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f] rounded-lg flex items-center justify-center">
                    <MdSportsSoccer className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{venue.name}</h3>
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
                      {venue.sports.map((sport, sportIndex) => (
                        <span key={sportIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {sport}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      venue.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {venue.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditVenue(venue.id)}
                      className="p-2 text-gray-600 hover:text-[#2c5aa0] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit venue"
                    >
                      <MdEdit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteVenue(venue.id, venue.name)}
                      className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete venue"
                    >
                      <MdDelete className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteVenueDialog
        isOpen={deleteDialog.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        venueName={deleteDialog.venueName}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default VenueManagement