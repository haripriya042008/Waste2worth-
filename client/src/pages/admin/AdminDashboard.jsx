import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { StatCard } from '../../components/common/StatCard';
import { MonthlyTrendChart, CategoryBreakdownBar } from '../../components/charts/DashboardCharts';
import { formatDate } from '../../utils/formatters';
import {
  Users,
  Building2,
  Package,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Utensils,
  Activity,
  ArrowRight,
  TrendingUp,
  MapPin,
  AlertTriangle
} from 'lucide-react';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsService.getAdminAnalytics();
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to load admin analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        Loading administrator dashboard...
      </div>
    );
  }

  const counts = analytics?.statusCounts || {};

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              System Administrator Command Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Platform Health & Overview</h1>
          <p className="text-xs text-slate-400 max-w-lg">
            Monitor real-time donations, review pending charity applications, audit activity logs, and manage civic distribution points.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/charities"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs shadow-md transition flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span>Verify Charities ({analytics?.pendingCharities || 0} Pending)</span>
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition flex items-center space-x-1.5 border border-slate-700"
          >
            <Users className="w-4 h-4 text-slate-400" />
            <span>User Directory</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Users"
          value={analytics?.totalUsers || 0}
          subtext={`${analytics?.totalDonors || 0} donors • ${analytics?.totalCharities || 0} charities`}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Verified Charities"
          value={analytics?.verifiedCharities || 0}
          subtext={`${analytics?.pendingCharities || 0} awaiting approval`}
          icon={ShieldCheck}
          color="brand"
        />
        <StatCard
          title="Total Food Rescued"
          value={`${analytics?.totalQuantity || 0} units`}
          subtext={`~${analytics?.totalEstimatedServings || 0} meals delivered`}
          icon={Utensils}
          color="amber"
        />
        <StatCard
          title="Active Donations"
          value={counts.Available + counts.Accepted || 0}
          subtext={`${counts.Completed || 0} successfully completed`}
          icon={Package}
          color="teal"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">System Donation Trends</h3>
              <p className="text-xs text-slate-500">Historical monthly food donation volume across the platform</p>
            </div>
            <span className="text-xs font-semibold text-brand-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              Live MongoDB Data
            </span>
          </div>
          <MonthlyTrendChart trends={analytics?.monthlyTrends || []} />
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Most Donated Categories</h3>
            <p className="text-xs text-slate-500">Volume proportion by food classification</p>
          </div>
          <CategoryBreakdownBar categories={analytics?.categoryBreakdown || []} />
        </div>
      </div>

      {/* Real-time Activity Stream & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown Pills */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Lifecycle Status Breakdown</h3>
          <div className="space-y-2.5">
            {Object.entries(counts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-semibold text-slate-700">{status}</span>
                <span className="font-extrabold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Log */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-800">Live System Activity Stream</h3>
            </div>
            <Link
              to="/admin/activities"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center space-x-1"
            >
              <span>Full Audit Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {!analytics?.recentActivities || analytics.recentActivities.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No activity recorded yet.</p>
            ) : (
              analytics.recentActivities.map((act) => (
                <div key={act._id} className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start justify-between text-xs">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-800">{act.description}</p>
                    <span className="text-[10px] text-slate-400">
                      Initiated by {act.userId?.name || 'System'} ({act.userId?.role || 'user'})
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                    {formatDate(act.timestamp)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
