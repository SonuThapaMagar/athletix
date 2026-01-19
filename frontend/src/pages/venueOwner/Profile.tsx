import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  MdPerson,
  MdLocationOn,
  MdBusiness,
  MdEdit,
  MdSave,
  MdCameraAlt,
  MdCancel
} from 'react-icons/md'
import { FETCH_PROFILE, UPDATE_PROFILE_ACTION } from '@/redux/actions/user.actions'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import type { StateType } from '@/redux/slices'

const Profile = () => {
  const navigate = useNavigate()
  const { profile } = useSelector((state: StateType) => state.authSlice)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    businessName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bio: ''
  })

  const [originalData, setOriginalData] = useState(formData)

  // Fetch profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!profile) {
        setIsLoading(true)
        try {
          await FETCH_PROFILE()
        } catch (err: any) {
          console.error('Failed to fetch profile:', err)
          toast.error(err?.message || 'Failed to load profile')
        } finally {
          setIsLoading(false)
        }
      }
    }
    loadProfile()
  }, [])

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      const newFormData = {
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        businessName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        bio: ''
      }
      setFormData(newFormData)
      setOriginalData(newFormData)
    }
  }, [profile])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!profile) return

    setIsSaving(true)
    try {
      const updateData: { name?: string; phone?: string; location?: string } = {}
      
      const trimmedName = formData.name.trim()
      const trimmedPhone = formData.phone.trim()
      const trimmedLocation = formData.location.trim()
      
      if (trimmedName !== (profile.name || '')) {
        updateData.name = trimmedName || ''
      }
      if (trimmedPhone !== (profile.phone || '')) {
        updateData.phone = trimmedPhone || ''
      }
      if (trimmedLocation !== (profile.location || '')) {
        updateData.location = trimmedLocation || ''
      }

      if (Object.keys(updateData).length === 0) {
        setIsEditing(false)
        toast.info('No changes to save')
        return
      }

      await UPDATE_PROFILE_ACTION(updateData)
      toast.success('Profile updated successfully')
      setIsEditing(false)
      
      // Redirect to dashboard after successful update
      setTimeout(() => {
        navigate('/venue-owner')
      }, 1000)
    } catch (error: any) {
      console.error('Error saving profile:', error)
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(originalData)
    setIsEditing(false)
  }

  const stats = [
    { label: 'Total Venues', value: '3', icon: MdBusiness },
    { label: 'Total Bookings', value: '1,234', icon: MdPerson },
    { label: 'Member Since', value: 'Jan 2024', icon: MdLocationOn }
  ]

  if (isLoading || !profile) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="lg:col-span-2 h-96 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-4xl">
                    {profile.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 cursor-pointer">
                    <MdCameraAlt className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{formData.name || profile.name}</h3>
              <p className="text-gray-600">{formData.businessName || 'Venue Owner'}</p>
              <div className="mt-4">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Verified
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-[#2c5aa0] rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-[#2c5aa0] border border-[#2c5aa0] rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <MdEdit className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <MdCancel className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#1e3d6f] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <MdSave className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-lg ${
                    isEditing ? 'border-gray-300 focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full p-3 border rounded-lg bg-gray-50 border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-lg ${
                    isEditing ? 'border-gray-300 focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-lg ${
                    isEditing ? 'border-gray-300 focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Address Information</h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-lg ${
                    isEditing ? 'border-gray-300 focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full p-3 border rounded-lg ${
                      isEditing ? 'border-gray-300 focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full p-3 border rounded-lg ${
                      isEditing ? 'border-gray-300 focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full p-3 border rounded-lg ${
                      isEditing ? 'border-gray-300 focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Bio</h3>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!isEditing}
              rows={4}
              className={`w-full p-3 border rounded-lg ${
                isEditing ? 'border-gray-300 focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20' : 'bg-gray-50 border-gray-200'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
