import { MdSportsSoccer, MdBusinessCenter, MdSchool } from 'react-icons/md'
import DecorativeBackground from '@/components/common/DecorativeBackground'
import WaveDivider from '@/components/common/WaveDivider'

const Features = () => {
  const items = [
    {
      title: 'For Players',
      desc: 'Discover and book sports venues instantly. Split costs with friends, track your game history, and find the perfect match for your skill level.',
      icon: MdSportsSoccer,
      gradient: 'from-[#00425b] to-[#006885]',
      bgGradient: 'from-[#00425b]/10 via-[#00425b]/5 to-transparent',
      hoverGradient: 'from-[#00425b]/20 via-[#00B44E]/10 to-transparent',
      features: ['Instant booking', 'Cost splitting', 'Game history']
    },
    {
      title: 'For Venue Owners',
      desc: 'Maximize your venue utilization with dynamic pricing. Manage bookings effortlessly, track revenue, and build a loyal customer base.',
      icon: MdBusinessCenter,
      gradient: 'from-[#00B44E] to-[#00903e]',
      bgGradient: 'from-[#00B44E]/10 via-[#00B44E]/5 to-transparent',
      hoverGradient: 'from-[#00B44E]/20 via-[#00425b]/10 to-transparent',
      features: ['Dynamic pricing', 'Revenue tracking', 'Customer management']
    },
    {
      title: 'For Coaches',
      desc: 'Expand your coaching business by listing sessions and accepting bookings online. Connect with students and grow your professional network.',
      icon: MdSchool,
      gradient: 'from-[#006885] to-[#00425b]',
      bgGradient: 'from-[#006885]/10 via-[#00B44E]/5 to-transparent',
      hoverGradient: 'from-[#006885]/20 via-[#00B44E]/10 to-transparent',
      features: ['Session listings', 'Online bookings', 'Network growth']
    }
  ]

  return (
    <section id="features" className="py-20 sm:py-24 lg:py-32 relative bg-gradient-to-b from-white via-[#00425b]/5 to-white">
      {/* Wave Divider at Top */}
      <WaveDivider 
        className="absolute top-0 left-0 rotate-180"
        fillColor="#00425b"
        opacity={0.12}
      />
      
      <DecorativeBackground />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-[#00B44E] uppercase tracking-wider bg-[#00B44E]/10 px-4 py-2 rounded-full">
              Features
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Built for <span className="bg-gradient-to-r from-[#00425b] to-[#00B44E] bg-clip-text text-transparent">Everyone</span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Whether you're a player looking for venues, a venue owner managing bookings, or a coach building your business - we've got you covered.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {items.map((item, index) => (
            <div 
              key={item.title} 
              className="group cursor-pointer transform transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-[#00425b]/20 h-full relative overflow-hidden">
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl`}></div>
                
                {/* Decorative corner elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00425b]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#00B44E]/5 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="flex justify-center mb-8">
                    <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${item.gradient} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 flex items-center justify-center relative shadow-xl group-hover:shadow-2xl`}>
                      {/* Glow effect */}
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500`}></div>
                      <item.icon className="w-12 h-12 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-[#00425b] transition-all duration-300">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed text-center mb-6 group-hover:text-gray-700 transition-colors duration-300">
                    {item.desc}
                  </p>

                  {/* Feature highlights */}
                  <div className="space-y-3 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    {item.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-[#00425b] to-[#00B44E] rounded-full"></div>
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1.5 bg-gradient-to-r from-[#00425b] via-[#00B44E] to-[#00425b] rounded-full group-hover:w-24 transition-all duration-700"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
