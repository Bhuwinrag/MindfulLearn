import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications');
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every 60 seconds
    return () => clearInterval(interval);
  }, [user]);

  const handleOpen = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      try {
        await api.put('/notifications/read');
        // Optimistically update the UI
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      } catch (error) {
        console.error('Failed to mark notifications as read', error);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button onClick={handleOpen} className="relative text-gray-300 hover:text-white">
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-800"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
          <div className="p-4 font-bold text-white border-b border-slate-700">Notifications</div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notif => (
                <Link
                  key={notif._id}
                  to={notif.link}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 hover:bg-slate-700"
                >
                  <p className={`text-sm ${!notif.isRead ? 'text-white' : 'text-slate-400'}`}>{notif.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                </Link>
              ))
            ) : (
              <p className="text-slate-400 p-4">No new notifications.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;