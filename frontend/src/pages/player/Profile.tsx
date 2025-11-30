import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  MdArrowBack,
  MdEdit, 
  MdSave,
  MdCancel,
  MdEmail, 
  MdPhone, 
  MdLocationOn, 
  MdCalendarToday,
  MdSportsSoccer,
  MdStar,
  MdEmojiEvents,
  MdHistory
} from 'react-icons/md'

interface UserProfile {
  id: number
  name: string
  email: string
  phone: string
  location: string
  joinDate: string
  avatar: string
  bio: string
  favoriteSports: string[]
  stats: {
    gamesPlayed: number
    gamesWon: number
    winRate: number
    totalHours: number
    averageRating: number
  }
  achievements: {
    id: number
    title: string
    description: string
    icon: string
    earnedDate: string
  }[]
  recentActivity: {
    id: number
    type: string
    description: string
    date: string
    venue: string
  }[]
}

const Profile = () => {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null)

  // Mock user data
  const userProfile: UserProfile = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    joinDate: "January 2023",
    avatar: "/api/placeholder/150/150",
    bio: "Passionate athlete who loves playing basketball and football. Always looking for new challenges and friendly competition!",
    favoriteSports: ["Basketball", "Football", "Tennis"],
    stats: {
      gamesPlayed: 45,
      gamesWon: 32,
      winRate: 71,
      totalHours: 180,
      averageRating: 4.8
    },
    achievements: [
      {
        id: 1,
        title: "First Victory",
        description: "Won your first game",
        icon: "🏆",
        earnedDate: "Feb 15, 2023"
      },
      {
        id: 2,
        title: "Century Club",
        description: "Played 100+ hours",
        icon: "⏰",
        earnedDate: "Aug 20, 2023"
      },
      {
        id: 3,
        title: "Team Player",
        description: "Played with 50+ different players",
        icon: "👥",
        earnedDate: "Nov 10, 2023"
      }
    ],
    recentActivity: [
      {
        id: 1,
        type: "Game",
        description: "Basketball game at Elite Sports Complex",
        date: "2 days ago",
        venue: "Elite Sports Complex"
      },
      {
        id: 2,
        type: "Booking",
        description: "Booked tennis court for tomorrow",
        date: "3 days ago",
        venue: "Downtown Tennis Club"
      },
      {
        id: 3,
        type: "Review",
        description: "Left a review for City Sports Center",
        date: "1 week ago",
        venue: "City Sports Center"
      }
    ]
  }

  const handleEdit = () => {
    setEditedProfile({ ...userProfile })
    setIsEditing(true)
  }

  const handleSave = () => {
    // Here you would typically save to API
    setIsEditing(false)
    setEditedProfile(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedProfile(null)
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [field]: value
      })
    }
  }

  const currentProfile = editedProfile || userProfile

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-[#2c5aa0] transition-colors"
            >
              <MdArrowBack className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Header Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar Section */}
              <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f] rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl sm:text-2xl">
                  {currentProfile.name.charAt(0)}
                    </span>
                  </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-gray-100">
                <MdEdit className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                </button>
              </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                {currentProfile.name}
              </h2>
              <p className="text-gray-600 mb-3 flex items-center justify-center sm:justify-start gap-1">
                        <MdLocationOn className="w-4 h-4" />
                {currentProfile.location}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                        <MdCalendarToday className="w-4 h-4" />
                  Joined {currentProfile.joinDate}
                </span>
                <span className="flex items-center gap-1">
                  <MdStar className="w-4 h-4 text-yellow-500" />
                  {currentProfile.stats.averageRating}/5
                </span>
                      </div>
                    </div>

            {/* Edit Button */}
            <div className="w-full sm:w-auto">
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 sm:flex-none bg-[#2c5aa0] text-white py-2 px-4 rounded-xl hover:bg-[#1e3d6f] transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <MdSave className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none border border-gray-300 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <MdCancel className="w-4 h-4" />
                    Cancel
                  </button>
                  </div>
              ) : (
                  <button
                  onClick={handleEdit}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#2c5aa0] to-[#1e3d6f] text-white py-2 px-6 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <MdEdit className="w-4 h-4" />
                  Edit Profile
                  </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Bio & Contact */}
          <div className="lg:col-span-1 space-y-6">
            {/* Bio Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#2c5aa0] rounded-full"></div>
                About
              </h3>
              {isEditing ? (
                <textarea
                  value={currentProfile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20 resize-none"
                  rows={4}
                />
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed">{currentProfile.bio}</p>
              )}
              </div>

            {/* Contact Info Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Contact Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MdEmail className="w-4 h-4 text-blue-600" />
                  </div>
                  {isEditing ? (
                    <input
                      type="email"
                      value={currentProfile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20 text-sm"
                    />
                  ) : (
                    <span className="text-gray-700">{currentProfile.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <MdPhone className="w-4 h-4 text-green-600" />
                        </div>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={currentProfile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20 text-sm"
                    />
                  ) : (
                    <span className="text-gray-700">{currentProfile.phone}</span>
                  )}
                        </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MdLocationOn className="w-4 h-4 text-purple-600" />
                        </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentProfile.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20 text-sm"
                    />
                  ) : (
                    <span className="text-gray-700">{currentProfile.location}</span>
                  )}
                        </div>
                      </div>
                    </div>

            {/* Favorite Sports Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Favorite Sports
              </h3>
                          <div className="flex flex-wrap gap-2">
                {currentProfile.favoriteSports.map((sport, index) => (
                  <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-sm rounded-full font-medium border border-blue-200">
                                {sport}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

          {/* Right Column - Stats & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f] rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MdSportsSoccer className="w-6 h-6 text-white" />
                        </div>
                <div className="text-xl font-bold text-gray-900">{currentProfile.stats.gamesPlayed}</div>
                <div className="text-xs text-gray-600">Games Played</div>
                          </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MdEmojiEvents className="w-6 h-6 text-white" />
                          </div>
                <div className="text-xl font-bold text-gray-900">{currentProfile.stats.gamesWon}</div>
                <div className="text-xs text-gray-600">Games Won</div>
                          </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MdStar className="w-6 h-6 text-white" />
                        </div>
                <div className="text-xl font-bold text-gray-900">{currentProfile.stats.winRate}%</div>
                <div className="text-xs text-gray-600">Win Rate</div>
                      </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MdHistory className="w-6 h-6 text-white" />
                    </div>
                <div className="text-xl font-bold text-gray-900">{currentProfile.stats.totalHours}</div>
                <div className="text-xs text-gray-600">Total Hours</div>
                      </div>
                    </div>

            {/* Achievements */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentProfile.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-300">
                    <div className="text-3xl">{achievement.icon}</div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                              <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{achievement.earnedDate}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

            {/* Recent Activity */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Recent Activity
              </h3>
              <div className="space-y-3">
                {currentProfile.recentActivity.map((activity, index) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-green-500' : 
                      index === 1 ? 'bg-blue-500' : 
                      'bg-purple-500'
                    }`}></div>
                          <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.venue} • {activity.date}</p>
                          </div>
                        </div>
                      ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
