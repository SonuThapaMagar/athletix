import { MdLogout } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <MdLogout className="w-5 h-5 text-primary/100" />
            </div>
            <DialogTitle>Logout Confirmation</DialogTitle>
          </div>
        </DialogHeader>

        <div className="mb-6">
          <div className="flex items-start gap-3 p-4 rounded-lg">
            <div>
              <h4 className="font-medium text-black mb-1">
                Are you sure you want to logout?
              </h4>
            </div>
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-3xl hover:bg-gray-50 transition-colors font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-primary text-white rounded-3xl hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer"
          >
            <MdLogout className="w-4 h-4" />
            Logout
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutModal;
