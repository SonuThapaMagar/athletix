import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { 
  MdArrowBack,
  MdEdit, 
  MdSave,
  MdCancel,
  MdEmail, 
  MdPhone, 
  MdLocationOn, 
  MdSportsSoccer,
  MdStar,
  MdEmojiEvents,
  MdHistory,
  MdErrorOutline
} from 'react-icons/md'
import PlayerNavLayout from '@/layout/PlayerNavLayout'
import { FETCH_PROFILE, UPDATE_PROFILE_ACTION } from '@/redux/actions/user.actions'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import type { StateType } from '@/redux/slices'

interface ProfileFormData {
  name: string
  phone: string
  location: string
  bio: string
}

interface ValidationErrors {
  name?: string
  phone?: string
  location?: string
  bio?: string
}

const Profile = () => {
  const navigate = useNavigate()
  const { profile } = useSelector((state: StateType) => state.authSlice)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    phone: '',
    location: '',
    bio: ''
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return undefined // Optional field
    if (name.trim().length < 2) return 'Name must be at least 2 characters'
    if (name.trim().length > 50) return 'Name must be less than 50 characters'
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) return 'Name can only contain letters, spaces, hyphens, and apostrophes'
    return undefined
  }

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) return undefined // Optional field
    // Remove spaces, dashes, and parentheses for validation
    const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '')
    // Allow formats: +1234567890, 1234567890, (123) 456-7890, etc.
    if (!/^[\+]?[0-9]{7,15}$/.test(cleanedPhone)) {
      return 'Please enter a valid phone number (7-15 digits)'
    }
    return undefined
  }

  const validateLocation = (location: string): string | undefined => {
    if (!location.trim()) return undefined // Optional field
    if (location.trim().length < 2) return 'Location must be at least 2 characters'
    if (location.trim().length > 100) return 'Location must be less than 100 characters'
    return undefined
  }

  const validateBio = (bio: string): string | undefined => {
    if (!bio.trim()) return undefined // Optional field
    if (bio.trim().length < 10) return 'Bio must be at least 10 characters'
    if (bio.trim().length > 500) return 'Bio must be less than 500 characters'
    return undefined
  }

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}
    
    if (touched.name || formData.name) {
      const nameError = validateName(formData.name)
      if (nameError) newErrors.name = nameError
    }
    
    if (touched.phone || formData.phone) {
      const phoneError = validatePhone(formData.phone)
      if (phoneError) newErrors.phone = phoneError
    }
    
    if (touched.location || formData.location) {
      const locationError = validateLocation(formData.location)
      if (locationError) newErrors.location = locationError
    }
    
    if (touched.bio || formData.bio) {
      const bioError = validateBio(formData.bio)
      if (bioError) newErrors.bio = bioError
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

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
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: '' // Bio might not be in IUserProfile, keeping for future
      })
      setErrors({})
      setTouched({})
    }
  }, [profile])

  // Validate on form data change
  useEffect(() => {
    if (isEditing) {
      validateForm()
    }
  }, [formData, touched, isEditing])

  const handleEdit = () => {
    setIsEditing(true)
    setTouched({})
    setErrors({})
  }

  const handleSave = async () => {
    if (!profile) return

    // Mark all fields as touched to show validation errors
    setTouched({
      name: true,
      phone: true,
      location: true,
      bio: true
    })

    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the validation errors before saving')
      return
    }

    setIsSaving(true)
    try {
      const updateData: { name?: string; phone?: string; location?: string } = {}
      
      // Only include fields that have changed and are valid
      const trimmedName = formData.name.trim()
      const trimmedPhone = formData.phone.trim()
      const trimmedLocation = formData.location.trim()
      
      // Name: send if changed or if clearing (empty string)
      if (trimmedName !== (profile.name || '')) {
        if (trimmedName) {
          updateData.name = trimmedName
        } else {
          // Allow clearing name if it was previously set
          updateData.name = ''
        }
      }
      
      // Phone: send if changed or if clearing
      if (trimmedPhone !== (profile.phone || '')) {
        if (trimmedPhone) {
          updateData.phone = trimmedPhone
        } else {
          updateData.phone = ''
        }
      }
      
      // Location: send if changed or if clearing
      if (trimmedLocation !== (profile.location || '')) {
        if (trimmedLocation) {
          updateData.location = trimmedLocation
        } else {
          updateData.location = ''
        }
      }

      // Only make API call if there are changes
      if (Object.keys(updateData).length === 0) {
        setIsEditing(false)
        toast.info('No changes to save')
        return
      }

      await UPDATE_PROFILE_ACTION(updateData)
      toast.success('Profile updated successfully')
      setIsEditing(false)
      setTouched({})
      setErrors({})
    } catch (err: any) {
      console.error('Failed to update profile:', err)
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: ''
      })
    }
    setIsEditing(false)
    setTouched({})
    setErrors({})
  }

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Mark field as touched when user starts typing
    if (!touched[field]) {
      setTouched(prev => ({ ...prev, [field]: true }))
    }
  }

  const handleBlur = (field: keyof ProfileFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    validateForm()
  }

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PlayerNavLayout />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Skeleton className="h-32 w-full mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="lg:col-span-2 h-64" />
          </div>
        </div>
      </div>
    )
  }

  const currentProfile = profile
  const hasErrors = Object.keys(errors).length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <PlayerNavLayout />
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-[#2c5aa0] transition-colors"
            >
              <MdArrowBack className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Header Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f] rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl sm:text-2xl">
                  {currentProfile.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              {isEditing ? (
                <div className="w-full">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    className={`text-xl sm:text-2xl font-bold text-gray-900 mb-1 w-full sm:w-auto p-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.name 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-300 focus:border-[#2c5aa0] focus:ring-[#2c5aa0]/20'
                    }`}
                    placeholder="Your name"
                  />
                  {errors.name && touched.name && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <MdErrorOutline className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>
              ) : (
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  {currentProfile.name || 'No name set'}
                </h2>
              )}
              <p className="text-gray-600 mb-3 flex items-center justify-center sm:justify-start gap-1">
                <MdLocationOn className="w-4 h-4" />
                {isEditing ? (
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      onBlur={() => handleBlur('location')}
                      className={`flex-1 p-1 border rounded focus:outline-none focus:ring-2 transition-colors text-sm ${
                        errors.location 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-gray-300 focus:border-[#2c5aa0] focus:ring-[#2c5aa0]/20'
                      }`}
                      placeholder="Location (optional)"
                    />
                    {errors.location && touched.location && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <MdErrorOutline className="w-3 h-3" />
                        {errors.location}
                      </p>
                    )}
                  </div>
                ) : (
                  <span>{currentProfile.location || 'No location set'}</span>
                )}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MdEmail className="w-4 h-4" />
                  {currentProfile.email}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <div className="w-full sm:w-auto">
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving || hasErrors}
                    className="flex-1 sm:flex-none bg-[#2c5aa0] text-white py-2 px-4 rounded-xl hover:bg-[#1e3d6f] transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MdSave className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none border border-gray-300 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
                  >
                    <MdCancel className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEdit}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#2c5aa0] to-[#1e3d6f] text-white py-2 px-6 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <MdEdit className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Bio & Contact */}
          <div className="lg:col-span-1 space-y-6">
            {/* Bio Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#2c5aa0] rounded-full"></div>
                About
              </h3>
              {isEditing ? (
                <div>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    onBlur={() => handleBlur('bio')}
                    className={`w-full p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 resize-none transition-colors ${
                      errors.bio 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-300 focus:border-[#2c5aa0] focus:ring-[#2c5aa0]/20'
                    }`}
                    rows={4}
                    placeholder="Tell us about yourself... (optional)"
                  />
                  {errors.bio && touched.bio && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <MdErrorOutline className="w-3 h-3" />
                      {errors.bio}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {formData.bio || 'No bio added yet. Click Edit Profile to add one.'}
                </p>
              )}
            </div>

            {/* Contact Info Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Contact Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MdEmail className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">{currentProfile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <MdPhone className="w-4 h-4 text-green-600" />
                  </div>
                  {isEditing ? (
                    <div className="flex-1">
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        onBlur={() => handleBlur('phone')}
                        className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm ${
                          errors.phone 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                            : 'border-gray-300 focus:border-[#2c5aa0] focus:ring-[#2c5aa0]/20'
                        }`}
                        placeholder="Phone (optional)"
                      />
                      {errors.phone && touched.phone && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <MdErrorOutline className="w-3 h-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-700">{currentProfile.phone || 'No phone number'}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MdLocationOn className="w-4 h-4 text-purple-600" />
                  </div>
                  {isEditing ? (
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        onBlur={() => handleBlur('location')}
                        className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm ${
                          errors.location 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                            : 'border-gray-300 focus:border-[#2c5aa0] focus:ring-[#2c5aa0]/20'
                        }`}
                        placeholder="Location (optional)"
                      />
                      {errors.location && touched.location && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <MdErrorOutline className="w-3 h-3" />
                          {errors.location}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-700">{currentProfile.location || 'No location set'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f] rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MdSportsSoccer className="w-6 h-6 text-white" />
                </div>
                <div className="text-xl font-bold text-gray-900">-</div>
                <div className="text-xs text-gray-600">Games Played</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MdEmojiEvents className="w-6 h-6 text-white" />
                </div>
                <div className="text-xl font-bold text-gray-900">-</div>
                <div className="text-xs text-gray-600">Games Won</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MdStar className="w-6 h-6 text-white" />
                </div>
                <div className="text-xl font-bold text-gray-900">-</div>
                <div className="text-xs text-gray-600">Win Rate</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MdHistory className="w-6 h-6 text-white" />
                </div>
                <div className="text-xl font-bold text-gray-900">-</div>
                <div className="text-xs text-gray-600">Total Hours</div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Account Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">User ID</span>
                  <span className="text-sm font-medium text-gray-900">{currentProfile.userId}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Role</span>
                  <span className="text-sm font-medium text-gray-900">{currentProfile.role || 'PLAYER'}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="text-sm font-medium text-gray-900">{currentProfile.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
