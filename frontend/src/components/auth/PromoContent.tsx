const PromoContent = () => {
  return (
    <div className="text-center lg:text-left">
      <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
        Book sports facilities
      </h1>
      <h1 className="text-4xl lg:text-5xl font-bold text-[#2c5aa0] mb-8">
        in your city
      </h1>
      <p className="text-gray-600 text-base lg:text-lg leading-relaxed max-w-md">
        Join thousands of athletes and sports enthusiasts who book courts, fields, and facilities through Athletix. Find, book, and play at the best sports venues in your area with real-time availability and instant confirmations.
      </p>
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-gray-700">Real-time availability & instant booking</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-gray-700">Multiple sports: Football, Basketball, Tennis & more</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span className="text-gray-700">Secure payments & easy cancellations</span>
        </div>
      </div>
    </div>
  )
}

export default PromoContent