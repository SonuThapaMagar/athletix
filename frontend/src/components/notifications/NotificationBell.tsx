// components/notifications/NotificationBell.tsx
import { useState, useEffect } from "react";
import { MdNotifications, MdCheck, MdDelete } from "react-icons/md";
import requests from "@/helper/requests";
import { toast } from "sonner";
import type { INotification } from "@/types/notification.types";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const { data } = await requests.notifications.getUnreadCount();
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await requests.notifications.getUnreadNotifications({ 
        page: 1, 
        perPage: 10 
      });
      setNotifications(data.data);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // Mark as read
  const markAsRead = async (id: number) => {
    try {
      await requests.notifications.markAsRead(id);
      setNotifications(prev => prev.filter(n => n.notificationId !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success("Marked as read");
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await requests.notifications.markAllAsRead();
      setNotifications([]);
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  // Delete notification
  const deleteNotification = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await requests.notifications.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.notificationId !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  // Initial load
  useEffect(() => {
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch full notifications when opened
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
      >
        <MdNotifications className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border z-20 max-h-[500px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No new notifications
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.notificationId}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => markAsRead(notification.notificationId)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded cursor-pointer"
                            title="Mark as read"
                          >
                            <MdCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => deleteNotification(notification.notificationId, e)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                            title="Delete"
                          >
                            <MdDelete className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t text-center">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to full notifications page if you have one
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;