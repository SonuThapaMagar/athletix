import heroImage from '@/assets/landing/hero.svg'
import WaveDivider from '@/components/common/WaveDivider'

type HeroProps = {
  onLogin: () => void
  onSignup: () => void
}

const Hero = ({ onLogin, onSignup }: HeroProps) => {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-[#00425b]/5 via-white to-[#00B44E]/5">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00425b]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00B44E]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00425b]/10 to-[#00B44E]/10 border border-[#00425b]/20 px-5 py-2.5 text-sm font-semibold text-[#00425b] mb-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <span className="inline-block h-2 w-2 rounded-full bg-[#00B44E] animate-pulse" />
              <span>For players, venues, and coaches</span>
              <span className="text-[#00425b]/60">•</span>
              <span className="text-[#00B44E] font-bold">Book in seconds</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-tight">
              Play more.{' '}
              <span className="bg-gradient-to-r from-[#00425b] to-[#00B44E] bg-clip-text text-transparent">
                Plan less.
              </span>
              <br />
              <span className="text-gray-700 text-4xl sm:text-5xl lg:text-6xl">Book your next game with Athletix.</span>
            </h1>
            
            {/* Description */}
            <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
              Discover venues, compare availability, and reserve instantly. Split costs with friends, pay securely, and focus on the fun.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button 
                onClick={onSignup} 
                className="group px-10 py-5 bg-gradient-to-r from-[#00425b] to-[#006885] text-white font-bold rounded-2xl hover:from-[#006885] hover:to-[#00425b] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 cursor-pointer active:scale-95 text-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  Get started free
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button 
                onClick={onLogin} 
                className="px-10 py-5 border-2 border-[#00425b]/30 text-[#00425b] font-bold rounded-2xl hover:border-[#00425b] hover:bg-[#00425b]/5 transition-all duration-300 hover:shadow-lg cursor-pointer transform hover:-translate-y-1 active:scale-95 text-lg"
              >
                I already have an account
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2.5">
                <div className="h-3 w-3 rounded-full bg-[#00B44E] animate-pulse shadow-lg shadow-[#00B44E]/50" />
                <span className="font-semibold text-gray-700">Instant booking</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-3 w-3 rounded-full bg-[#00425b] animate-pulse shadow-lg shadow-[#00425b]/50" />
                <span className="font-semibold text-gray-700">Live availability</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-3 w-3 rounded-full bg-[#00B44E] animate-pulse shadow-lg shadow-[#00B44E]/50" />
                <span className="font-semibold text-gray-700">No hidden fees</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="relative p-6 sm:p-8 lg:p-10">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00425b]/20 via-[#00B44E]/20 to-[#00425b]/20 rounded-3xl blur-3xl animate-pulse"></div>
              {/* Image container */}
              <div className="relative p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50">
                <img 
                  src={heroImage} 
                  alt="Athletix Sports Booking Platform" 
                  className="w-full h-auto rounded-2xl"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#00B44E]/20 to-[#00425b]/20 rounded-2xl blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-[#00425b]/20 to-[#00B44E]/20 rounded-2xl blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave Divider */}
      <WaveDivider 
        className="absolute bottom-0 left-0"
        fillColor="#00425b"
        opacity={0.15}
      />
    </section>
  )
}

export default Hero
