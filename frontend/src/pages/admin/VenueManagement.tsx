import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  MdSearch,
  MdEdit,
  MdDelete,
  MdLocationOn,
  MdCheckCircle,
  MdVisibility,
  MdFileDownload
} from 'react-icons/md'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import DeleteVenueDialog from '@/components/venueOwner/DeleteVenueDialog'
import type { StateType } from '@/redux/slices'
import { FETCH_ADMIN_VENUES_ACTION, DELETE_ADMIN_VENUE_ACTION } from '@/redux/actions/admin/venue.actions'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import type { AdminVenue } from '@/types/admin/venue.types'

const VenueManagement = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<AdminVenue | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const { venues, loading, error, pagination } = useSelector(
    (state: StateType) => state.adminVenueSlice
  )

  // Export to Excel
  const exportToExcel = () => {
    if (venues.length === 0) {
      toast.error('No venues to export')
      return
    }

    setIsExporting(true)
    try {
      const excelData = venues.map(venue => ({
        'ID': venue.id,
        'Name': venue.name,
        'Owner': venue.ownerName || 'N/A',
        'Location': venue.location,
        'Sports': venue.sports?.join(', ') || '',
        'Price/Hour': venue.pricePerHour || 0,
        'Bookings': venue.bookings || 0,
        'Status': venue.status || 'INACTIVE',
        'Created At': venue.createdAt ? new Date(venue.createdAt).toLocaleDateString() : ''
      }))

      const worksheet = XLSX.utils.json_to_sheet(excelData)
      worksheet['!cols'] = [
        { wch: 8 },
        { wch: 20 },
        { wch: 15 },
        { wch: 20 },
        { wch: 20 },
        { wch: 12 },
        { wch: 10 },
        { wch: 12 },
        { wch: 12 }
      ]

      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Venues')
      XLSX.writeFile(workbook, `venues-export-${new Date().toISOString().split('T')[0]}.xlsx`)
      
      toast.success('Venues exported to Excel successfully')
    } catch (err) {
      console.error('Export failed:', err)
      toast.error('Failed to export venues')
    } finally {
      setIsExporting(false)
    }
  }

  // Export to PDF
  const exportToPDF = () => {
    if (venues.length === 0) {
      toast.error('No venues to export')
      return
    }

    setIsExporting(true)
    try {
      const doc = new jsPDF()
      doc.setFontSize(16)
      doc.text('Venues Report', 14, 10)
      doc.setFontSize(10)
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 18)

      const tableData = venues.map(venue => [
        venue.id,
        venue.name,
        venue.ownerName || 'N/A',
        venue.location,
        venue.sports?.join(', ') || '',
        venue.pricePerHour || 0,
        venue.bookings || 0,
        venue.status || 'INACTIVE'
      ])

      autoTable(doc, {
        head: [['ID', 'Name', 'Owner', 'Location', 'Sports', 'Price/Hour', 'Bookings', 'Status']],
        body: tableData,
        startY: 25,
        theme: 'grid',
        styles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 25 },
          2: { cellWidth: 20 },
          3: { cellWidth: 25 },
          4: { cellWidth: 30 },
          5: { cellWidth: 15 },
          6: { cellWidth: 15 },
          7: { cellWidth: 15 }
        }
      })

      doc.save(`venues-export-${new Date().toISOString().split('T')[0]}.pdf`)
      toast.success('Venues exported to PDF successfully')
    } catch (err) {
      console.error('Export failed:', err)
      toast.error('Failed to export venues')
    } finally {
      setIsExporting(false)
    }
  }

  // Calculate filter counts from actual data
  const filterCounts = useMemo(() => {
    const all = venues.length
    const active = venues.filter(v => v.status === 'ACTIVE').length

    return { all, active }
  }, [venues])

  const filters = [
    { id: 'all' as const, label: 'All Venues', count: filterCounts.all },
    { id: 'active' as const, label: 'Active Venues', count: filterCounts.active }
  ]

  // Filter venues based on selected filter and search query
  const filteredVenues = useMemo(() => {
    let filtered = venues

    // Apply status filter
    if (selectedFilter === 'active') {
      filtered = filtered.filter(v => v.status === 'ACTIVE')
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(v =>
        v.name.toLowerCase().includes(query) ||
        v.location.toLowerCase().includes(query) ||
        v.ownerName?.toLowerCase().includes(query) ||
        v.sports?.some(sport => sport.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [venues, selectedFilter, searchQuery])

  // Fetch venues on mount and when filters change
  useEffect(() => {
    setCurrentPage(1)
    FETCH_ADMIN_VENUES_ACTION({
      search: searchQuery || undefined,
      page: 1,
      perPage: 10,
    }).catch((err) => {
      console.error('Failed to fetch venues:', err)
    })
  }, [searchQuery])

  // Fetch venues when page changes
  useEffect(() => {
    if (currentPage > 1) {
      FETCH_ADMIN_VENUES_ACTION({
        search: searchQuery || undefined,
        page: currentPage,
        perPage: 10,
      }).catch((err) => {
        console.error('Failed to fetch venues:', err)
      })
    }
  }, [currentPage])

  const getStatusColor = (status?: string) => {
    return status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
  }

  const handleView = (venue: AdminVenue) => {
    // Navigate to venue detail page
    navigate(`/admin/venues/${venue.id}`)
  }

  const handleEdit = (venueId: number) => {
    navigate(`/admin/venues/edit/${venueId}`)
  }

  const handleDelete = (venue: any) => {
    setSelectedVenue(venue)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedVenue) return
    setIsDeleting(true)
    try {
      await DELETE_ADMIN_VENUE_ACTION(selectedVenue.id)
      toast.success('Venue deleted successfully')
      setDeleteDialogOpen(false)
      setSelectedVenue(null)
      // Refresh venues list
      FETCH_ADMIN_VENUES_ACTION({
        search: searchQuery || undefined,
      }).catch((err) => {
        console.error('Failed to refresh venues:', err)
      })
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete venue')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Venues</h2>
          <p className="text-gray-600">Review and manage all registered venues</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            disabled={isExporting || loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Export to Excel"
          >
            <MdFileDownload className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Excel'}
          </button>
          <button
            onClick={exportToPDF}
            disabled={isExporting || loading}
            className="px-4 py-2 bg-primary/90 text-white rounded-lg hover:bg-primary transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Export to PDF"
          >
            <MdFileDownload className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'PDF'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {filters.map((filter) => (
          <div key={filter.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{filter.count}</p>
                <p className="text-sm text-gray-600">{filter.label}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${filter.id === 'all' ? 'bg-blue-100' :
                'bg-green-100'
                }`}>
                {filter.id === 'active' ? <MdCheckCircle className="w-5 h-5 text-green-600" /> :
                  <MdLocationOn className="w-5 h-5 text-blue-600" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:primary focus:ring-primary/20 focus:border-primary"
            />
          </div>
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
      </div>

      {/* Venues List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Venues List</h3>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No venues found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVenues.map((venue) => (
              <div key={venue.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <MdLocationOn className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{venue.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>Owner: {venue.ownerName || 'N/A'}</span>
                        <div className="flex items-center gap-1">
                          <MdLocationOn className="w-4 h-4" />
                          {venue.location}
                        </div>
                        {venue.bookings && <span>{venue.bookings} bookings</span>}
                      </div>
                      <div className="flex gap-2 mt-2">
                        {venue.sports?.slice(0, 3).map((sport, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {sport}
                          </span>
                        ))}
                        {venue.sports && venue.sports.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{venue.sports.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(venue.status)}`}>
                        {venue.status || 'INACTIVE'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleView(venue)} className="p-2 text-gray-600 hover:text-primary hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" title="View venue">
                        <MdVisibility className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEdit(venue.id)} className="p-2 text-gray-600 hover:text-primary hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" title="Edit venue">
                        <MdEdit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(venue)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Delete venue">
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
        {!loading && pagination && pagination.total_page > 1 && (
          <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {pagination.total_page} • Showing {venues.length} of {pagination.total_record} venues
            </div>
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(currentPage - 1)
                      }}
                    />
                  </PaginationItem>
                )}

                {/* Page numbers with ellipsis */}
                {Array.from({ length: pagination.total_page }, (_, i) => i + 1).map((page) => {
                  const isVisible =
                    page === 1 ||
                    page === pagination.total_page ||
                    Math.abs(page - currentPage) <= 1

                  if (!isVisible) {
                    return null
                  }

                  if (
                    page > 1 &&
                    page - 1 > 1 &&
                    Math.abs(page - currentPage) > 2
                  ) {
                    return <PaginationItem key={`ellipsis-${page}`}><PaginationEllipsis /></PaginationItem>
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(page)
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                {currentPage < pagination.total_page && (
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(currentPage + 1)
                      }}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <DeleteVenueDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        venueName={selectedVenue?.name}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default VenueManagement
