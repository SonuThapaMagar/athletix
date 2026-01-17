import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MdArrowBack, MdSend, MdPerson, MdMoreVert, MdPhone, MdVideocam } from 'react-icons/md'
import PlayerNavLayout from '@/layout/PlayerNavLayout'

interface Message {
    id: number
    senderId: number
    text: string
    timestamp: string
}

// Mock data
const MOCK_USER = {
    id: 2,
    name: "John Doe",
    status: "Online",
    avatar: null
}

const DirectChat = () => {
    const { userId } = useParams<{ userId: string }>()
    const navigate = useNavigate()
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, senderId: 2, text: "Hey! Are you joining the match?", timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 2, senderId: 1, text: "Yes, I just sent the request!", timestamp: new Date(Date.now() - 3500000).toISOString() }
    ])
    const [inputText, setInputText] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputText.trim()) return

        const newMessage: Message = {
            id: Date.now(),
            senderId: 1, // Current user
            text: inputText,
            timestamp: new Date().toISOString()
        }

        setMessages([...messages, newMessage])
        setInputText('')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <PlayerNavLayout />
            <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-white rounded-t-2xl shadow-sm border border-gray-200 p-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <MdArrowBack className="w-6 h-6" />
                        </button>
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                            {MOCK_USER.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900">{MOCK_USER.name}</h2>
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                {MOCK_USER.status}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <MdPhone className="w-6 h-6" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <MdVideocam className="w-6 h-6" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <MdMoreVert className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="bg-white border-x border-gray-200 flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => {
                        const isMe = msg.senderId === 1
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe
                                            ? 'bg-[#2c5aa0] text-white rounded-tr-none'
                                            : 'bg-gray-100 text-gray-900 rounded-tl-none'
                                        }`}
                                >
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-100' : 'text-gray-500'} text-right`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-white rounded-b-2xl shadow-sm border border-gray-200 p-4">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 focus:border-[#2c5aa0]"
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            className="p-2 bg-[#2c5aa0] text-white rounded-full hover:bg-[#1e3d6f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <MdSend className="w-6 h-6 pl-1" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default DirectChat
