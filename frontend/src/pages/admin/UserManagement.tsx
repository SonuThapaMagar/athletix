import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdVisibility, MdFileDownload } from "react-icons/md";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import type { StateType } from "@/redux/slices";
import {
  FETCH_ADMIN_USERS_ACTION,
  UPDATE_ADMIN_USER_ACTION,
  DELETE_ADMIN_USER_ACTION,
} from "@/redux/actions/admin/user.actions";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { AdminUser } from "@/types/admin/user.types";

const UserManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<
    "all" | "PLAYER" | "VENUE_OWNER" | "ADMIN"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { users, loading, error, pagination } = useSelector(
    (state: StateType) => state.adminUserSlice,
  );

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Fetch users on component mount and when filters change
  useEffect(() => {
    setCurrentPage(1);
    FETCH_ADMIN_USERS_ACTION({
      role: selectedRole !== "all" ? selectedRole : undefined,
      search: searchQuery || undefined,
      page: 1,
      perPage: 10,
    }).catch((err) => {
      console.error("Failed to fetch users:", err);
    });
  }, [selectedRole, searchQuery]);

  // Fetch users when page changes
  useEffect(() => {
    if (currentPage > 1) {
      FETCH_ADMIN_USERS_ACTION({
        role: selectedRole !== "all" ? selectedRole : undefined,
        search: searchQuery || undefined,
        page: currentPage,
        perPage: 10,
      }).catch((err) => {
        console.error("Failed to fetch users:", err);
      });
    }
  }, [currentPage]);

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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "PLAYER":
        return "Player";
      case "VENUE_OWNER":
        return "Venue Owner";
      case "ADMIN":
        return "Admin";
      default:
        return role;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Active";
      case "SUSPENDED":
        return "Suspended";
      case "PENDING":
        return "Pending";
      case "INACTIVE":
        return "Inactive";
      default:
        return status;
    }
  };

  const handleView = (user: any) => {
    // Navigate to user detail page
    navigate(`/admin/users/${user.id}`);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      await UPDATE_ADMIN_USER_ACTION(editingUser.id, {
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        location: editingUser.location,
        role: editingUser.role,
        status: editingUser.status,
      });
      toast.success("User updated successfully");
      setEditingUser(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update user");
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await DELETE_ADMIN_USER_ACTION(selectedUser.id);
      toast.success("User deleted successfully");
      setDeleteOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete user");
    }
  };

  const exportToExcel = () => {
    if (users.length === 0) {
      toast.error("No data to export");
      return;
    }

    const excelData = users.map((user) => ({
      ID: user.id,
      Name: user.name,
      Email: user.email,
      Phone: user.phone || "N/A",
      Location: user.location || "N/A",
      Role: getRoleLabel(user.role),
      Status: getStatusLabel(user.status),
      "Joined Date": formatDate(user.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // Set column widths
    worksheet["!cols"] = [
      { wch: 8 },
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 12 },
      { wch: 15 },
    ];

    XLSX.writeFile(
      workbook,
      `users-export-${new Date().toISOString().split("T")[0]}.xlsx`,
    );
    toast.success("Users exported to Excel successfully");
  };

  const exportToPDF = () => {
    if (users.length === 0) {
      toast.error("No data to export");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add title
    doc.setFontSize(16);
    doc.text("Users Report", pageWidth / 2, 15, { align: "center" });

    // Add generation date
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      pageWidth / 2,
      22,
      { align: "center" },
    );

    // Prepare table data
    const tableData = users.map((user) => [
      user.id.toString(),
      user.name,
      user.email,
      user.phone || "N/A",
      user.location || "N/A",
      getRoleLabel(user.role),
      getStatusLabel(user.status),
      formatDate(user.createdAt),
    ]);

    // Add table
    autoTable(doc, {
      head: [
        [
          "ID",
          "Name",
          "Email",
          "Phone",
          "Location",
          "Role",
          "Status",
          "Joined Date",
        ],
      ],
      body: tableData,
      startY: 30,
      margin: { top: 30, right: 10, bottom: 10, left: 10 },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [44, 90, 160],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 28 },
        2: { cellWidth: 35 },
        3: { cellWidth: 25 },
        4: { cellWidth: 28 },
        5: { cellWidth: 20 },
        6: { cellWidth: 18 },
        7: { cellWidth: 25 },
      },
    });

    doc.save(`users-export-${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("Users exported to PDF successfully");
  };

  const roles = [
    { id: "all" as const, label: "All Users" },
    { id: "PLAYER" as const, label: "Players" },
    { id: "VENUE_OWNER" as const, label: "Venue Owners" },
  ];

  return (
    <div className="p-6">
      {editingUser ? (
        /* Edit Form */
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit User</h2>
            <p className="text-gray-600">Update user information</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 focus:border-[#2c5aa0]"
                  placeholder="Enter user name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 focus:border-[#2c5aa0]"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      role: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 focus:border-[#2c5aa0]"
                >
                  <option value="PLAYER">Player</option>
                  <option value="VENUE_OWNER">Venue Owner</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={editingUser.status}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      status: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 focus:border-[#2c5aa0]"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="PENDING">Pending</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancelEdit}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 bg-[#2c5aa0] text-white rounded-lg hover:bg-[#1e3d6f] transition-colors font-medium cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

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
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      selectedRole === role.id
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Users</h2>
                <div className="flex gap-2">
                  <button
                    onClick={exportToExcel}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium cursor-pointer text-sm"
                    title="Export to Excel"
                  >
                    <MdFileDownload className="w-4 h-4" />
                    Export Excel
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium cursor-pointer text-sm"
                    title="Export to PDF"
                  >
                    <MdFileDownload className="w-4 h-4" />
                    Export PDF
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4">
                        <Skeleton className="h-22 w-full" />
                        <br />
                        <Skeleton className="h-22 w-full" />
                        <br />
                        <Skeleton className="h-22 w-full" />
                        <br /> <Skeleton className="h-22 w-full" />
                        <br />
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {user.name?.charAt(0).toUpperCase() || "U"}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.role === "PLAYER"
                                ? "bg-blue-100 text-blue-800"
                                : user.role === "VENUE_OWNER"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : user.status === "SUSPENDED"
                                  ? "bg-red-100 text-red-800"
                                  : user.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {getStatusLabel(user.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.createdAt ? formatDate(user.createdAt) : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleView(user)}
                              className="text-gray-600 hover:text-[#1e3d6f] transition-colors cursor-pointer"
                              title="View"
                            >
                              <MdVisibility className="w-4 h-4" />
                            </button>
                            {/* <button
                            onClick={() => handleEdit(user)}
                            className="text-[#2c5aa0] hover:text-[#1e3d6f] transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <MdEdit className="w-4 h-4" />
                          </button> */}
                            {/* <button
                            onClick={() => handleDelete(user)}
                            className="text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <MdDelete className="w-4 h-4" />
                          </button> */}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && pagination && pagination.total_page > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {pagination.total_page} • Showing {users.length} of {pagination.total_record} users
                </div>
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(currentPage - 1)
                          }}
                        />
                      </PaginationItem>
                    )}

                    {/* Page numbers with ellipsis */}
                    {Array.from({ length: pagination.total_page }, (_, i) => i + 1).map((page) => {
                      const isVisible =
                        page === 1 ||
                        page === pagination.total_page ||
                        Math.abs(page - currentPage) <= 1

                      if (!isVisible) {
                        return null
                      }

                      if (
                        page > 1 &&
                        page - 1 > 1 &&
                        Math.abs(page - currentPage) > 2
                      ) {
                        return <PaginationItem key={`ellipsis-${page}`}><PaginationEllipsis /></PaginationItem>
                      }

                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentPage(page)
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}

                    {currentPage < pagination.total_page && (
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(currentPage + 1)
                          }}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </>
      )}

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              user
              {selectedUser ? ` "${selectedUser.name}"` : ""}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-end mt-6">
            <button
              onClick={() => setDeleteOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
