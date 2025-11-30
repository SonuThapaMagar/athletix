import { useState } from 'react'
import {
  MdAttachMoney,
  MdDateRange,
  MdCheckCircle,
  MdPending,
  MdDownload,
  MdFilterList
} from 'react-icons/md'

const Payments = () => {
  const [selectedFilter, setSelectedFilter] = useState('all')

  const exportToExcel = () => {
    const csvData = [
      ['Booking ID', 'Venue', 'Customer', 'Date', 'Payment Method', 'Amount', 'Status'],
      ...transactions.map(t => [
        t.bookingId,
        t.venue,
        t.customer,
        t.date,
        t.paymentMethod,
        t.amount,
        t.status
      ])
    ]

    const csv = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `payments_report_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filters = [
    { id: 'all', label: 'All Transactions' },
    { id: 'completed', label: 'Completed' },
    { id: 'pending', label: 'Pending' }
  ]

  const transactions = [
    {
      id: 1,
      bookingId: 'BK-2024-001',
      venue: 'Elite Sports Complex',
      customer: 'John Doe',
      date: '2024-12-15',
      amount: '$112.00',
      status: 'completed',
      paymentMethod: 'Credit Card'
    },
    {
      id: 2,
      bookingId: 'BK-2024-002',
      venue: 'City Sports Center',
      customer: 'Sarah Wilson',
      date: '2024-12-16',
      amount: '$100.00',
      status: 'pending',
      paymentMethod: 'Debit Card'
    },
    {
      id: 3,
      bookingId: 'BK-2024-003',
      venue: 'Community Gym',
      customer: 'Mike Chen',
      date: '2024-12-17',
      amount: '$80.00',
      status: 'completed',
      paymentMethod: 'PayPal'
    },
    {
      id: 4,
      bookingId: 'BK-2024-004',
      venue: 'Elite Sports Complex',
      customer: 'Emma Brown',
      date: '2024-12-18',
      amount: '$140.00',
      status: 'completed',
      paymentMethod: 'Credit Card'
    }
  ]

  const summary = {
    totalRevenue: '$124,450',
    thisMonth: '$8,450',
    pending: '$250',
    totalTransactions: 1234
  }


  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
        <p className="text-gray-600">Track your revenue and payment transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MdAttachMoney className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{summary.totalRevenue}</p>
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
            <p className="text-2xl font-bold text-gray-900 mb-1">{summary.thisMonth}</p>
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
            <p className="text-2xl font-bold text-gray-900 mb-1">{summary.pending}</p>
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
            <p className="text-2xl font-bold text-gray-900 mb-1">{summary.totalTransactions.toLocaleString()}</p>
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
                         <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2 cursor-pointer">
              <MdFilterList className="w-4 h-4" />
              Filter
            </button>
            <button 
              onClick={exportToExcel}
              className="px-4 py-2 bg-[#2c5aa0] text-white rounded-lg hover:bg-[#1e3d6f] text-sm font-medium flex items-center gap-2 cursor-pointer"
            >
              <MdDownload className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Transactions</h3>
        
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
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900">{transaction.bookingId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900">{transaction.venue}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{transaction.customer}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{transaction.date}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{transaction.paymentMethod}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-semibold text-gray-900">{transaction.amount}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Payments
