import { useState, useEffect } from 'react'
import { MdSportsSoccer, MdChat, MdEvent } from 'react-icons/md'

interface Player {
  name: string
  jersey: string
  shorts: string
  action: string
}

interface Sport {
  name: string
  icon: string
  color: string
}

interface Banner {
  id: number
  title: string
  subtitle: string
  description: string
  gradient: string
  lightGradient: string
  icon: any
  players?: Player[]
  phonePreview?: boolean
  sports?: Sport[]
}

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const banners: Banner[] = [
    {
      id: 1,
      title: "Find New Players",
      subtitle: "Broadcast",
      description: "Connect with local players and expand your sports network",
      gradient: "from-green-500 to-green-600",
      lightGradient: "from-green-400/30 to-green-500/30",
      icon: MdSportsSoccer,
      players: [
        { name: "Player 1", jersey: "white", shorts: "red", action: "holding ball" },
        { name: "Player 2", jersey: "red", shorts: "white", action: "juggling" },
        { name: "Player 3", jersey: "yellow", shorts: "yellow", action: "kicking" },
        { name: "Player 4", jersey: "green", shorts: "green", action: "dribbling" }
      ]
    },
    {
      id: 2,
      title: "Connect, Chat, and Play",
      subtitle: "Message Now",
      description: "Stay connected with your team and coordinate matches",
      gradient: "from-purple-500 to-purple-600",
      lightGradient: "from-purple-400/30 to-purple-500/30",
      icon: MdChat,
      phonePreview: true
    },
    {
      id: 3,
      title: "Book. Play. Win!",
      subtitle: "Book Now",
      description: "Reserve your favorite sports venues instantly",
      gradient: "from-blue-600 to-blue-700",
      lightGradient: "from-blue-500/30 to-blue-600/30",
      icon: MdEvent,
      sports: [
        { name: "Badminton", icon: "🏸", color: "red" },
        { name: "Basketball", icon: "🏀", color: "green" },
        { name: "Football", icon: "⚽", color: "purple" }
      ]
    }
  ]

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [banners.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="relative overflow-hidden bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-20">
        <div className="relative h-64 md:h-72 rounded-2xl overflow-hidden">
          {/* Slider Container */}
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {banners.map((banner) => (
              <div key={banner.id} className="w-full flex-shrink-0 relative">
                <div className={`h-full bg-gradient-to-r ${banner.gradient} relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${banner.lightGradient} opacity-50`}>
                    <div className="absolute inset-0 opacity-20">
                      <div className="w-full h-full bg-repeat" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                      }}></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex items-center px-6 md:px-12">
                    <div className="flex-1 text-white">
                      <h2 className="text-2xl md:text-3xl font-bold mb-2">{banner.title}</h2>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-lg md:text-xl font-medium">{banner.subtitle}</span>
                        <div className="w-6 h-6 border-2 border-white rounded-sm flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-sm"></div>
                        </div>
                      </div>
                      <p className="text-sm md:text-base opacity-90 max-w-md">{banner.description}</p>
                    </div>

                    {/* Right Side Content */}
                    <div className="flex-shrink-0 ml-8">
                      {banner.id === 1 && banner.players && (
                        <div className="flex space-x-2">
                          {banner.players.map((_, index) => (
                            <div key={index} className="w-12 h-16 md:w-14 md:h-20 bg-white/20 rounded-lg flex items-center justify-center">
                              <div className="text-2xl">⚽</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {banner.id === 2 && (
                        <div className="relative">
                          <div className="w-20 h-32 md:w-24 md:h-36 bg-white rounded-lg shadow-lg p-2">
                            <div className="h-6 bg-gray-800 rounded mb-2"></div>
                            <div className="h-4 bg-green-500 rounded mb-2"></div>
                            <div className="space-y-1">
                              <div className="h-3 bg-gray-200 rounded"></div>
                              <div className="h-3 bg-gray-200 rounded"></div>
                              <div className="h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs">HELLO THERE</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {banner.id === 3 && banner.sports && (
                        <div className="flex space-x-3">
                          {banner.sports.map((sport, index) => (
                            <div key={index} className="w-12 h-16 md:w-14 md:h-20 bg-white/20 rounded-lg flex flex-col items-center justify-center">
                              <div className="text-2xl mb-1">{sport.icon}</div>
                              <div className="text-xs text-white/80">{sport.name}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-110' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => goToSlide(currentSlide === 0 ? banners.length - 1 : currentSlide - 1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => goToSlide(currentSlide === banners.length - 1 ? 0 : currentSlide + 1)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default BannerSlider
