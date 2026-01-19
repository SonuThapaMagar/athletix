import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { MdArrowBack, MdEdit, MdDelete, MdLocationOn } from 'react-icons/md'
import type { StateType } from '@/redux/slices'
import { FETCH_ADMIN_VENUE_BY_ID_ACTION, DELETE_ADMIN_VENUE_ACTION } from '@/redux/actions/admin/venue.actions'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { useState } from 'react'

const VenueDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [deleteOpen, setDeleteOpen] = useState(false)
  
  const { selectedVenue, loading, error } = useSelector(
    (state: StateType) => state.adminVenueSlice
  )

  useEffect(() => {
    if (id) {
      FETCH_ADMIN_VENUE_BY_ID_ACTION(Number(id)).catch((err) => {
        console.error('Failed to fetch venue:', err)
        toast.error('Failed to load venue details')
      })
    }
  }, [id])

  const handleDelete = async () => {
    if (!selectedVenue) return
    try {
      await DELETE_ADMIN_VENUE_ACTION(selectedVenue.id)
      toast.success('Venue deleted successfully')
      navigate('/admin/venues')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete venue')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error || !selectedVenue) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error || 'Venue not found'}</p>
        </div>
        <button
          onClick={() => navigate('/admin/venues')}
          className="mt-4 text-primary/90 hover:text-primary cursor-pointer"
        >
          Back to Venues
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/venues')}
          className="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <MdArrowBack className="w-5 h-5" />
          <span>Back to Venues</span>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedVenue.name}</h2>
            <p className="text-gray-600 flex items-center gap-1 mt-1">
              <MdLocationOn className="w-4 h-4" />
              {selectedVenue.location}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/admin/venues/edit/${selectedVenue.id}`)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary cursor-pointer flex items-center gap-2"
            >
              <MdEdit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 cursor-pointer"
            >
              <MdDelete className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Owner</p>
            <p className="text-sm font-medium text-gray-900">{selectedVenue.ownerName || selectedVenue.owner || 'N/A'}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <p className="text-sm font-medium text-gray-900">{selectedVenue.status || 'pending'}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Price per Hour</p>
            <p className="text-sm font-medium text-gray-900">Rs. {selectedVenue.pricePerHour}/hour</p>
          </div>
          {selectedVenue.bookings && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Total Bookings</p>
              <p className="text-sm font-medium text-gray-900">{selectedVenue.bookings}</p>
            </div>
          )}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Sports</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedVenue.sports?.map((sport, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {sport}
                </span>
              ))}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Created</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(selectedVenue.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        {selectedVenue.description && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Description</p>
            <p className="text-sm text-gray-900">{selectedVenue.description}</p>
          </div>
        )}
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Venue</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the venue "{selectedVenue.name}".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setDeleteOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default VenueDetail

