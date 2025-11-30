import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdAttachMoney,
  MdAccessTime,
  MdSportsSoccer
} from 'react-icons/md'

interface VenueFormData {
  name: string
  location: string
  address: string
  price: string
  description: string
  sports: string[]
  amenities: string[]
  operatingHours: {
    day: string
    openTime: string
    closeTime: string
  }[]
  images: string[]
  contact: {
    phone: string
    email: string
  }
}

interface VenueFormErrors {
  name?: string
  location?: string
  address?: string
  price?: string
  description?: string
  sports?: string[]
  amenities?: string[]
  contact?: {
    phone?: string
    email?: string
  }
}

const VenueForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState<VenueFormData>({
    name: '',
    location: '',
    address: '',
    price: '',
    description: '',
    sports: [],
    amenities: [],
    operatingHours: [
      { day: 'Monday', openTime: '06:00', closeTime: '22:00' },
      { day: 'Tuesday', openTime: '06:00', closeTime: '22:00' },
      { day: 'Wednesday', openTime: '06:00', closeTime: '22:00' },
      { day: 'Thursday', openTime: '06:00', closeTime: '22:00' },
      { day: 'Friday', openTime: '06:00', closeTime: '23:00' },
      { day: 'Saturday', openTime: '07:00', closeTime: '23:00' },
      { day: 'Sunday', openTime: '07:00', closeTime: '21:00' }
    ],
    images: [],
    contact: {
      phone: '',
      email: ''
    }
  })

  const [errors, setErrors] = useState<VenueFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableSports = [
    'Football', 'Basketball', 'Tennis', 'Badminton', 'Cricket', 
    'Swimming', 'Volleyball', 'Table Tennis', 'Hockey', 'Baseball'
  ]

  const availableAmenities = [
    'Parking', 'Changing Rooms', 'Equipment Rental', 'Café', 
    'WiFi', 'Air Conditioning', 'Shower Facilities', 'First Aid',
    'Security', 'Pro Shop', 'Coaching Available', 'Floodlights'
  ]

  const handleInputChange = (field: keyof VenueFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (field in errors) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleContactChange = (field: 'phone' | 'email', value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }))
    // Clear error when user starts typing
    if (errors.contact?.[field]) {
      setErrors(prev => ({
        ...prev,
        contact: prev.contact ? { ...prev.contact, [field]: undefined } : undefined
      }))
    }
  }

  const handleSportToggle = (sport: string) => {
    setFormData(prev => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter(s => s !== sport)
        : [...prev.sports, sport]
    }))
  }

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleOperatingHoursChange = (day: string, field: 'openTime' | 'closeTime', value: string) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: prev.operatingHours.map(hour =>
        hour.day === day ? { ...hour, [field]: value } : hour
      )
    }))
  }

  const validateForm = () => {
    const newErrors: VenueFormErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Venue name is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.price.trim()) newErrors.price = 'Price is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (formData.sports.length === 0) newErrors.sports = ['At least one sport is required']
    
    const contactErrors: { phone?: string; email?: string } = {}
    if (!formData.contact.phone.trim()) contactErrors.phone = 'Phone number is required'
    if (!formData.contact.email.trim()) contactErrors.email = 'Email is required'
    
    if (Object.keys(contactErrors).length > 0) {
      newErrors.contact = contactErrors
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In real app, make API call here
      console.log(isEditing ? 'Updating venue:' : 'Creating venue:', formData)
      
      // Navigate back to venue management
      navigate('/venue-owner/venues')
    } catch (error) {
      console.error('Error saving venue:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/venue-owner/venues')
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <MdArrowBack className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Venue' : 'Add New Venue'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update venue information' : 'Create a new sports venue'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MdSportsSoccer className="w-5 h-5 text-[#2c5aa0]" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Venue Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 ${
                      errors.name ? 'border-red-300' : 'border-gray-300 focus:border-[#2c5aa0]'
                    }`}
                    placeholder="Enter venue name"
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 ${
                      errors.location ? 'border-red-300' : 'border-gray-300 focus:border-[#2c5aa0]'
                    }`}
                    placeholder="City, State"
                  />
                  {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 ${
                      errors.address ? 'border-red-300' : 'border-gray-300 focus:border-[#2c5aa0]'
                    }`}
                    placeholder="Street address, City, State, ZIP"
                  />
                  {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Hour *</label>
                  <div className="relative">
                    <MdAttachMoney className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 ${
                        errors.price ? 'border-red-300' : 'border-gray-300 focus:border-[#2c5aa0]'
                      }`}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 ${
                    errors.description ? 'border-red-300' : 'border-gray-300 focus:border-[#2c5aa0]'
                  }`}
                  placeholder="Describe your venue, facilities, and what makes it special..."
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Sports */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Sports *</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableSports.map((sport) => (
                  <label key={sport} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sports.includes(sport)}
                      onChange={() => handleSportToggle(sport)}
                      className="w-4 h-4 text-[#2c5aa0] border-gray-300 rounded focus:ring-[#2c5aa0]"
                    />
                    <span className="text-sm text-gray-700">{sport}</span>
                  </label>
                ))}
              </div>
              {errors.sports && <p className="text-red-600 text-sm mt-2">{errors.sports}</p>}
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableAmenities.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="w-4 h-4 text-[#2c5aa0] border-gray-300 rounded focus:ring-[#2c5aa0]"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MdAccessTime className="w-5 h-5 text-[#2c5aa0]" />
                Operating Hours
              </h2>
              <div className="space-y-3">
                {formData.operatingHours.map((hour) => (
                  <div key={hour.day} className="flex items-center gap-4">
                    <div className="w-20 text-sm font-medium text-gray-700">{hour.day}</div>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={hour.openTime}
                        onChange={(e) => handleOperatingHoursChange(hour.day, 'openTime', e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2c5aa0]"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={hour.closeTime}
                        onChange={(e) => handleOperatingHoursChange(hour.day, 'closeTime', e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2c5aa0]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.contact.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 ${
                      errors.contact?.phone ? 'border-red-300' : 'border-gray-300 focus:border-[#2c5aa0]'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.contact?.phone && <p className="text-red-600 text-sm mt-1">{errors.contact.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 ${
                      errors.contact?.email ? 'border-red-300' : 'border-gray-300 focus:border-[#2c5aa0]'
                    }`}
                    placeholder="venue@example.com"
                  />
                  {errors.contact?.email && <p className="text-red-600 text-sm mt-1">{errors.contact.email}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Form Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-28 z-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2c5aa0] text-white py-3 px-4 rounded-lg hover:bg-[#1e3d6f] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <MdSave className="w-4 h-4" />
                  {isSubmitting ? 'Saving...' : (isEditing ? 'Update Venue' : 'Create Venue')}
                </button>
                
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MdCancel className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>

            {/* Form Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-[520px] z-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Name:</span>
                  <p className="text-gray-900">{formData.name || 'Venue name'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Location:</span>
                  <p className="text-gray-900">{formData.location || 'Location'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Price:</span>
                  <p className="text-gray-900">${formData.price || '0'}/hour</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Sports:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.sports.length > 0 ? (
                      formData.sports.map((sport) => (
                        <span key={sport} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {sport}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-xs">No sports selected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default VenueForm
