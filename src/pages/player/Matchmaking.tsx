import PlayerNavLayout from '@/layout/PlayerNavLayout'

const Matchmaking = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PlayerNavLayout />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Playing Partners</h1>
          <p className="text-gray-600 mt-2">Connect with other athletes and find your perfect match</p>
        </div>

        {/* Matchmaking Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Match</h2>
            <p className="text-gray-600 mb-4">Find players for your next game instantly</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sport</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Football</option>
                  <option>Basketball</option>
                  <option>Tennis</option>
                  <option>Badminton</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Professional</option>
                </select>
              </div>
              <button className="w-full bg-[#2c5aa0] text-white py-2 rounded-lg hover:bg-[#1e3d6f] transition-colors">
                Find Matches
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Match</h2>
            <p className="text-gray-600 mb-4">Host a game and invite other players</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Game Details</label>
                <input type="text" placeholder="Game title" className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2" />
                <input type="text" placeholder="Location" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input type="time" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
              </div>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                Create Match
              </button>
            </div>
          </div>
        </div>

        {/* Available Matches */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Available Matches</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">P{item}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Football Match - Central Park</h3>
                      <p className="text-sm text-gray-600">Tomorrow, 6:00 PM • 4/8 players</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      Open
                    </span>
                    <button className="bg-[#2c5aa0] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1e3d6f] transition-colors">
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Matchmaking



