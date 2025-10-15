import { useState } from 'react'
import { MdVisibility, MdVisibilityOff, MdLocationOn, MdPhone, MdEmail, MdPerson } from 'react-icons/md'

type AuthFormProps = {
  mode: 'login' | 'signup'
  onSubmit: (data: any) => void
  loading?: boolean
}

type FormData = {
  fullName?: string
  email: string
  contact?: string
  password: string
  location?: string
}

const AuthForm = ({ mode, onSubmit, loading = false }: AuthFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    contact: '',
    password: '',
    location: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [newsletter, setNewsletter] = useState(true)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/
  const phoneRegex = /^\+?[0-9]{7,14}$/

  const validate = () => {
    const newErrors: Partial<FormData> = {}
    
    if (mode === 'signup') {
      if (!formData.fullName?.trim()) newErrors.fullName = 'Full name is required'
      if (!formData.contact?.trim()) newErrors.contact = 'Contact number is required'
      if (!phoneRegex.test(formData.contact || '')) newErrors.contact = 'Enter a valid contact number'
      if (!formData.location?.trim()) newErrors.location = 'Location is required'
    }
    
    if (!emailRegex.test(formData.email)) newErrors.email = 'Enter a valid email address'
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Form Title */}
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800">
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {mode === 'login' ? 'Welcome back to Athletix' : 'Join Athletix today'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Full Name - Only for Signup */}
      {mode === 'signup' && (
        <div>
          <div className="relative">
            <input
              type="text"
              id="full-name"
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:border-[#2c5aa0]"
              value={formData.fullName || ''}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              required
            />
            <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
        </div>
      )}

      {/* Email Field */}
      <div>
        <div className="relative">
          <input
            type="email"
            id="email"
            placeholder="Email Address"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:border-[#2c5aa0]"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
          <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
      </div>

      {/* Contact - Only for Signup */}
      {mode === 'signup' && (
        <div>
          <div className="relative">
            <input
              type="tel"
              id="contact"
              placeholder="Contact Number"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:border-[#2c5aa0]"
              value={formData.contact || ''}
              onChange={(e) => handleInputChange('contact', e.target.value)}
              required
            />
            <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          {errors.contact && <p className="text-xs text-red-600 mt-1">{errors.contact}</p>}
        </div>
      )}

      {/* Password Field */}
      <div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-[#2c5aa0]"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            required
          />
          <MdVisibility className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <MdVisibilityOff className="w-5 h-5" /> : <MdVisibility className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
      </div>

      {/* Location - Only for Signup */}
      {mode === 'signup' && (
        <div>
          <div className="relative">
            <input
              type="text"
              id="location"
              placeholder="Your Location (City, State)"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:border-[#2c5aa0]"
              value={formData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              required
            />
            <MdLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
        </div>
      )}

      {/* Newsletter Checkbox - Only for Signup */}
      {mode === 'signup' && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="newsletter"
            checked={newsletter}
            onChange={(e) => setNewsletter(e.target.checked)}
            className="w-4 h-4 accent-[#2c5aa0] cursor-pointer"
          />
          <label htmlFor="newsletter" className="text-sm text-gray-600 cursor-pointer">
            Subscribe to our newsletter for sports updates and booking notifications
          </label>
        </div>
      )}

      {/* Forgot Password - Only for Login */}
      {mode === 'login' && (
        <div className="flex justify-end">
          <button type="button" className="text-[#2c5aa0] text-sm font-semibold hover:underline">
            Forgot Password?
          </button>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#2c5aa0] text-white py-3 px-4 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-[#1e3d6f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (mode === 'login' ? 'Signing In...' : 'Signing Up...') : (mode === 'login' ? 'SIGN IN' : 'SIGN UP')}
      </button>

      {/* Divider and Social Login - Only for Signup */}
      {mode === 'signup' && (
        <>
          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative inline-block bg-white px-3 text-xs text-gray-500">
              or sign up with:
            </div>
          </div>
        </>
      )}
      </form>
    </div>
  )
}

export default AuthForm
