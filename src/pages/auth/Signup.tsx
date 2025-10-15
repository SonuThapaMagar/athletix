import { useState } from 'react'
import PromoContent from '@/components/auth/PromoContent'
import AuthForm from '@/components/common/AuthForm'

type SignupProps = {
  onSwitchToLogin?: () => void
}

const Signup = ({ onSwitchToLogin }: SignupProps) => {
  const [loading, setLoading] = useState(false)

  const handleSignup = async (data: any) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    alert(`Welcome ${data.fullName}! Signed up successfully for Athletix`)
  }

  return (
    <div className="min-h-dvh flex bg-gray-50">
      <div className="flex flex-col lg:flex-row w-full gap-8 px-4 py-8">
        {/* Left Marketing Section - Direct on background */}
        <div className="lg:w-3/5 flex items-center justify-center">
          <div className="max-w-lg">
            <PromoContent />
          </div>
        </div>
        {/* Right Form Section - Card */}
        <div className="lg:w-2/5 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg border w-full max-w-md p-6 sm:p-8">
            <AuthForm mode="signup" onSubmit={handleSignup} loading={loading} />
            <div className="text-center text-gray-600 text-sm mt-4">
              Already have an account?{' '}
              <button type="button" className="text-[#2c5aa0] cursor-pointer font-semibold hover:underline" onClick={onSwitchToLogin}>Sign In</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
