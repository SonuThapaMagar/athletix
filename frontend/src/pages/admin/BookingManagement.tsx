import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MdCalendarToday,
  MdAttachMoney,
  MdVisibility,
  MdSearch,
  MdLocationOn,
  MdFileDownload
} from 'react-icons/md'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { StateType } from "@/redux/slices";
import { FETCH_ADMIN_BOOKINGS_ACTION } from "@/redux/actions/admin/booking.actions";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { toast } from "sonner";

const BookingManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "PENDING" | "CONFIRMED" | "CANCELLED"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const { bookings, loading, pagination } = useSelector(
    (state: StateType) => state.adminBookingSlice,
  );

  const filters = [
    { id: "all" as const, label: "All Bookings" },
    { id: "PENDING" as const, label: "Pending" },
    { id: "CONFIRMED" as const, label: "Confirmed" },
    { id: "CANCELLED" as const, label: "Cancelled" },
  ];

  // Export to Excel
  const exportToExcel = () => {
    if (bookings.length === 0) {
      toast.error("No bookings to export");
      return;
    }

    setIsExporting(true);
    try {
      const excelData = bookings.map((booking) => ({
        "Booking ID": booking.id,
        Venue: booking.venueName,
        Player: booking.playerName,
        Email: booking.playerEmail,
        Sport: booking.sport,
        Date: new Date(booking.startTime).toLocaleDateString(),
        Time: `${new Date(booking.startTime).toLocaleTimeString()} - ${new Date(booking.endTime).toLocaleTimeString()}`,
        Amount: booking.amount,
        Paid: booking.paid ? "Yes" : "No",
        Status: booking.status,
        "Booking Ref": booking.bookingRefId || "N/A",
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      worksheet["!cols"] = [
        { wch: 12 },
        { wch: 20 },
        { wch: 15 },
        { wch: 18 },
        { wch: 12 },
        { wch: 12 },
        { wch: 25 },
        { wch: 12 },
        { wch: 8 },
        { wch: 12 },
        { wch: 12 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
      XLSX.writeFile(
        workbook,
        `bookings-export-${new Date().toISOString().split("T")[0]}.xlsx`
      );

      toast.success("Bookings exported to Excel successfully");
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Failed to export bookings");
    } finally {
      setIsExporting(false);
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    if (bookings.length === 0) {
      toast.error("No bookings to export");
      return;
    }

    setIsExporting(true);
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Bookings Report", 14, 10);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 18);

      const tableData = bookings.map((booking) => [
        booking.id,
        booking.venueName,
        booking.playerName,
        booking.playerEmail,
        booking.sport,
        new Date(booking.startTime).toLocaleDateString(),
        booking.amount.toString(),
        booking.paid ? "Yes" : "No",
        booking.status,
      ]);

      autoTable(doc, {
        head: [
          [
            "Booking ID",
            "Venue",
            "Player",
            "Email",
            "Sport",
            "Date",
            "Amount",
            "Paid",
            "Status",
          ],
        ],
        body: tableData,
        startY: 25,
        theme: "grid",
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 25 },
          2: { cellWidth: 18 },
          3: { cellWidth: 20 },
          4: { cellWidth: 12 },
          5: { cellWidth: 15 },
          6: { cellWidth: 12 },
          7: { cellWidth: 10 },
          8: { cellWidth: 12 },
        },
      });

      doc.save(`bookings-export-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("Bookings exported to PDF successfully");
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Failed to export bookings");
    } finally {
      setIsExporting(false);
    }
  };

  // Fetch bookings on component mount and when filters change
  useEffect(() => {
    setCurrentPage(1);
    FETCH_ADMIN_BOOKINGS_ACTION({
      status: selectedFilter !== "all" ? selectedFilter : undefined,
      search: searchQuery || undefined,
      page: 1,
      perPage: 10,
    }).catch((err) => {
      console.error("Failed to fetch bookings:", err);
      toast.error("Failed to load bookings");
    });
  }, [selectedFilter, searchQuery]);

  // Fetch bookings when page changes
  useEffect(() => {
    if (currentPage > 1) {
      FETCH_ADMIN_BOOKINGS_ACTION({
        status: selectedFilter !== "all" ? selectedFilter : undefined,
        search: searchQuery || undefined,
        page: currentPage,
        perPage: 10,
      }).catch((err) => {
        console.error("Failed to fetch bookings:", err);
        toast.error("Failed to load bookings");
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

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutesStr = minutes.toString().padStart(2, "0");
      return `${hours}:${minutesStr} ${ampm}`;
    } catch {
      return dateString;
    }
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NRP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "FAILED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const filteredBookings = useMemo(() => {
    // Client-side search filter within the current page
    const bookingsList = bookings || [];
    if (!searchQuery.trim()) {
      return bookingsList;
    }
    return bookingsList.filter((booking) => {
      const matchesSearch =
        !searchQuery.trim() ||
        booking.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.playerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [bookings, searchQuery]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
          <p className="text-gray-600">Manage all bookings across the platform</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            disabled={isExporting || loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Export to Excel"
          >
            <MdFileDownload className="w-4 h-4" />
            {isExporting ? "Exporting..." : "Excel"}
          </button>
          <button
            onClick={exportToPDF}
            disabled={isExporting || loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Export to PDF"
          >
            <MdFileDownload className="w-4 h-4" />
            {isExporting ? "Exporting..." : "PDF"}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by venue, player name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  selectedFilter === filter.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            All Bookings ({pagination?.total_record || 0})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Venue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4">
                    <Skeleton className="h-24 w-full" /><br />
                    <Skeleton className="h-24 w-full" /><br />
                    <Skeleton className="h-24 w-full" /><br />
                    <Skeleton className="h-24 w-full" /><br />
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <MdCalendarToday className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{booking.id}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.sport}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <MdLocationOn className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {booking.venueName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.playerName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.playerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.startTime)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTimeRange(booking.startTime, booking.endTime)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <MdAttachMoney className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(booking.amount)}
                        </span>
                        {booking.paid && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            Paid
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}
                      >
                        {getStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() =>
                          navigate(`/admin/bookings/${booking.id}`)
                        }
                        className="text-primary/90 hover:text-primary transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <MdVisibility className="w-5 h-5" />
                      </button>
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
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(currentPage - 1);
                      }}
                    />
                  </PaginationItem>
                )}

                {/* Page numbers with ellipsis */}
                {Array.from(
                  { length: pagination.total_page },
                  (_, i) => i + 1,
                ).map((page) => {
                  // Show first page, last page, current page and adjacent pages
                  const isVisible =
                    page === 1 ||
                    page === pagination.total_page ||
                    Math.abs(page - currentPage) <= 1;

                  if (!isVisible) {
                    return null;
                  }

                  // Show ellipsis before
                  if (
                    page > 1 &&
                    page - 1 > 1 &&
                    Math.abs(page - currentPage) > 2
                  ) {
                    return (
                      <PaginationItem key={`ellipsis-${page}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {currentPage < pagination.total_page && (
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;
