import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  MdArrowBack,
  MdSearch,
  MdEdit,
  MdDelete,
  MdBlock,
  MdCheckCircle,
  MdPerson,
  MdEmail,
  MdCalendarToday,
  MdMoreVert
} from 'react-icons/md'

const UserManagement = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')

  const roles = [
    { id: 'all', label: 'All Users' },
    { id: 'player', label: 'Players' },
    { id: 'venue_owner', label: 'Venue Owners' },
    { id: 'admin', label: 'Admins' }
  ]

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
            <h1 className="text-xl font-semibold text-gray-900">User Management</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedRole === role.id
                      ? 'bg-[#2c5aa0] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Users</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  {
                    id: 1,
                    name: "John Doe",
                    email: "john.doe@example.com",
                    role: "Player",
                    status: "Active",
                    joined: "Jan 15, 2023",
                    avatar: "JD"
                  },
                  {
                    id: 2,
                    name: "Sarah Wilson",
                    email: "sarah.wilson@example.com",
                    role: "Venue Owner",
                    status: "Active",
                    joined: "Feb 20, 2023",
                    avatar: "SW"
                  },
                  {
                    id: 3,
                    name: "Mike Chen",
                    email: "mike.chen@example.com",
                    role: "Player",
                    status: "Suspended",
                    joined: "Mar 10, 2023",
                    avatar: "MC"
                  },
                  {
                    id: 4,
                    name: "Elite Sports Complex",
                    email: "contact@elitesports.com",
                    role: "Venue Owner",
                    status: "Pending",
                    joined: "Apr 5, 2023",
                    avatar: "ES"
                  }
                ].map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{user.avatar}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'Player' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'Venue Owner' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' :
                        user.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.joined}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-[#2c5aa0] hover:text-[#1e3d6f] transition-colors">
                          <MdEdit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700 transition-colors">
                          <MdBlock className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 transition-colors">
                          <MdMoreVert className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManagement
