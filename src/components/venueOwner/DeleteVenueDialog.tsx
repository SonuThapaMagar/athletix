import { MdDelete, MdWarning } from 'react-icons/md'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'

interface DeleteVenueDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  venueName?: string
  isLoading?: boolean
}

const DeleteVenueDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  venueName = 'this venue',
  isLoading = false 
}: DeleteVenueDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <MdDelete className="w-5 h-5 text-red-600" />
            </div>
            <DialogTitle>Delete Venue</DialogTitle>
          </div>
        </DialogHeader>

        <div className="mb-6">
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <MdWarning className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-900 mb-1">Are you sure you want to delete "{venueName}"?</h4>
              <DialogDescription className="text-red-700">
                This action cannot be undone. All bookings, reviews, and data associated with this venue will be permanently deleted.
              </DialogDescription>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p className="mb-2">Before deleting, consider:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-500">
              <li>All future bookings will be cancelled</li>
              <li>Customer reviews will be lost</li>
              <li>Revenue data will be removed</li>
              <li>This action cannot be reversed</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <MdDelete className="w-4 h-4" />
                Delete Venue
              </>
            )}
          </button>
        </DialogFooter>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@athletix.com" className="text-[#2c5aa0] hover:underline">
              support@athletix.com
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteVenueDialog

