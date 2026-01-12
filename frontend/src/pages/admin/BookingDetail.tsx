import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { MdArrowBack, MdLocationOn, MdCalendarToday, MdAttachMoney } from 'react-icons/md'
import type { StateType } from '@/redux/slices'
import { FETCH_ADMIN_BOOKING_BY_ID_ACTION } from '@/redux/actions/admin/booking.actions'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const { selectedBooking, loading, error } = useSelector(
    (state: StateType) => state.adminBookingSlice
  )

  useEffect(() => {
    if (id) {
      FETCH_ADMIN_BOOKING_BY_ID_ACTION(Number(id)).catch((err) => {
        console.error('Failed to fetch booking:', err)
        toast.error('Failed to load booking details')
      })
    }
  }, [id])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NRP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  if (error || !selectedBooking) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error || 'Booking not found'}</p>
        </div>
        <button
          onClick={() => navigate('/admin/bookings')}
          className="mt-4 text-indigo-600 hover:text-indigo-700"
        >
          Back to Bookings
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/bookings')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <MdArrowBack className="w-5 h-5" />
          <span>Back to Bookings</span>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Booking #{selectedBooking.id}</h2>
          <p className="text-gray-600">View booking details and information</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Venue</p>
            <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
              <MdLocationOn className="w-4 h-4" />
              {selectedBooking.venueName}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Player</p>
            <p className="text-sm font-medium text-gray-900">{selectedBooking.playerName}</p>
            <p className="text-xs text-gray-500">{selectedBooking.playerEmail}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Date</p>
            <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
              <MdCalendarToday className="w-4 h-4" />
              {formatDate(selectedBooking.startTime)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Time</p>
            <p className="text-sm font-medium text-gray-900">
              {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Amount</p>
            <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
              <MdAttachMoney className="w-4 h-4" />
              {formatCurrency(selectedBooking.amount)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedBooking.status)}`}>
              {selectedBooking.status}
            </span>
          </div>
          {selectedBooking.sport && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Sport</p>
              <p className="text-sm font-medium text-gray-900">{selectedBooking.sport}</p>
            </div>
          )}
          {selectedBooking.bookingRefId && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Booking Reference</p>
              <p className="text-sm font-medium text-gray-900">{selectedBooking.bookingRefId}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingDetail

