import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  MdCheckCircle,
  MdCancel,
  MdFlag,
  MdComment,
  MdImage,
  MdDescription
} from 'react-icons/md'
import type { StateType } from '@/redux/slices'
import { FETCH_ADMIN_CONTENT_ITEMS_ACTION, MODERATE_CONTENT_ACTION } from '@/redux/actions/admin/content.actions'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

const ContentModeration = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const { contentItems, loading, error } = useSelector(
    (state: StateType) => state.adminContentSlice
  )

  useEffect(() => {
    FETCH_ADMIN_CONTENT_ITEMS_ACTION({
      status: selectedFilter !== 'all' ? selectedFilter : undefined,
    }).catch((err) => {
      console.error('Failed to fetch content items:', err)
      toast.error('Failed to load content items')
    })
  }, [selectedFilter])

  const filters = [
    { id: 'all' as const, label: 'All Content' },
    { id: 'pending' as const, label: 'Pending' },
    { id: 'approved' as const, label: 'Approved' },
    { id: 'rejected' as const, label: 'Rejected' }
  ]

  const filteredContent = useMemo(() => {
    if (selectedFilter === 'all') return contentItems
    return contentItems.filter(item => item.status === selectedFilter)
  }, [contentItems, selectedFilter])

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

  const handleModerate = async (id: number, action: 'approve' | 'reject') => {
    try {
      await MODERATE_CONTENT_ACTION(id, action)
      toast.success(`Content ${action === 'approve' ? 'approved' : 'rejected'} successfully`)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || `Failed to ${action} content`)
    }
  }

  const getStatusCount = (status: 'all' | 'pending' | 'approved' | 'rejected') => {
    if (status === 'all') return contentItems.length
    return contentItems.filter(item => item.status === status).length
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Content Moderation</h2>
        <p className="text-gray-600">Review and moderate reported content</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))
        ) : (
          filters.map((filter) => (
            <div key={filter.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{getStatusCount(filter.id)}</p>
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
          ))
        )}
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
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Reported Content ({filteredContent.length})</h3>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No content items found
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContent.map((item) => (
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
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Approved
                  </span>
                </div>
              )}
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ContentModeration
