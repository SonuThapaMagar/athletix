import { useState } from 'react'
import {
  MdCheckCircle,
  MdCancel,
  MdFlag,
  MdComment,
  MdImage,
  MdDescription
} from 'react-icons/md'

const ContentModeration = () => {
  const [selectedFilter, setSelectedFilter] = useState('all')

  const filters = [
    { id: 'all', label: 'All Content', count: 23 },
    { id: 'reports', label: 'Reported', count: 8 },
    { id: 'pending', label: 'Pending', count: 12 },
    { id: 'approved', label: 'Approved', count: 3 }
  ]

  const contentItems = [
    {
      id: 1,
      type: 'review',
      author: 'John Doe',
      venue: 'Elite Sports Complex',
      content: 'Great venue! Had an amazing time playing football here.',
      reason: 'Spam',
      reportedBy: 'Sarah Wilson',
      status: 'pending',
      reportedAt: '2024-12-15'
    },
    {
      id: 2,
      type: 'comment',
      author: 'Mike Chen',
      venue: 'City Sports Center',
      content: 'Overpriced and terrible service',
      reason: 'Inappropriate language',
      reportedBy: 'Emma Brown',
      status: 'pending',
      reportedAt: '2024-12-16'
    },
    {
      id: 3,
      type: 'image',
      author: 'David Lee',
      venue: 'Community Gym',
      content: 'Image uploaded',
      reason: 'Inappropriate content',
      reportedBy: 'Lisa Park',
      status: 'approved',
      reportedAt: '2024-12-14'
    },
    {
      id: 4,
      type: 'description',
      author: 'Admin',
      venue: 'Metro Sports Hub',
      content: 'Updated venue description with incorrect information',
      reason: 'Misleading information',
      reportedBy: 'Tom White',
      status: 'pending',
      reportedAt: '2024-12-17'
    }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'review':
      case 'comment':
        return <MdComment className="w-4 h-4" />
      case 'image':
        return <MdImage className="w-4 h-4" />
      case 'description':
        return <MdDescription className="w-4 h-4" />
      default:
        return <MdFlag className="w-4 h-4" />
    }
  }

  const handleModerate = (id: number, action: 'approve' | 'reject') => {
    console.log(`Moderating content ${id}: ${action}`)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Content Moderation</h2>
        <p className="text-gray-600">Review and moderate reported content</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {filters.map((filter) => (
          <div key={filter.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{filter.count}</p>
                <p className="text-sm text-gray-600">{filter.label}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                filter.id === 'all' ? 'bg-blue-100' :
                filter.id === 'approved' ? 'bg-green-100' :
                filter.id === 'pending' ? 'bg-yellow-100' :
                'bg-red-100'
              }`}>
                <MdFlag className={`w-5 h-5 ${
                  filter.id === 'all' ? 'text-blue-600' :
                  filter.id === 'approved' ? 'text-green-600' :
                  filter.id === 'pending' ? 'text-yellow-600' :
                  'text-red-600'
                }`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                selectedFilter === filter.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Reported Content</h3>
        
        <div className="space-y-4">
          {contentItems.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">{item.author}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-sm text-gray-600">{item.venue}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{item.type}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{item.content}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Reported by: {item.reportedBy}</span>
                      <span>Reason: {item.reason}</span>
                      <span>Date: {item.reportedAt}</span>
                    </div>
                  </div>
                </div>
              </div>
              {item.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleModerate(item.id, 'approve')}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MdCheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleModerate(item.id, 'reject')}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MdCancel className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
              {item.status === 'approved' && (
                <div className="pt-4 border-t border-gray-100">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium cursor-pointer">
                    Approved
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ContentModeration
