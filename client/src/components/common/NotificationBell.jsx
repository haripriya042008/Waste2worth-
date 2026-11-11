import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Clock, ExternalLink } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { formatRelativeTime } from '../../utils/formatters';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-brand-700 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-slate-800">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-brand-100 text-brand-800 text-xs px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-brand-600 hover:text-brand-800 flex items-center font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5 mr-1" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.isRead && markAsRead(n._id)}
                  className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                    !n.isRead ? 'bg-brand-50/40' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h5
                      className={`text-xs font-semibold ${
                        !n.isRead ? 'text-brand-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      {n.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 flex items-center whitespace-nowrap ml-2">
                      <Clock className="w-2.5 h-2.5 mr-0.5" />
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>

                  {n.relatedDonationId && (
                    <div className="mt-2 flex justify-end">
                      <Link
                        to={`/donations/${n.relatedDonationId}`}
                        onClick={() => setIsOpen(false)}
                        className="text-[11px] text-brand-600 hover:text-brand-800 flex items-center font-medium"
                      >
                        View Donation <ExternalLink className="w-2.5 h-2.5 ml-1" />
                      </Link>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
