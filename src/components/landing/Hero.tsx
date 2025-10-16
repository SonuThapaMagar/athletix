import heroImage from '@/assets/landing/hero.svg'
import WaveDivider from '@/components/common/WaveDivider'

type HeroProps = {
  onLogin: () => void
  onSignup: () => void
}

const Hero = ({ onLogin, onSignup }: HeroProps) => {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-sm font-medium text-primary mb-6">
              <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
              For players, venues, and coaches
              <span className="text-primary-60">•</span>
              Book in seconds
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-5xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
              Play more. 
              <span className="text-primary"> Plan less.</span>
              <br />
              <span className="text-gray-700">Book your next game with Athletix.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-8 leading-relaxed">
              Discover venues, compare availability, and reserve instantly. Split costs with friends, pay securely, and focus on the fun.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={onSignup} 
                className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer active:scale-95"
              >
                Get started free
              </button>
              <button 
                onClick={onLogin} 
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300 hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
              >
                I already have an account
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium">Instant booking</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="font-medium">Live availability</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-medium">No hidden fees</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative p-4 sm:p-6 lg:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
              <div className="relative p-4">
                <img 
                  src={heroImage} 
                  alt="Athletix Sports Booking Platform" 
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave Divider */}
      <WaveDivider 
        className="absolute bottom-0 left-0"
        fillColor="#2563eb"
        opacity={0.25}
      />
    </section>
  )
}

export default Hero



