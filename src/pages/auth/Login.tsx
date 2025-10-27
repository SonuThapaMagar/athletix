import { useState } from 'react'
import PromoContent from '@/components/auth/PromoContent'
import AuthForm from '@/components/common/AuthForm'
import SportsAnimations from '@/components/common/SportsAnimations'

type LoginProps = {
  onSwitchToSignup?: () => void
}

const Login = ({ onSwitchToSignup }: LoginProps) => {
  const [loading, setLoading] = useState(false)

  const handleLogin = async (data: any) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    alert(`Logged in as ${data.email}`)
  }

  return (
    <div className="min-h-dvh flex relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Sports-themed animated background */}
      <SportsAnimations variant="login" />

      <div className="flex flex-col lg:flex-row w-full gap-8 px-4 py-8 relative z-10">
        {/* Left Marketing Section - Direct on background */}
        <div className="lg:w-3/5 flex items-center justify-center">
          <div className="max-w-lg">
            <PromoContent />
          </div>
        </div>
        {/* Right Form Section - Card */}
        <div className="lg:w-2/5 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg border w-full max-w-md p-6 sm:p-8">
            <AuthForm mode="login" onSubmit={handleLogin} loading={loading} />
            <div className="text-center text-gray-600 text-sm mt-4">
              Don&apos;t have an account?{' '}
              <button type="button" className="text-[#2c5aa0] cursor-pointer font-semibold hover:underline" onClick={onSwitchToSignup}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
