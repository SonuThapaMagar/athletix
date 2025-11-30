import { MdSportsSoccer, MdSportsCricket, MdSportsTennis, MdSportsBasketball, MdPool, MdSportsVolleyball, MdSportsHockey, MdSportsBaseball, MdTableChart } from 'react-icons/md'
import WaveDivider from '@/components/common/WaveDivider'

const SportsGrid = () => {
  const sports = [
    { 
      name: 'Football', 
      icon: MdSportsSoccer, 
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100',
      textColor: 'text-emerald-700',
      description: 'Soccer fields & turfs'
    },
    { 
      name: 'Cricket', 
      icon: MdSportsCricket, 
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      textColor: 'text-orange-700',
      description: 'Cricket grounds'
    },
    { 
      name: 'Tennis', 
      icon: MdSportsTennis, 
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100',
      textColor: 'text-yellow-700',
      description: 'Tennis courts'
    },
    { 
      name: 'Badminton', 
      icon: MdSportsBaseball, 
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100',
      textColor: 'text-red-700',
      description: 'Badminton courts'
    },
    { 
      name: 'Basketball', 
      icon: MdSportsBasketball, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-700',
      description: 'Basketball courts'
    },
    { 
      name: 'Swimming', 
      icon: MdPool, 
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'from-cyan-50 to-cyan-100',
      textColor: 'text-cyan-700',
      description: 'Swimming pools'
    }
  ]

  const upcomingSports = [
    { name: 'Volleyball', icon: MdSportsVolleyball, color: 'from-purple-400 to-purple-500' },
    { name: 'Table Tennis', icon: MdTableChart, color: 'from-pink-400 to-pink-500' },
    { name: 'Hockey', icon: MdSportsHockey, color: 'from-indigo-400 to-indigo-500' }
  ]
  
  return (
    <section id="sports" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50/50 to-gray-50 relative overflow-hidden">
      {/* Wave Divider at Top */}
      <WaveDivider 
        className="absolute top-0 left-0 rotate-180"
        fillColor="#2563eb"
        opacity={0.15}
      />

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-accent/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Book Across <span className="text-primary">Sports</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            From courts to turfs, studios to pools - find the perfect venue for your favorite sport with our comprehensive booking platform.
          </p>
        </div>
        
        {/* Main Sports Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {sports.map((sport, index) => (
            <div key={sport.name} className="group cursor-pointer" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 border border-white/50 group-hover:border-white/80 h-full relative overflow-hidden group-hover:-translate-y-3">
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${sport.bgColor} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl`}></div>
                
                {/* Floating particles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500"></div>
                <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-secondary/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-700" style={{ animationDelay: '0.5s' }}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Enhanced Icon */}
                  <div className="flex justify-center mb-6">
                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${sport.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 flex items-center justify-center relative shadow-lg group-hover:shadow-2xl`}>
                      {/* Glow effect */}
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${sport.color} opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-500`}></div>
                      <sport.icon className="w-10 h-10 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl font-bold ${sport.textColor} mb-2 group-hover:text-primary transition-colors duration-300 group-hover:scale-105`}>
                    {sport.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300 transform group-hover:-translate-y-1">
                    {sport.description}
                  </p>

                  {/* Hover features */}
                  <div className="mt-4 space-y-1 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      <span>Available now</span>
                    </div>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full group-hover:w-20 transition-all duration-700"></div>
                
                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-primary/30 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-secondary/30 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Coming Soon Section */}
        <div className="text-center">
          <div className="inline-block">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              More Sports <span className="text-primary">Coming Soon</span>
            </h3>
            
            <div className="flex justify-center items-center gap-6 flex-wrap">
              {upcomingSports.map((sport, index) => (
                <div key={sport.name} className="group cursor-pointer" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-500 flex items-center justify-center relative group-hover:scale-110 group-hover:rotate-3">
                    {sport.icon && <sport.icon className={`w-8 h-8 text-gray-400 group-hover:text-primary transition-colors duration-300`} />}
                    
                    {/* Pulse effect for coming soon */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 group-hover:text-primary transition-colors duration-300">
                    {sport.name}
                  </p>
                </div>
              ))}
              
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">+</span>
                </div>
                <span className="text-sm">More</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SportsGrid



