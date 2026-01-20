import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  MdCalendarToday,
  MdPeople,
  MdAttachMoney,
  MdCheckCircle,
  MdCancel,
  MdVisibility
} from 'react-icons/md'
import type { StateType } from '@/redux/slices'
import {
  FETCH_VENUE_OWNER_BOOKINGS_ACTION,
  CONFIRM_BOOKING_ACTION,
  CANCEL_VENUE_OWNER_BOOKING_ACTION
} from '@/redux/actions/venueOwner/venueOwnerBooking.actions'
import { FETCH_MY_VENUES_ACTION } from '@/redux/actions/venue/venue.actions'
import { toast } from 'sonner'

const BookingManagement = () => {
  const navigate = useNavigate()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const { bookings, loading, error } = useSelector(
    (state: StateType) => state.venueOwnerBookingSlice
  )

  const filters = [
    { id: 'all', label: 'All Bookings' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'cancelled', label: 'Cancelled' }
  ]

  useEffect(() => {
    FETCH_VENUE_OWNER_BOOKINGS_ACTION().catch((err) => {
      console.error('Failed to fetch bookings:', err)
    })
  }, [])

  const handleConfirmBooking = async (bookingId: number) => {
    try {
      await CONFIRM_BOOKING_ACTION(bookingId)
      toast.success('Booking confirmed successfully')
      // Refresh venue list to update booking counts
      try {
        await FETCH_MY_VENUES_ACTION({ page: 1, perPage: 5 })
        console.log('✅ Venue list refreshed after booking confirmation')
      } catch (err) {
        console.error('Failed to refresh venue list:', err)
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to confirm booking')
    }
  }

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }
    try {
      await CANCEL_VENUE_OWNER_BOOKING_ACTION(bookingId)
      toast.success('Booking cancelled successfully')
      // Refresh venue list to update booking counts
      try {
        await FETCH_MY_VENUES_ACTION({ page: 1, perPage: 5 })
        console.log('✅ Venue list refreshed after booking cancellation')
      } catch (err) {
        console.error('Failed to refresh venue list:', err)
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to cancel booking')
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, "0")}, ${date.getFullYear()}`
    } catch {
      return dateString
    }
  }

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      let hours = date.getHours()
      const minutes = date.getMinutes()
      const ampm = hours >= 12 ? "PM" : "AM"
      hours = hours % 12
      hours = hours ? hours : 12
      const minutesStr = minutes.toString().padStart(2, "0")
      return `${hours}:${minutesStr} ${ampm}`
    } catch {
      return dateString
    }
  }

  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      case "FAILED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase()
  }

  const filteredBookings = (Array.isArray(bookings) ? bookings : []).filter((booking) => {
    if (selectedFilter === 'all') return true
    return booking.status.toLowerCase() === selectedFilter.toLowerCase()
  })

  return (
    <div className="p-6">
      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${selectedFilter === filter.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Bookings</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <MdCalendarToday className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{booking.venueName}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MdPeople className="w-4 h-4" />
                          {booking.playerName}
                        </div>
                        <div className="flex items-center gap-1">
                          <MdCalendarToday className="w-4 h-4" />
                          {formatDate(booking.startTime)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MdAttachMoney className="w-4 h-4" />
                          ${booking.amount.toFixed(2)}
                        </div>
                      </div>
                      <div className="mt-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {booking.venueName}
                        </span>
                        <span className="ml-2 text-sm text-gray-600">
                          {formatTimeRange(booking.startTime, booking.endTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/venue-owner/bookings/${booking.id}`)}
                        className="p-2 text-primary/90 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="View booking details"
                      >
                        <MdVisibility className="w-4 h-4" />
                      </button>
                      {booking.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleConfirmBooking(booking.id)}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                            title="Confirm booking"
                          >
                            <MdCheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Cancel booking"
                          >
                            <MdCancel className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Cancel booking"
                        >
                          <MdCancel className="w-4 h-4" />
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
  )
}

export default BookingManagement
