import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { MdArrowBack, MdLocationOn, MdPerson, MdAttachMoney, MdDateRange } from 'react-icons/md'
import type { StateType } from '@/redux/slices'
import { FETCH_ADMIN_PAYMENTS_ACTION } from '@/redux/actions/admin/payment.actions'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

const PaymentDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const { payments, loading, error } = useSelector(
    (state: StateType) => state.adminPaymentSlice
  )

  useEffect(() => {
    if (id) {
      FETCH_ADMIN_PAYMENTS_ACTION().catch((err) => {
        console.error('Failed to fetch payments:', err)
        toast.error('Failed to load payment details')
      })
    }
  }, [id])

  const payment = payments?.find(p => p.id === Number(id))

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NRP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  if (error || !payment) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error || 'Payment not found'}</p>
        </div>
        <button
          onClick={() => navigate('/admin/payments')}
          className="mt-4 text-indigo-600 hover:text-indigo-700"
        >
          Back to Payments
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/payments')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <MdArrowBack className="w-5 h-5" />
          <span>Back to Payments</span>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment #{payment.id}</h2>
          <p className="text-gray-600">View payment transaction details</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Venue</p>
            <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
              <MdLocationOn className="w-4 h-4" />
              {payment.venueName}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Customer</p>
            <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
              <MdPerson className="w-4 h-4" />
              {payment.customerName}
            </p>
            <p className="text-xs text-gray-500">{payment.customerEmail}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Amount</p>
            <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
              <MdAttachMoney className="w-4 h-4" />
              {formatCurrency(payment.amount)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </span>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Payment Method</p>
            <p className="text-sm font-medium text-gray-900">{payment.paymentMethod}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Booking Date</p>
            <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
              <MdDateRange className="w-4 h-4" />
              {formatDate(payment.bookingDate)}
            </p>
          </div>
          {payment.bookingRefId && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Booking Reference</p>
              <p className="text-sm font-medium text-gray-900">{payment.bookingRefId}</p>
            </div>
          )}
          {payment.refId && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Payment Reference</p>
              <p className="text-sm font-medium text-gray-900">{payment.refId}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentDetail

