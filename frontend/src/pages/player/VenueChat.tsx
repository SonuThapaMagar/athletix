import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    MdArrowBack,
    MdSend,
    MdStore
} from 'react-icons/md'
import PlayerNavLayout from '@/layout/PlayerNavLayout'
import requests from '@/helper/requests'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import type { ChatMessage } from '@/types/player/matchmaking.types'

const VenueChat = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [venueName, setVenueName] = useState('')

    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (id) {
            loadVenueDetails()
            loadMessages()

            const interval = setInterval(loadMessages, 3000)
            return () => clearInterval(interval)
        }
    }, [id])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const loadVenueDetails = async () => {
        try {
            const response = await requests.venueMgmt.getVenueById(Number(id))
            setVenueName(response.data.data.name)
        } catch (error) {
            console.error('Failed to load venue details', error)
        }
    }

    const loadMessages = async () => {
        try {
            const response = await requests.player.venueChat.getMessages(Number(id))
            if (response.data.success) {
                setMessages(response.data.data)
                setLoading(false)
            }
        } catch (error) {
            console.error('Failed to load messages', error)
            setLoading(false)
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim() || !id) return

        setSending(true)
        try {
            await requests.player.venueChat.sendMessage(Number(id), message.trim())
            setMessage('')
            loadMessages()
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to send message')
        } finally {
            setSending(false)
        }
    }

    const formatTime = (timestamp: string) => {
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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <PlayerNavLayout />
            <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(`/player/venues/${id}`)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 cursor-pointer"
                    >
                        <MdArrowBack className="w-5 h-5" />
                        <span>Back to Venue</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <MdStore className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{venueName || 'Venue Chat'}</h1>
                            <p className="text-gray-600 text-sm">Chat with venue owner</p>
                        </div>
                    </div>
                </div>

                {/* Chat Container */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
                    {/* Messages Area */}
                    <div
                        className="flex-1 overflow-y-auto p-4 space-y-4"
                        style={{ maxHeight: 'calc(100vh - 350px)' }}
                    >
                        {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <MdStore className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No messages yet. Ask a question!</p>
                                </div>
                            </div>
                        ) : (
                            messages.map((msg: ChatMessage, index: number) => {
                                // Assuming current user is senderId check logic handled by backend response usually
                                // But here for simplicity let's assume if it's NOT the venue owner, it's me
                                // In a real app we'd check against current user ID.
                                // For now, let's assume 'me' is based on a flag or senderId matching profile
                                // Since I don't have profile here easily without redux, I will assume 
                                // messages from 'user' are mine.
                                // Wait, I should use the profile from Redux or local storage.
                                // Let's grab profile from localStorage or Redux if possible.
                                // Actually, let's use a simpler heuristic or just style all right-aligned for now?
                                // No, left aligned is venue, right is me.

                                // Let's assume the API returns 'isMine' or similar. 
                                // Or I can check if senderId === myUserId.
                                const myUserId = JSON.parse(localStorage.getItem('user') || '{}').id
                                const isMine = msg.senderId === myUserId

                                // Fallback if local storage is empty/different structure
                                // const isMine = msg.senderName === 'Me' 

                                return (
                                    <div
                                        key={index}
                                        className={`flex gap-3 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
                                    >
                                        {!isMine && (
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold flex-shrink-0">
                                                <MdStore className="w-4 h-4" />
                                            </div>
                                        )}
                                        <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                            <span className="text-xs text-gray-500 mb-1">{!isMine ? venueName : 'You'}</span>
                                            <div
                                                className={`rounded-2xl px-4 py-2 ${isMine
                                                        ? 'bg-[#2c5aa0] text-white'
                                                        : 'bg-gray-100 text-gray-900'
                                                    }`}
                                            >
                                                <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                                                <p className={`text-xs mt-1 ${isMine ? 'text-blue-100' : 'text-gray-500'}`}>
                                                    {formatTime(msg.timestamp)}
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
                                className="px-6 py-2 bg-[#2c5aa0] text-white rounded-lg hover:bg-[#1e3d6f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
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

export default VenueChat
