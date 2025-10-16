import { MdSportsSoccer, MdBusinessCenter, MdSchool, MdTrendingUp, MdGroup, MdEvent } from 'react-icons/md'
import DecorativeBackground from '@/components/common/DecorativeBackground'
import WaveDivider from '@/components/common/WaveDivider'

const Features = () => {
  const items = [
    {
      title: 'For Players',
      desc: 'Discover and book sports venues instantly. Split costs with friends, track your game history, and find the perfect match for your skill level.',
      icon: MdSportsSoccer,
      iconColor: 'text-primary',
      bgGradient: 'from-primary/10 to-primary/5',
      hoverGradient: 'from-primary/20 to-primary/10'
    },
    {
      title: 'For Venue Owners',
      desc: 'Maximize your venue utilization with dynamic pricing. Manage bookings effortlessly, track revenue, and build a loyal customer base.',
      icon: MdBusinessCenter,
      iconColor: 'text-primary',
      bgGradient: 'from-primary/10 to-primary/5',
      hoverGradient: 'from-primary/20 to-primary/10'
    },
    {
      title: 'For Coaches',
      desc: 'Expand your coaching business by listing sessions and accepting bookings online. Connect with students and grow your professional network.',
      icon: MdSchool,
      iconColor: 'text-primary',
      bgGradient: 'from-primary/10 to-primary/5',
      hoverGradient: 'from-primary/20 to-primary/10'
    }
  ]

  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 relative bg-gradient-to-b from-primary-10/30 via-primary-10/20 to-white">
      {/* Wave Divider at Top */}
      <WaveDivider 
        className="absolute top-0 left-0 rotate-180"
        fillColor="#2563eb"
        opacity={0.25}
      />
      
      <DecorativeBackground />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Built for <span className="text-primary">Everyone</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a player looking for venues, a venue owner managing bookings, or a coach building your business - we've got you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.title} className="group cursor-pointer">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/30 group-hover:border-white/50 h-full relative overflow-hidden group-hover:-translate-y-2">
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl`}></div>
                
                {/* Floating particles effect */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500"></div>
                <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-secondary/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-700" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/2 right-8 w-1 h-1 bg-accent/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-600" style={{ animationDelay: '1s' }}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Enhanced Icon with glow effect */}
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-3xl bg-gray-100 group-hover:bg-gray-50 transition-all duration-500 flex items-center justify-center relative group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-xl">
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500"></div>
                      <item.icon className={`w-10 h-10 ${item.iconColor} relative z-10 group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                  </div>

                  {/* Title with enhanced hover */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center group-hover:text-primary transition-all duration-300 group-hover:scale-105">
                    {item.title}
                  </h3>

                  {/* Description with slide up effect */}
                  <p className="text-gray-600 leading-relaxed text-center text-sm group-hover:text-gray-700 transition-colors duration-300 transform group-hover:-translate-y-1">
                    {item.desc}
                  </p>

                  {/* Feature highlights */}
                  <div className="mt-6 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      <span>Instant booking</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                      <div className="w-1 h-1 bg-secondary rounded-full"></div>
                      <span>Real-time updates</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced bottom accent line */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full group-hover:w-20 transition-all duration-700"></div>
                
                {/* Corner accent */}
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-primary/30 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-secondary/30 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features



