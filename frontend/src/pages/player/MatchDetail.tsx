import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  MdArrowBack,
  MdLocationOn,
  MdCalendarToday,
  MdPeople,
  MdSportsSoccer,
  MdCheckCircle,
  MdCancel,
  MdChat,
  MdPerson
} from 'react-icons/md'
import PlayerNavLayout from '@/layout/PlayerNavLayout'
import type { StateType } from '@/redux/slices'
import { FETCH_MATCH_BY_ID_ACTION, FETCH_MATCH_REQUESTS_ACTION, RESPOND_TO_REQUEST_ACTION, REQUEST_TO_JOIN_ACTION } from '@/redux/actions/player/matchmaking.actions'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import type { MatchRequest } from '@/types/player/matchmaking.types'

const MatchDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile } = useSelector((state: StateType) => state.authSlice)
  const { selectedMatch, requests, loading, error } = useSelector(
    (state: StateType) => state.matchmakingSlice
  )

  const [showRequests, setShowRequests] = useState(false)

  useEffect(() => {
    if (id) {
      FETCH_MATCH_BY_ID_ACTION(Number(id)).catch((err) => {
        console.error('Failed to fetch match:', err)
        toast.error('Failed to load match details')
      })
    }
  }, [id])

  useEffect(() => {
    if (selectedMatch && selectedMatch.creator.userId === Number(profile?.userId) && id) {
      FETCH_MATCH_REQUESTS_ACTION(Number(id)).catch(() => {})
    }
  }, [selectedMatch, profile, id])

  const isCreator = selectedMatch?.creator.userId === Number(profile?.userId)
  const hasRequested = selectedMatch?.requests?.some(r => r.player.userId === Number(profile?.userId))
  const isAccepted = selectedMatch?.acceptedPlayers?.some(p => p.playerId === Number(profile?.userId))

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString)
      return {
        date: date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
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
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleRespondToRequest = async (requestId: number, action: 'accept' | 'reject') => {
    try {
      await RESPOND_TO_REQUEST_ACTION(requestId, action)
      toast.success(`Request ${action === 'accept' ? 'accepted' : 'rejected'} successfully`)
      if (id) {
        FETCH_MATCH_BY_ID_ACTION(Number(id)).catch(() => {})
        FETCH_MATCH_REQUESTS_ACTION(Number(id)).catch(() => {})
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || `Failed to ${action} request`)
    }
  }

  const handleRequestToJoin = async () => {
    try {
      await REQUEST_TO_JOIN_ACTION(Number(id))
      toast.success('Request sent successfully!')
      if (id) {
        FETCH_MATCH_BY_ID_ACTION(Number(id)).catch(() => {})
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send request')
    }
  }

  const canAccessChat = () => {
    return isCreator || isAccepted
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PlayerNavLayout />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (error || !selectedMatch) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PlayerNavLayout />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error || 'Match not found'}</p>
          </div>
          <button
            onClick={() => navigate('/player/matchmaking')}
            className="mt-4 text-[#2c5aa0] hover:text-[#1e3d6f]"
          >
            Back to Matches
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PlayerNavLayout />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/player/matchmaking')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <MdArrowBack className="w-5 h-5" />
            <span>Back to Matches</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedMatch.title}</h1>
              <p className="text-gray-600 mt-2">Match details and information</p>
            </div>
            {canAccessChat() && (
              <button
                onClick={() => navigate(`/player/matches/${selectedMatch.matchId}/chat`)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <MdChat className="w-5 h-5" />
                Chat
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{selectedMatch.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Sport</p>
              <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <MdSportsSoccer className="w-4 h-4" />
                {selectedMatch.sportType}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Location</p>
              <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <MdLocationOn className="w-4 h-4" />
                {selectedMatch.location}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Date</p>
              <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <MdCalendarToday className="w-4 h-4" />
                {formatDateTime(selectedMatch.matchDateTime).date}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Time</p>
              <p className="text-sm font-medium text-gray-900">{formatDateTime(selectedMatch.matchDateTime).time}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Players</p>
              <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <MdPeople className="w-4 h-4" />
                {selectedMatch.currentPlayers}/{selectedMatch.requiredPlayers}
              </p>
            </div>
          </div>

          {selectedMatch.contactInfo && (
            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <p className="text-xs text-gray-500 mb-1">Contact Info</p>
              <p className="text-sm font-medium text-gray-900">{selectedMatch.contactInfo}</p>
            </div>
          )}

          {selectedMatch.additionalNotes && (
            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <p className="text-xs text-gray-500 mb-1">Additional Notes</p>
              <p className="text-sm font-medium text-gray-900 whitespace-pre-wrap">{selectedMatch.additionalNotes}</p>
            </div>
          )}

          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {selectedMatch.creator.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Created by {selectedMatch.creator.name}</p>
              <p className="text-xs text-gray-500">{new Date(selectedMatch.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {!isCreator && selectedMatch.status === 'OPEN' && selectedMatch.currentPlayers < selectedMatch.requiredPlayers && (
            <div className="pt-4 border-t border-gray-200">
              {hasRequested ? (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">You have already sent a request to join this match.</p>
                </div>
              ) : (
                <button
                  onClick={handleRequestToJoin}
                  className="w-full px-6 py-3 bg-[#2c5aa0] text-white rounded-lg hover:bg-[#1e3d6f] transition-colors font-medium"
                >
                  Request to Join
                </button>
              )}
            </div>
          )}

          {isCreator && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowRequests(!showRequests)}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                {showRequests ? 'Hide' : 'Show'} Requests ({requests.filter(r => r.status === 'PENDING').length} pending)
              </button>
            </div>
          )}
        </div>

        {/* Requests Section */}
        {isCreator && showRequests && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Join Requests</h2>
            {requests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No requests yet</p>
            ) : (
              <div className="space-y-3">
                {requests.map((request: MatchRequest) => (
                  <div key={request.requestId} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          <MdPerson className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{request.player.name}</p>
                          <p className="text-xs text-gray-500">{request.player.email}</p>
                          {request.message && (
                            <p className="text-xs text-gray-600 mt-1">{request.message}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            Requested: {new Date(request.requestedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        {request.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleRespondToRequest(request.requestId, 'accept')}
                              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              title="Accept"
                            >
                              <MdCheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleRespondToRequest(request.requestId, 'reject')}
                              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              title="Reject"
                            >
                              <MdCancel className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Accepted Players */}
        {selectedMatch.acceptedPlayers && selectedMatch.acceptedPlayers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Accepted Players</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedMatch.acceptedPlayers.map((player) => (
                <div key={player.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {player.playerName?.charAt(0).toUpperCase() || 'P'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{player.playerName}</p>
                    <p className="text-xs text-gray-500">Accepted {new Date(player.acceptedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchDetail

