import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { MdLocationOn, MdPerson, MdCalendarToday, MdAttachMoney } from 'react-icons/md'
import type { AdminVenue } from '@/types/admin/venue.types'

interface ViewVenueDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  venue?: AdminVenue | null
}

const ViewVenueDialog = ({ open, onOpenChange, venue }: ViewVenueDialogProps) => {
  if (!venue) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-gray-200 pb-4 mb-6">
          <DialogTitle className="text-xl font-semibold text-gray-900">{venue.name}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-1">Venue information and details</DialogDescription>
        </DialogHeader>

        <div className="space-y-0">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(venue.status || 'pending')}`}>
              {(venue.status || 'pending').charAt(0).toUpperCase() + (venue.status || 'pending').slice(1)}
            </span>
            {venue.rating && (
              <div className="flex items-center gap-1 text-gray-700">
                <span className="text-sm font-semibold">{venue.rating}</span>
                <span className="text-sm text-gray-500">out of 5.0</span>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MdLocationOn className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Location</p>
              <p className="font-medium text-gray-900">{venue.location}</p>
            </div>
          </div>

          {/* Owner */}
          <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MdPerson className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Owner</p>
              <p className="font-medium text-gray-900">{venue.owner || venue.ownerName || 'N/A'}</p>
            </div>
          </div>

          {/* Sports */}
          <div className="border-b border-gray-100 pb-4">
            <p className="text-xs text-gray-500 mb-3">Sports Offered</p>
            <div className="flex flex-wrap gap-2">
              {venue.sports.map((sport, index) => (
                <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded border border-gray-200">
                  {sport}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                  <MdAttachMoney className="w-4 h-4 text-gray-600" />
                </div>
                <p className="text-xs text-gray-500">Price</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {venue.pricePerHour ? `Rs. ${venue.pricePerHour}/hour` : 'Not specified'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                  <MdCalendarToday className="w-4 h-4 text-gray-600" />
                </div>
                <p className="text-xs text-gray-500">Total Bookings</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">{venue.bookings || 0}</p>
            </div>
          </div>

          {/* Created Date */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MdCalendarToday className="w-4 h-4" />
            <span>Created on {new Date(venue.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewVenueDialog
