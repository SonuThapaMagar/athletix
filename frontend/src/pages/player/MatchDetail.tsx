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
  MdPerson,
  MdShare,
  MdGroupAdd
} from 'react-icons/md'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
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
  const [isChatCreationOpen, setIsChatCreationOpen] = useState(false)
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([])

  // Initialize selected players with all accepted players when dialog opens
  useEffect(() => {
    if (isChatCreationOpen && selectedMatch?.acceptedPlayers) {
      setSelectedPlayerIds(selectedMatch.acceptedPlayers.map(p => p.playerId))
    }
  }, [isChatCreationOpen, selectedMatch])

  // Load match data
  useEffect(() => {
    if (id) {
      FETCH_MATCH_BY_ID_ACTION(Number(id)).catch((err) => {
        console.error('Failed to fetch match:', err)
        toast.error('Failed to load match details')
      })
    }
  }, [id])

  // Load requests if user is creator
  useEffect(() => {
    if (selectedMatch && selectedMatch.creator.userId === Number(profile?.userId) && id) {
      FETCH_MATCH_REQUESTS_ACTION(Number(id)).catch(() => { })
    }
  }, [selectedMatch, profile, id])

  // User status checks
  const userId = Number(profile?.userId)
  const isCreator = selectedMatch?.creator.userId === userId
  const hasRequested = selectedMatch?.hasRequested || false
  const isAccepted =
    selectedMatch?.requestStatus === 'ACCEPTED' ||
    selectedMatch?.acceptedPlayers?.some(p => p.playerId === userId) ||
    false

  const canAccessChat = () => isCreator || isAccepted

  // Format date and time
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
        FETCH_MATCH_BY_ID_ACTION(Number(id)).catch(() => { })
        FETCH_MATCH_REQUESTS_ACTION(Number(id)).catch(() => { })
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
        FETCH_MATCH_BY_ID_ACTION(Number(id)).catch(() => { })
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send request')
    }
  }

  const handleCopyInviteLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast.success('Invite link copied to clipboard!')
  }

  const handleCreateTeamChat = () => {
    if (!selectedMatch) return

    // In a real app, this would send a request to the backend to create a chat group
    // For now, we simulate it and navigate to the chat
    if (selectedPlayerIds.length === 0) {
      toast.error('Please select at least one player')
      return
    }

    toast.success('Team chat created successfully!')
    setIsChatCreationOpen(false)
    navigate(`/player/matches/${selectedMatch.matchId}/chat`)
  }

  const togglePlayerSelection = (playerId: number) => {
    setSelectedPlayerIds(prev =>
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    )
  }

  // Loading state
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

  // Error state
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
            className="mt-4 text-[#2c5aa0] hover:text-[#1e3d6f] cursor-pointer"
          >
            Back to Matches
          </button>
        </div>
      </div>
    )
  }

  const dateTime = formatDateTime(selectedMatch.matchDateTime)

  return (
    <div className="min-h-screen bg-gray-50">
      <PlayerNavLayout />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-22">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/player/matchmaking')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary mb-4 cursor-pointer"
          >
            <MdArrowBack className="w-5 h-5" />
            <span>Back to Matches</span>
          </button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedMatch.title}</h1>
              <p className="text-gray-600 mt-2">Match details and information</p>
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              {/* Chat access for creator or accepted players */}
              {canAccessChat() && (
                <>
                  <button
                    onClick={handleCopyInviteLink}
                    className="px-4 py-2 bg-blue-100 text-primary rounded-lg hover:bg-blue-200 flex items-center gap-2 cursor-pointer transition-colors"
                    title="Copy Invite Link"
                  >
                    <MdShare className="w-5 h-5" />
                    <span className="hidden sm:inline">Invite</span>
                  </button>

                  {isCreator && selectedMatch.acceptedPlayers && selectedMatch.acceptedPlayers.length > 0 ? (
                    <button
                      onClick={() => setIsChatCreationOpen(true)}
                      className="px-4 py-2 bg-primary/90 text-white rounded-lg hover:bg-primary flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <MdGroupAdd className="w-5 h-5" />
                      Create Team Chat
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/player/matches/${selectedMatch.matchId}/chat`)}
                      className="px-4 py-2 bg-primary/90 text-white rounded-lg hover:primary flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <MdChat className="w-5 h-5" />
                      Chat
                    </button>
                  )}
                </>
              )}

              {/* Status badges for non-chat-access users */}
              {!canAccessChat() && isAccepted && (
                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2 font-medium">
                  <MdCheckCircle className="w-5 h-5" />
                  Accepted
                </div>
              )}

              {!canAccessChat() && hasRequested && !isAccepted && (
                <div className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg flex items-center gap-2 font-medium">
                  <span className="text-sm">Request Pending</span>
                </div>
              )}

              {/* Request to join button */}
              {!canAccessChat() && !hasRequested && !isAccepted && selectedMatch.status === 'OPEN' && selectedMatch.currentPlayers < selectedMatch.requiredPlayers && (
                <button
                  onClick={handleRequestToJoin}
                  className="px-4 py-2 bg-[#2c5aa0] text-white rounded-lg hover:bg-[#1e3d6f] transition-colors cursor-pointer font-medium"
                >
                  Request to Join
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Match Details Card */}
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
                {dateTime.date}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Time</p>
              <p className="text-sm font-medium text-gray-900">{dateTime.time}</p>
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

          {/* Request to join (large button) */}
          {!isCreator && !hasRequested && !isAccepted && selectedMatch.status === 'OPEN' && selectedMatch.currentPlayers < selectedMatch.requiredPlayers && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleRequestToJoin}
                className="w-full px-6 py-3 bg-[#2c5aa0] text-white rounded-lg hover:bg-[#1e3d6f] transition-colors font-medium cursor-pointer"
              >
                Request to Join
              </button>
            </div>
          )}

          {/* Show requests toggle (creator only) */}
          {isCreator && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowRequests(!showRequests)}
                className="w-auto px-6 py-3 bg-primary/90 text-white rounded-4xl hover:bg-primary transition-colors font-medium cursor-pointer"
              >
                {showRequests ? 'Hide' : 'Show'} Requests ({requests.filter(r => r.status === 'PENDING').length} pending)
              </button>
            </div>
          )}
        </div>

        {/* Requests Section (Creator Only) */}
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
                              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                              title="Accept"
                            >
                              <MdCheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleRespondToRequest(request.requestId, 'reject')}
                              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
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

        {/* Accepted Players Section */}
        {selectedMatch.acceptedPlayers && selectedMatch.acceptedPlayers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Accepted Players ({selectedMatch.acceptedPlayers.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedMatch.acceptedPlayers.map((player) => (
                <div key={player.playerId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {player.playerName?.charAt(0).toUpperCase() || 'P'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{player.playerName}</p>
                    <p className="text-xs text-gray-500">
                      Accepted {new Date(player.acceptedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Dialog open={isChatCreationOpen} onOpenChange={setIsChatCreationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Team Chat</DialogTitle>
            <DialogDescription>
              Select players to include in the team chat.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3 max-h-60 overflow-y-auto">
            {selectedMatch?.acceptedPlayers?.map(player => (
              <label
                key={player.playerId}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedPlayerIds.includes(player.playerId)}
                  onChange={() => togglePlayerSelection(player.playerId)}
                  className="w-5 h-5 rounded border-gray-300 text-[#2c5aa0] focus:ring-[#2c5aa0]"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{player.playerName}</p>
                  <p className="text-xs text-gray-500">{player.playerEmail}</p>
                </div>
              </label>
            ))}
          </div>

          <DialogFooter>
            <button
              onClick={() => setIsChatCreationOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTeamChat}
              className="px-4 py-2 bg-[#2c5aa0] text-white rounded-lg hover:bg-[#1e3d6f] cursor-pointer"
            >
              Create Chat
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MatchDetail