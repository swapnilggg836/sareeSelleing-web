
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'order' | 'contact' | 'subscription' | 'issue';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const API_BASE_URL = 'http://localhost:5000';

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/admin/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setNotifications(result.data || []);
        setUnreadCount(result.data?.filter((n: Notification) => !n.read).length || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, []);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    fetchNotifications();
    
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Listen for new notifications and show toast
  const checkForNewNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/admin/notifications/latest`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const newNotifications = result.data || [];
        
        // Check if there are new notifications since last fetch
        newNotifications.forEach((notification: Notification) => {
          const exists = notifications.find(n => n.id === notification.id);
          if (!exists) {
            // Show toast for new notification
            toast.success(notification.title, {
              description: notification.message,
              duration: 5000,
            });
            
            // Add to notifications list
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
          }
        });
      }
    } catch (error) {
      console.error('Error checking for new notifications:', error);
    }
  }, [notifications]);

  // Check for new notifications every 15 seconds
  useEffect(() => {
    const interval = setInterval(checkForNewNotifications, 15000);
    return () => clearInterval(interval);
  }, [checkForNewNotifications]);

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`${API_BASE_URL}/admin/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`${API_BASE_URL}/admin/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
};
