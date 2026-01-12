import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PlayerNavLayout from '@/layout/PlayerNavLayout'
import { MdArrowBack, MdSportsSoccer, MdLocationOn, MdCalendarToday, MdPeople } from 'react-icons/md'
import { CREATE_MATCH_ACTION } from '@/redux/actions/player/matchmaking.actions'
import { toast } from 'sonner'
import type { CreateMatchData } from '@/types/player/matchmaking.types'

const CreateMatch = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateMatchData>({
    title: '',
    description: '',
    sportType: 'Football',
    location: '',
    matchDateTime: '',
    requiredPlayers: 8,
    skillLevel: 'INTERMEDIATE',
    contactInfo: '',
    additionalNotes: ''
  })

  const sports = ['Football', 'Basketball', 'Tennis', 'Badminton', 'Volleyball', 'Cricket']
  const skillLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ANY']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const match = await CREATE_MATCH_ACTION(formData)
      toast.success('Match created successfully!')
      navigate(`/player/matches/${match.matchId}`)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create match')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PlayerNavLayout />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/player/matchmaking')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <MdArrowBack className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create Match</h1>
          <p className="text-gray-600 mt-2">Host a game and invite other players to join</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Match Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Weekend Football Match"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 focus:border-[#2c5aa0]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your match, rules, and what players can expect..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 focus:border-[#2c5aa0]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MdSportsSoccer className="inline w-4 h-4 mr-1" />
                Sport *
              </label>
              <select
                required
                value={formData.sportType}
                onChange={(e) => setFormData({ ...formData, sportType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 focus:border-[#2c5aa0]"
              >
                {sports.map(sport => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Level *
              </label>
              <select
                required
                value={formData.skillLevel}
                onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 focus:border-[#2c5aa0]"
              >
                {skillLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MdLocationOn className="inline w-4 h-4 mr-1" />
              Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Central Park, Downtown"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 focus:border-[#2c5aa0]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MdCalendarToday className="inline w-4 h-4 mr-1" />
              Match Date & Time *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.matchDateTime}
              onChange={(e) => setFormData({ ...formData, matchDateTime: e.target.value })}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 focus:border-[#2c5aa0]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MdPeople className="inline w-4 h-4 mr-1" />
              Required Players *
            </label>
            <input
              type="number"
              required
              min={2}
              max={50}
              value={formData.requiredPlayers}
              onChange={(e) => setFormData({ ...formData, requiredPlayers: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 focus:border-[#2c5aa0]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Info (Optional)
            </label>
            <input
              type="text"
              value={formData.contactInfo || ''}
              onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
              placeholder="e.g., Phone number or email for coordination"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 focus:border-[#2c5aa0]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.additionalNotes || ''}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              placeholder="Any additional information about the match..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 focus:border-[#2c5aa0]"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/player/matchmaking')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#2c5aa0] text-white rounded-lg hover:bg-[#1e3d6f] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateMatch

