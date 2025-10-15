const SportsGrid = () => {
  const sports = [
    { name: 'Football', emoji: '⚽', color: 'from-green-500 to-green-600' },
    { name: 'Cricket', emoji: '🏏', color: 'from-orange-500 to-orange-600' },
    { name: 'Tennis', emoji: '🎾', color: 'from-yellow-500 to-yellow-600' },
    { name: 'Badminton', emoji: '🏸', color: 'from-red-500 to-red-600' },
    { name: 'Basketball', emoji: '🏀', color: 'from-blue-500 to-blue-600' },
    { name: 'Swimming', emoji: '🏊', color: 'from-cyan-500 to-cyan-600' }
  ]
  
  return (
    <section id="sports" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Book Across Sports
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            From courts to turfs, studios to pools - find the perfect venue for your favorite sport.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {sports.map((sport) => (
            <div key={sport.name} className="group cursor-pointer">
              <div className="bg-white rounded-2xl p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 group-hover:-translate-y-2">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${sport.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                  <span>{sport.emoji}</span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300">
                  {sport.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">And many more sports coming soon!</p>
          <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
            <span>🏐</span>
            <span>🏓</span>
            <span>🏸</span>
            <span>🏒</span>
            <span>🏏</span>
            <span>+</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SportsGrid



