import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  MdArrowBack,
  MdSend,
  MdPerson
} from 'react-icons/md'
import PlayerNavLayout from '@/layout/PlayerNavLayout'
import type { StateType } from '@/redux/slices'
import { FETCH_MATCH_BY_ID_ACTION, FETCH_CHAT_MESSAGES_ACTION, SEND_CHAT_MESSAGE_ACTION } from '@/redux/actions/player/matchmaking.actions'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import type { ChatMessage } from '@/types/player/matchmaking.types'

const MatchChat = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile } = useSelector((state: StateType) => state.authSlice)
  const { selectedMatch, chatMessages, loading } = useSelector(
    (state: StateType) => state.matchmakingSlice
  )
  
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (id) {
      FETCH_MATCH_BY_ID_ACTION(Number(id)).catch((err) => {
        console.error('Failed to fetch match:', err)
      })
      FETCH_CHAT_MESSAGES_ACTION(Number(id)).catch((err) => {
        console.error('Failed to fetch chat messages:', err)
      })
    }
  }, [id])

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !id) return

    setSending(true)
    try {
      await SEND_CHAT_MESSAGE_ACTION(Number(id), message.trim())
      setMessage('')
      // Refresh messages
      FETCH_CHAT_MESSAGES_ACTION(Number(id)).catch(() => {})
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)

      if (minutes < 1) return 'Just now'
      if (minutes < 60) return `${minutes}m ago`
      if (hours < 24) return `${hours}h ago`
      if (days < 7) return `${days}d ago`
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    } catch {
      return timestamp
    }
  }

  const formatMessageTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return timestamp
    }
  }

  const isMyMessage = (senderId: number) => {
    return senderId === Number(profile?.userId)
  }

  if (loading && !selectedMatch) {
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

  if (!selectedMatch) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PlayerNavLayout />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">Match not found</p>
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PlayerNavLayout />
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/player/matches/${selectedMatch.matchId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <MdArrowBack className="w-5 h-5" />
            <span>Back to Match</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedMatch.title}</h1>
            <p className="text-gray-600 text-sm">Group Chat - {selectedMatch.acceptedPlayers?.length || 0} members</p>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
          {/* Messages Area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ maxHeight: 'calc(100vh - 300px)' }}
          >
            {chatMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MdPerson className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No messages yet. Start the conversation!</p>
                </div>
              </div>
            ) : (
              chatMessages.map((msg: ChatMessage, index: number) => {
                const isMine = isMyMessage(msg.senderId)
                const showAvatar = index === 0 || chatMessages[index - 1].senderId !== msg.senderId
                
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {showAvatar && !isMine && (
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {msg.senderName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    {showAvatar && isMine && <div className="w-8 h-8 flex-shrink-0" />}
                    <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[70%]`}>
                      {showAvatar && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-700">{msg.senderName}</span>
                          <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          isMine
                            ? 'bg-[#2c5aa0] text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                        <p className={`text-xs mt-1 ${isMine ? 'text-blue-100' : 'text-gray-500'}`}>
                          {formatMessageTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 focus:border-[#2c5aa0]"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!message.trim() || sending}
                className="px-6 py-2 bg-[#2c5aa0] text-white rounded-lg hover:bg-[#1e3d6f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <MdSend className="w-5 h-5" />
                {sending ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchChat

