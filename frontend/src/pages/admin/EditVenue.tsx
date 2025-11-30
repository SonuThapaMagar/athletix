import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MdArrowBack, MdSave, MdCancel, MdLocationOn } from 'react-icons/md'

const EditVenue = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [isSaving, setIsSaving] = useState(false)

  // Mock venue data - in real app, fetch based on id
  const [venue, setVenue] = useState({
    name: 'Elite Sports Complex',
    owner: 'John Smith',
    location: 'Downtown District',
    address: '123 Sports Avenue',
    sports: ['Football', 'Basketball', 'Tennis'],
    status: 'approved',
    price: '$50/hour'
  })

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Venue updated:', venue)
    setIsSaving(false)
    navigate('/admin/venues')
  }

  const handleCancel = () => {
    navigate('/admin/venues')
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={handleCancel}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <MdArrowBack className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Venue</h2>
          <p className="text-gray-600">Update venue information and details</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Venue Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue Name *
            </label>
            <input
              type="text"
              value={venue.name}
              onChange={(e) => setVenue({ ...venue, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
              placeholder="Enter venue name"
            />
          </div>

          {/* Owner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner *
            </label>
            <input
              type="text"
              value={venue.owner}
              onChange={(e) => setVenue({ ...venue, owner: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
              placeholder="Enter owner name"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={venue.location}
              onChange={(e) => setVenue({ ...venue, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
              placeholder="Enter location"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={venue.address}
              onChange={(e) => setVenue({ ...venue, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
              placeholder="Enter full address"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              type="text"
              value={venue.price}
              onChange={(e) => setVenue({ ...venue, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
              placeholder="Enter price"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              value={venue.status}
              onChange={(e) => setVenue({ ...venue, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
            >
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Sports */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sports Offered
            </label>
            <div className="flex flex-wrap gap-2">
              {venue.sports.map((sport, index) => (
                <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                  {sport}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2 cursor-pointer"
        >
          <MdCancel className="w-4 h-4" />
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <MdSave className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default EditVenue



