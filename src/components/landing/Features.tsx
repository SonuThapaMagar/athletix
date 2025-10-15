import { MdPeople, MdBusiness, MdSports } from 'react-icons/md'

const Features = () => {
  const items = [
    {
      title: 'For Players',
      desc: 'Find nearby venues, split payments with friends, and track your matches.',
      icon: MdPeople,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'For Venue Owners',
      desc: 'Fill empty slots with dynamic pricing and manage bookings with ease.',
      icon: MdBusiness,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'For Coaches',
      desc: 'List coaching sessions, accept bookings, and grow your clientele.',
      icon: MdSports,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ]
  
  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Built for Everyone
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a player looking for venues, a venue owner managing bookings, or a coach building your business - we've got you covered.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.title} className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-gray-200 h-full">
                <div className={`w-16 h-16 ${item.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`w-8 h-8 ${item.iconColor}`} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
                
                <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features



