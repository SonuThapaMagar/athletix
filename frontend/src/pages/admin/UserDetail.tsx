import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdArrowBack, MdEdit, MdDelete } from "react-icons/md";
import type { StateType } from "@/redux/slices";
import {
  FETCH_ADMIN_USER_BY_ID_ACTION,
  DELETE_ADMIN_USER_ACTION,
} from "@/redux/actions/admin/user.actions";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { selectedUser, loading, error } = useSelector(
    (state: StateType) => state.adminUserSlice,
  );

  useEffect(() => {
    if (id) {
      FETCH_ADMIN_USER_BY_ID_ACTION(Number(id)).catch((err) => {
        console.error("Failed to fetch user:", err);
        toast.error("Failed to load user details");
      });
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, "0")}, ${date.getFullYear()}`;
    } catch {
      return dateString;
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await DELETE_ADMIN_USER_ACTION(selectedUser.id);
      toast.success("User deleted successfully");
      navigate("/admin/users");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-64 mb-6" /><br />
        <Skeleton className="h-32 w-full" /><br />
        <Skeleton className="h-32 w-full" /><br />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error || !selectedUser) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error || "User not found"}</p>
        </div>
        <button
          onClick={() => navigate("/admin/users")}
          className="mt-4 text-primary hover:primary cursor-pointer"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-primary mb-4"
        >
          <MdArrowBack className="w-5 h-5" />
          <span>Back to Users</span>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
            <p className="text-gray-600">View and manage user information</p>
          </div>
          {/* <div className="flex gap-2">
            <button
              onClick={() => navigate(`/admin/users/edit/${selectedUser.id}`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <MdEdit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <MdDelete className="w-4 h-4" />
              Delete
            </button>
          </div> */}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {selectedUser.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {selectedUser.name}
            </h3>
            <p className="text-gray-600">{selectedUser.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Role</p>
            <p className="text-sm font-medium text-gray-900">
              {selectedUser.role}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <p className="text-sm font-medium text-gray-900">
              {selectedUser.status}
            </p>
          </div>
          {selectedUser.phone && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Phone</p>
              <p className="text-sm font-medium text-gray-900">
                {selectedUser.phone}
              </p>
            </div>
          )}
          {selectedUser.location && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Location</p>
              <p className="text-sm font-medium text-gray-900">
                {selectedUser.location}
              </p>
            </div>
          )}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Joined</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(selectedUser.createdAt)}
            </p>
          </div>
          {selectedUser.updatedAt && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Last Updated</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(selectedUser.updatedAt)}
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              user "{selectedUser.name}".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setDeleteOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDetail;
