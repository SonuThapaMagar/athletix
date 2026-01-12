import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PlayerNavLayout from '@/layout/PlayerNavLayout'
import { MdSportsSoccer, MdAdd, MdList, MdLocationOn, MdCalendarToday, MdPeople, MdVisibility } from 'react-icons/md'
import type { StateType } from '@/redux/slices'
import { FETCH_MATCHES_ACTION } from '@/redux/actions/player/matchmaking.actions'
import { Skeleton } from '@/components/ui/skeleton'
import type { MatchPost } from '@/types/player/matchmaking.types'

const Matchmaking = () => {
  const navigate = useNavigate()
  const { matches, loading, error } = useSelector(
    (state: StateType) => state.matchmakingSlice
  )

  useEffect(() => {
    FETCH_MATCHES_ACTION().catch((err) => {
      console.error('Failed to fetch matches:', err)
    })
  }, [])

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString)
      return {
        date: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    } catch {
      return { date: dateTimeString, time: '' }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800'
      case 'CLOSED':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-blue-100 text-blue-800'
      case 'INTERMEDIATE':
        return 'bg-purple-100 text-purple-800'
      case 'ADVANCED':
        return 'bg-orange-100 text-orange-800'
      case 'ANY':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PlayerNavLayout />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Matchmaking</h1>
          <p className="text-gray-600 mt-2">Connect with other athletes and find your perfect match</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/player/matchmaking/find')}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all text-left group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <MdSportsSoccer className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Find Matches</h2>
            <p className="text-gray-600">Discover and join matches with other players</p>
          </button>

          <button
            onClick={() => navigate('/player/matchmaking/create')}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all text-left group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <MdAdd className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Create Match</h2>
            <p className="text-gray-600">Host a game and invite other players to join</p>
          </button>

          <button
            onClick={() => navigate('/player/matchmaking/my-posts')}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all text-left group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <MdList className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">My Match Posts</h2>
            <p className="text-gray-600">View and manage your created matches</p>
          </button>
        </div>

        {/* Recent Matches Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recent Matches</h2>
            <button
              onClick={() => navigate('/player/matchmaking/find')}
              className="text-[#2c5aa0] hover:text-[#1e3d6f] font-medium"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <MdSportsSoccer className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No matches available yet</p>
              <button
                onClick={() => navigate('/player/matchmaking/create')}
                className="px-6 py-3 bg-[#2c5aa0] text-white rounded-lg hover:bg-[#1e3d6f] transition-colors"
              >
                Create Your First Match
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.slice(0, 6).map((match: MatchPost) => {
                const dateTime = formatDateTime(match.matchDateTime)
                return (
                  <div
                    key={match.matchId}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => navigate(`/player/matches/${match.matchId}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{match.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <MdSportsSoccer className="w-4 h-4" />
                            {match.sportType}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MdLocationOn className="w-4 h-4" />
                            {match.location}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(match.status)}`}>
                        {match.status}
                      </span>
                    </div>

                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">{match.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MdCalendarToday className="w-4 h-4" />
                        <span>{dateTime.date} at {dateTime.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MdPeople className="w-4 h-4" />
                        <span>{match.currentPlayers}/{match.requiredPlayers} players</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSkillLevelColor(match.skillLevel)}`}>
                          {match.skillLevel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {match.creator.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="text-xs text-gray-600">by {match.creator.name}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/player/matches/${match.matchId}`)
                        }}
                        className="px-3 py-1.5 text-[#2c5aa0] border border-[#2c5aa0] rounded-lg hover:bg-[#2c5aa0] hover:text-white transition-colors flex items-center gap-1 text-sm"
                      >
                        <MdVisibility className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-[#2c5aa0] to-[#1e3d6f] rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Find or Create</h3>
              <p className="text-white/90 text-sm">Browse available matches or create your own</p>
            </div>
            <div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Request to Join</h3>
              <p className="text-white/90 text-sm">Send a request to join matches you're interested in</p>
            </div>
            <div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Connect & Play</h3>
              <p className="text-white/90 text-sm">Chat with accepted players and coordinate your game</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Matchmaking



