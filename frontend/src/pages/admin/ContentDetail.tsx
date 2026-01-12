import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { MdArrowBack, MdCheckCircle, MdCancel } from 'react-icons/md'
import type { StateType } from '@/redux/slices'
import { FETCH_ADMIN_CONTENT_ITEMS_ACTION, MODERATE_CONTENT_ACTION } from '@/redux/actions/admin/content.actions'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

const ContentDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const { contentItems, loading, error } = useSelector(
    (state: StateType) => state.adminContentSlice
  )

  useEffect(() => {
    FETCH_ADMIN_CONTENT_ITEMS_ACTION().catch((err) => {
      console.error('Failed to fetch content items:', err)
      toast.error('Failed to load content details')
    })
  }, [])

  const contentItem = contentItems?.find(item => item.id === Number(id))

  const handleModerate = async (action: 'approve' | 'reject') => {
    if (!contentItem) return
    try {
      await MODERATE_CONTENT_ACTION(contentItem.id, action)
      toast.success(`Content ${action === 'approve' ? 'approved' : 'rejected'} successfully`)
      navigate('/admin/content')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || `Failed to ${action} content`)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error || !contentItem) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error || 'Content not found'}</p>
        </div>
        <button
          onClick={() => navigate('/admin/content')}
          className="mt-4 text-indigo-600 hover:text-indigo-700"
        >
          Back to Content
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/content')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <MdArrowBack className="w-5 h-5" />
          <span>Back to Content</span>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Details</h2>
          <p className="text-gray-600">Review and moderate reported content</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-gray-900">{contentItem.author}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-sm text-gray-600">{contentItem.venue}</span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{contentItem.type}</span>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{contentItem.content}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Reported By</p>
            <p className="text-sm font-medium text-gray-900">{contentItem.reportedBy}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Reason</p>
            <p className="text-sm font-medium text-gray-900">{contentItem.reason}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              contentItem.status === 'approved' ? 'bg-green-100 text-green-800' :
              contentItem.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {contentItem.status}
            </span>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Reported At</p>
            <p className="text-sm font-medium text-gray-900">{contentItem.reportedAt}</p>
          </div>
        </div>

        {contentItem.status === 'pending' && (
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <button
              onClick={() => handleModerate('approve')}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <MdCheckCircle className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={() => handleModerate('reject')}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <MdCancel className="w-4 h-4" />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContentDetail

