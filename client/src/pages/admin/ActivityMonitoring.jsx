import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { formatDate } from '../../utils/formatters';
import { Activity, Clock, ShieldCheck, User, Package, Search } from 'lucide-react';

const ActivityMonitoring = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const res = await analyticsService.getAdminAnalytics();
        setActivities(res.data?.recentActivities || []);
      } catch (err) {
        console.error('Failed to load activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const filtered = activities.filter((act) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      act.description.toLowerCase().includes(term) ||
      act.userId?.name?.toLowerCase().includes(term) ||
      act.activityType?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Security & Audit Governance
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Platform Activity Audit Log</h1>
        <p className="text-xs text-slate-500">
          Immutable audit record of all user, donation, and administrative system actions.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activities by user or action..."
            className="w-full text-xs rounded-xl border border-slate-200 pl-9 pr-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading audit log...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No activity events found.</div>
          ) : (
            filtered.map((act) => (
              <div key={act._id} className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors flex items-start justify-between text-xs">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-brand-50 text-brand-700 font-bold mt-0.5">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">{act.description}</p>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1 text-slate-400" />
                        {act.userId?.name || 'System User'} ({act.userId?.role || 'user'})
                      </span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {act.activityType}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 whitespace-nowrap ml-4 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(act.timestamp)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityMonitoring;
