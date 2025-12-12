import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MdSearch,
  MdEdit,
  MdDelete,
  MdLocationOn,
  MdCheckCircle,
  MdCancel,
  MdPending,
  MdVisibility
} from 'react-icons/md'
import ViewVenueDialog from '@/components/admin/ViewVenueDialog'
import DeleteVenueDialog from '@/components/venueOwner/DeleteVenueDialog'

const VenueManagement = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filters = [
    { id: 'all', label: 'All Venues', count: 45 },
    { id: 'approved', label: 'Approved', count: 38 },
    { id: 'pending', label: 'Pending Review', count: 5 },
    { id: 'rejected', label: 'Rejected', count: 2 }
  ]

  const venues = [
    {
      id: 1,
      name: 'Elite Sports Complex',
      owner: 'John Smith',
      location: 'Downtown District',
      sports: ['Football', 'Basketball', 'Tennis'],
      status: 'approved',
      createdAt: '2024-11-15',
      bookings: 456,
      rating: 4.8
    },
  ]

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

  const handleView = (venue: any) => {
    setSelectedVenue(venue)
    setViewDialogOpen(true)
  }

  const handleEdit = (venueId: number) => {
    navigate(`/admin/venues/edit/${venueId}`)
  }

  const handleDelete = (venue: any) => {
    setSelectedVenue(venue)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    setIsDeleting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Venue deleted:', selectedVenue)
    setIsDeleting(false)
    setDeleteDialogOpen(false)
    setSelectedVenue(null)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Venues</h2>
        <p className="text-gray-600">Review and manage all registered venues</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {filters.map((filter) => (
          <div key={filter.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{filter.count}</p>
                <p className="text-sm text-gray-600">{filter.label}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                filter.id === 'all' ? 'bg-blue-100' :
                filter.id === 'approved' ? 'bg-green-100' :
                filter.id === 'pending' ? 'bg-yellow-100' :
                'bg-red-100'
              }`}>
                {filter.id === 'approved' ? <MdCheckCircle className="w-5 h-5 text-green-600" /> :
                 filter.id === 'pending' ? <MdPending className="w-5 h-5 text-yellow-600" /> :
                 filter.id === 'rejected' ? <MdCancel className="w-5 h-5 text-red-600" /> :
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
            />
          </div>
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      selectedFilter === filter.id
                        ? 'bg-indigo-600 text-white'
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
        
        <div className="space-y-4">
          {venues.map((venue) => (
            <div key={venue.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <MdLocationOn className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{venue.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span>Owner: {venue.owner}</span>
                      <div className="flex items-center gap-1">
                        <MdLocationOn className="w-4 h-4" />
                        {venue.location}
                      </div>
                      <span>{venue.bookings} bookings</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {venue.sports.map((sport, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {sport}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${getStatusColor(venue.status)}`}>
                      {venue.status}
                    </span>
                  </div>
                                     <div className="flex gap-2">
                     <button onClick={() => handleView(venue)} className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" title="View venue">
                       <MdVisibility className="w-4 h-4" />
                     </button>
                     <button onClick={() => handleEdit(venue.id)} className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" title="Edit venue">
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
       </div>

       {/* View Dialog */}
       <ViewVenueDialog
         open={viewDialogOpen}
         onOpenChange={setViewDialogOpen}
         venue={selectedVenue}
       />

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
