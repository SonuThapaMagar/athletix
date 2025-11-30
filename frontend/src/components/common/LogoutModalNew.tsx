import { MdLogout, MdWarning } from 'react-icons/md'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <MdLogout className="w-5 h-5 text-red-600" />
            </div>
            <DialogTitle>Logout Confirmation</DialogTitle>
          </div>
        </DialogHeader>

        <div className="mb-6">
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <MdWarning className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-900 mb-1">Are you sure you want to logout?</h4>
              <DialogDescription>
                You will need to sign in again to access your account and continue booking sports venues.
              </DialogDescription>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p className="mb-2">Before you leave, make sure you have:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-500">
              <li>Saved any pending bookings</li>
              <li>Completed any ongoing transactions</li>
              <li>Downloaded any important documents</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <MdLogout className="w-4 h-4" />
            Logout
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

export default LogoutModal
