import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Clock, ExternalLink } from 'lucide-react';

const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Real-Time Socket Stream
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Notifications & System Alerts</h1>
          <p className="text-xs text-slate-500">
            Real-time updates regarding donation submissions, acceptance, pickups, and verifications.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <p>You have no notifications at this time.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && markAsRead(n._id)}
              className={`p-5 transition-colors cursor-pointer flex items-start justify-between ${
                !n.isRead ? 'bg-brand-50/50' : 'hover:bg-slate-50/60'
              }`}
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center space-x-2">
                  <h4 className={`text-xs ${!n.isRead ? 'font-bold text-brand-900' : 'font-semibold text-slate-800'}`}>
                    {n.title}
                  </h4>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                {n.relatedDonationId && (
                  <div className="pt-1">
                    <Link
                      to={`/donations/${n.relatedDonationId}`}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center space-x-1"
                    >
                      <span>Inspect Food Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 whitespace-nowrap ml-4 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatRelativeTime(n.createdAt)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
