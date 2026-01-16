import { MdSportsSoccer, MdSportsCricket, MdSportsTennis, MdSportsBasketball, MdPool, MdSportsVolleyball, MdSportsHockey, MdSportsBaseball, MdTableChart } from 'react-icons/md'
import WaveDivider from '@/components/common/WaveDivider'

const SportsGrid = () => {
  const sports = [
    { 
      name: 'Football', 
      icon: MdSportsSoccer, 
      gradient: 'from-[#00B44E] to-[#00903e]',
      bgGradient: 'from-[#00B44E]/10 to-[#00B44E]/5',
      textColor: 'text-[#00B44E]',
      description: 'Soccer fields & turfs'
    },
    { 
      name: 'Cricket', 
      icon: MdSportsCricket, 
      gradient: 'from-[#00425b] to-[#006885]',
      bgGradient: 'from-[#00425b]/10 to-[#00425b]/5',
      textColor: 'text-[#00425b]',
      description: 'Cricket grounds'
    },
    { 
      name: 'Tennis', 
      icon: MdSportsTennis, 
      gradient: 'from-[#006885] to-[#00425b]',
      bgGradient: 'from-[#006885]/10 to-[#006885]/5',
      textColor: 'text-[#006885]',
      description: 'Tennis courts'
    },
    { 
      name: 'Badminton', 
      icon: MdSportsBaseball, 
      gradient: 'from-[#00B44E] to-[#006885]',
      bgGradient: 'from-[#00B44E]/10 to-[#00B44E]/5',
      textColor: 'text-[#00B44E]',
      description: 'Badminton courts'
    },
    { 
      name: 'Basketball', 
      icon: MdSportsBasketball, 
      gradient: 'from-[#00425b] to-[#00B44E]',
      bgGradient: 'from-[#00425b]/10 to-[#00425b]/5',
      textColor: 'text-[#00425b]',
      description: 'Basketball courts'
    },
    { 
      name: 'Swimming', 
      icon: MdPool, 
      gradient: 'from-[#006885] to-[#00B44E]',
      bgGradient: 'from-[#006885]/10 to-[#006885]/5',
      textColor: 'text-[#006885]',
      description: 'Swimming pools'
    }
  ]

  const upcomingSports = [
    { name: 'Volleyball', icon: MdSportsVolleyball, gradient: 'from-[#00425b] to-[#006885]' },
    { name: 'Table Tennis', icon: MdTableChart, gradient: 'from-[#00B44E] to-[#00903e]' },
    { name: 'Hockey', icon: MdSportsHockey, gradient: 'from-[#006885] to-[#00425b]' }
  ]
  
  return (
    <section id="sports" className="py-20 sm:py-24 lg:py-32 bg-gradient-to-b from-white via-[#00425b]/5 to-white relative overflow-hidden">
      {/* Wave Divider at Top */}
      <WaveDivider 
        className="absolute top-0 left-0 rotate-180"
        fillColor="#00425b"
        opacity={0.12}
      />

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#00425b]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-[#00B44E]/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-[#006885]/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-[#00B44E] uppercase tracking-wider bg-[#00B44E]/10 px-4 py-2 rounded-full">
              Sports
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Book Across <span className="bg-gradient-to-r from-[#00425b] to-[#00B44E] bg-clip-text text-transparent">Sports</span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From courts to turfs, studios to pools - find the perfect venue for your favorite sport with our comprehensive booking platform.
          </p>
        </div>
        
        {/* Main Sports Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {sports.map((sport, index) => (
            <div key={sport.name} className="group cursor-pointer transform transition-all duration-500 hover:-translate-y-3">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-[#00425b]/20 h-full relative overflow-hidden">
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${sport.bgGradient} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl`}></div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-br from-[#00425b]/20 to-[#00B44E]/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500"></div>
                <div className="absolute bottom-6 left-6 w-2 h-2 bg-gradient-to-br from-[#00B44E]/20 to-[#00425b]/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-700" style={{ animationDelay: '0.5s' }}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${sport.gradient} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 flex items-center justify-center relative shadow-xl group-hover:shadow-2xl`}>
                      {/* Glow effect */}
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${sport.gradient} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500`}></div>
                      <sport.icon className="w-12 h-12 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`text-2xl font-bold ${sport.textColor} mb-3 group-hover:text-[#00425b] transition-colors duration-300`}>
                    {sport.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-base group-hover:text-gray-700 transition-colors duration-300 mb-4">
                    {sport.description}
                  </p>

                  {/* Hover indicator */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-[#00425b] to-[#00B44E] rounded-full animate-pulse"></div>
                      <span className="font-semibold">Available now</span>
                    </div>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1.5 bg-gradient-to-r from-[#00425b] via-[#00B44E] to-[#00425b] rounded-full group-hover:w-24 transition-all duration-700"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Coming Soon Section */}
        <div className="text-center">
          <div className="inline-block">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              More Sports <span className="bg-gradient-to-r from-[#00425b] to-[#00B44E] bg-clip-text text-transparent">Coming Soon</span>
            </h3>
            
            <div className="flex justify-center items-center gap-8 flex-wrap">
              {upcomingSports.map((sport, index) => (
                <div key={sport.name} className="group cursor-pointer transform transition-all duration-300 hover:scale-110">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${sport.gradient} group-hover:shadow-xl transition-all duration-500 flex items-center justify-center relative`}>
                    {sport.icon && <sport.icon className="w-10 h-10 text-white transition-transform duration-300 group-hover:rotate-12" />}
                    
                    {/* Pulse effect for coming soon */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00B44E] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mt-3 group-hover:text-[#00425b] transition-colors duration-300">
                    {sport.name}
                  </p>
                </div>
              ))}
              
              <div className="flex items-center gap-3 text-gray-400 group cursor-pointer hover:text-[#00425b] transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00425b]/20 to-[#00B44E]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-[#00425b]">+</span>
                </div>
                <span className="text-base font-semibold">More</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SportsGrid
