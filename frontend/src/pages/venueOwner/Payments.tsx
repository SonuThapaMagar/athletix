import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  MdAttachMoney,
  MdDateRange,
  MdCheckCircle,
  MdPending,
  MdDownload,
  MdFilterList,
  MdRefresh,
} from 'react-icons/md'
import type { StateType } from '@/redux/slices'
import {
  FETCH_VENUE_OWNER_PAYMENTS_ACTION,
  FETCH_PAYMENT_SUMMARY_ACTION,
  EXPORT_PAYMENTS_ACTION,
} from '@/redux/actions/venueOwner/venuePayments.actions'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import type { PaymentStatus } from '@/types/venueOwner/payment.types'

const Payments = () => {
  const { payments, summary, loading, error } = useSelector(
    (state: StateType) => state.paymentSlice
  )

  const [selectedFilter, setSelectedFilter] = useState<PaymentStatus | 'all'>('all')
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      await Promise.all([
        FETCH_VENUE_OWNER_PAYMENTS_ACTION(),
        FETCH_PAYMENT_SUMMARY_ACTION(),
      ])
    } catch (err: any) {
      console.error('Failed to fetch payment data:', err)
      toast.error(err?.response?.data?.message || 'Failed to load payment data')
    }
  }

  useEffect(() => {
    if (selectedFilter !== 'all') {
      fetchPayments()
    } else {
      fetchData()
    }
  }, [selectedFilter])

  const fetchPayments = async () => {
    try {
      await FETCH_VENUE_OWNER_PAYMENTS_ACTION(
        selectedFilter !== 'all' ? { status: selectedFilter } : undefined
      )
    } catch (err: any) {
      console.error('Failed to fetch payments:', err)
      toast.error(err?.response?.data?.message || 'Failed to load payments')
    }
  }

  const exportToExcel = async () => {
    setIsExporting(true)
    try {
      const filters: any = {}
      if (selectedFilter !== 'all') {
        filters.status = selectedFilter
      }

      const blob = await EXPORT_PAYMENTS_ACTION({ ...filters, format: 'csv' })
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `payments_report_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success('Payments exported successfully')
    } catch (err: any) {
      console.error('Export failed:', err)
      toast.error(err?.response?.data?.message || 'Failed to export payments')
    } finally {
      setIsExporting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NRP',
      minimumFractionDigits: 2,
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

  const formatPaymentMethod = (method: string) => {
    return method
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ')
  }

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filters = [
    { id: 'all' as const, label: 'All Transactions' },
    { id: 'completed' as const, label: 'Completed' },
    { id: 'pending' as const, label: 'Pending' },
    { id: 'failed' as const, label: 'Failed' },
  ]

  // Filter payments based on selected filter
  const filteredPayments = useMemo(() => {
    if (selectedFilter === 'all') {
      return payments
    }
    return payments.filter(p => p.status === selectedFilter)
  }, [payments, selectedFilter])

  // Initial loading state (when no data exists)
  if (loading && payments.length === 0 && !summary) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <Skeleton className="h-12 w-12 rounded-xl mb-4" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
          <p className="text-gray-600">Track your revenue and payment transactions</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="p-2 text-gray-600 hover:text-[#2c5aa0] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          title="Refresh data"
        >
          <MdRefresh className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MdAttachMoney className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {summary ? formatCurrency(summary.totalRevenue) : 'NRs. 0.00'}
            </p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <MdDateRange className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {summary ? formatCurrency(summary.thisMonth) : 'NRs. 0.00'}
            </p>
            <p className="text-sm text-gray-600">This Month</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <MdPending className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {summary ? formatCurrency(summary.pending) : 'NRs. 0.00'}
            </p>
            <p className="text-sm text-gray-600">Pending Payments</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <MdCheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {summary ? summary.totalTransactions.toLocaleString() : '0'}
            </p>
            <p className="text-sm text-gray-600">Total Transactions</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  selectedFilter === filter.id
                    ? 'bg-[#2c5aa0] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2 cursor-pointer"
              title="Advanced filters coming soon"
            >
              <MdFilterList className="w-4 h-4" />
              Filter
            </button>
            <button
              onClick={exportToExcel}
              disabled={isExporting || loading}
              className="px-4 py-2 bg-[#2c5aa0] text-white rounded-lg hover:bg-[#1e3d6f] text-sm font-medium flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdDownload className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Transactions</h3>

        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Booking ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Venue</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Payment Method</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-gray-900">
                        BK-{String(payment.bookingId).padStart(6, '0')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-900">{payment.venueName}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{payment.customerName}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {formatDate(payment.createdAt)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {formatPaymentMethod(payment.paymentMethod)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Payments
