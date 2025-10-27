import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  MdArrowBack,
  MdSearch,
  MdHelp,
  MdEmail,
  MdPhone,
  MdChat,
  MdQuestionAnswer,
  MdBookOnline,
  MdPeople,
  MdHistory,
  MdSettings,
  MdAccountCircle,
  MdPayment,
  MdCancel,
  MdCheckCircle
} from 'react-icons/md'

interface FAQItem {
  id: number
  question: string
  answer: string
  category: string
}

const Help = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const categories = [
    { id: 'all', label: 'All Topics', icon: MdHelp },
    { id: 'booking', label: 'Booking', icon: MdBookOnline },
    { id: 'account', label: 'Account', icon: MdAccountCircle },
    { id: 'payment', label: 'Payment', icon: MdPayment },
    { id: 'technical', label: 'Technical', icon: MdSettings }
  ]

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "How do I book a sports venue?",
      answer: "To book a venue, go to the Booking page, select your preferred date and time, choose the venue, and complete the payment process. You'll receive a confirmation email with all the details.",
      category: "booking"
    },
    {
      id: 2,
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking up to 2 hours before the scheduled time. Go to your booking history, find the booking you want to cancel, and click the cancel button. Refunds are processed within 3-5 business days.",
      category: "booking"
    },
    {
      id: 3,
      question: "How do I update my profile information?",
      answer: "Go to your Profile page and click the 'Edit Profile' button. You can update your personal information, bio, contact details, and favorite sports. Don't forget to save your changes.",
      category: "account"
    },
    {
      id: 4,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and digital wallets like Apple Pay and Google Pay. All payments are processed securely through our encrypted payment system.",
      category: "payment"
    },
    {
      id: 5,
      question: "How does matchmaking work?",
      answer: "Our matchmaking feature connects you with other players who have similar skill levels and interests. You can set your preferences, and we'll notify you when compatible players are available for games.",
      category: "booking"
    },
    {
      id: 6,
      question: "I'm having trouble logging in. What should I do?",
      answer: "First, make sure you're using the correct email and password. If you've forgotten your password, use the 'Forgot Password' link on the login page. If you're still having issues, contact our support team.",
      category: "technical"
    },
    {
      id: 7,
      question: "How do I change my notification settings?",
      answer: "Go to Settings > Notifications to customize your notification preferences. You can choose to receive email notifications, push notifications, SMS alerts, and more.",
      category: "account"
    },
    {
      id: 8,
      question: "What if I need to reschedule my booking?",
      answer: "You can reschedule your booking by going to your booking history, selecting the booking you want to change, and choosing a new date and time. This is subject to availability and venue policies.",
      category: "booking"
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <MdArrowBack className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Help & Support</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <nav className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-[#2c5aa0] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {category.label}
                    </button>
                  )
                })}
              </nav>

              {/* Contact Support */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Need More Help?</h4>
                <div className="space-y-3">
                  <a
                    href="mailto:support@athletix.com"
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#2c5aa0] transition-colors"
                  >
                    <MdEmail className="w-4 h-4" />
                    Email Support
                  </a>
                  <a
                    href="tel:+1-555-ATHLETIX"
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#2c5aa0] transition-colors"
                  >
                    <MdPhone className="w-4 h-4" />
                    Call Us
                  </a>
                  <button className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#2c5aa0] transition-colors">
                    <MdChat className="w-4 h-4" />
                    Live Chat
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <MdQuestionAnswer className="w-6 h-6 text-[#2c5aa0]" />
                <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
              </div>

              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12">
                  <MdHelp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">Try adjusting your search terms or browse different categories.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {faq.category}
                          </span>
                          {expandedFAQ === faq.id ? (
                            <MdCancel className="w-5 h-5 text-gray-500" />
                          ) : (
                            <MdCheckCircle className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </button>
                      {expandedFAQ === faq.id && (
                        <div className="px-4 pb-4 border-t border-gray-200 bg-gray-50">
                          <p className="text-gray-600 leading-relaxed pt-4">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <MdBookOnline className="w-8 h-8 text-[#2c5aa0] mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-2">Book a Venue</h3>
                <p className="text-sm text-gray-600 mb-4">Find and book sports venues near you</p>
                <button
                  onClick={() => navigate('/player/booking')}
                  className="w-full bg-[#2c5aa0] text-white py-2 px-4 rounded-lg hover:bg-[#1e3d6f] transition-colors"
                >
                  Start Booking
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <MdPeople className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-2">Find Players</h3>
                <p className="text-sm text-gray-600 mb-4">Connect with other players for games</p>
                <button
                  onClick={() => navigate('/player/matchmaking')}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Find Players
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <MdHistory className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-2">View History</h3>
                <p className="text-sm text-gray-600 mb-4">Check your booking and game history</p>
                <button
                  onClick={() => navigate('/player/history')}
                  className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  View History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Help