import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/analyticsService';
import { StatCard } from '../../components/common/StatCard';
import { MonthlyTrendChart, CategoryBreakdownBar } from '../../components/charts/DashboardCharts';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';
import {
  Package,
  PlusCircle,
  Clock,
  CheckCircle2,
  Users,
  Utensils,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsService.getDonorAnalytics();
        setAnalytics(res.data);
      } catch (err) {
        console.error('Error loading donor analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-slate-500">
        Loading donor dashboard...
      </div>
    );
  }

  const counts = analytics?.statusCounts || {};

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-200">
            Donor Operations Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs text-brand-100 max-w-lg">
            Track your surplus food donations, discover verified shelters, and monitor how many meals reached families in need.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/donor/create-donation"
            className="px-5 py-2.5 rounded-xl bg-white text-brand-900 font-semibold text-xs shadow-md hover:bg-brand-50 transition-all flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4 text-brand-600" />
            <span>Post Surplus Food</span>
          </Link>
          <Link
            to="/donor/nearby-charities"
            className="px-4 py-2.5 rounded-xl bg-brand-800/80 text-white font-medium text-xs hover:bg-brand-800 transition-colors flex items-center space-x-1.5 border border-brand-500/30"
          >
            <MapPin className="w-4 h-4 text-brand-300" />
            <span>Nearby Charities</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Donations"
          value={analytics?.totalDonations || 0}
          subtext="Lifetime contributions"
          icon={Package}
          color="brand"
        />
        <StatCard
          title="Surplus Food Saved"
          value={`${analytics?.totalQuantity || 0} units`}
          subtext="Volume rescued"
          icon={Utensils}
          color="blue"
        />
        <StatCard
          title="Estimated Meals Served"
          value={`~${analytics?.totalEstimatedServings || 0}`}
          subtext="Beneficiary portions"
          icon={Users}
          color="amber"
        />
        <StatCard
          title="Completed Distributions"
          value={counts.Completed || 0}
          subtext={`${counts.Accepted || 0} pending pickup`}
          icon={CheckCircle2}
          color="teal"
        />
      </div>

      {/* Middle Row: Analytics Graphs & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Donation Activity */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Donation Volume Trends</h3>
              <p className="text-xs text-slate-500">Monthly submissions and estimated meal portions</p>
            </div>
            <div className="flex items-center space-x-1 text-xs text-brand-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real-Time Logs</span>
            </div>
          </div>
          <MonthlyTrendChart trends={analytics?.monthlyTrends || []} />
        </div>

        {/* Categories Rescued */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Food Categories Rescued</h3>
            <p className="text-xs text-slate-500">Breakdown of donated food types</p>
          </div>
          <CategoryBreakdownBar categories={analytics?.categoryBreakdown || []} />
        </div>
      </div>

      {/* Recent Donations Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Recent Food Donations</h3>
            <p className="text-xs text-slate-500">Latest submissions and recipient organizations</p>
          </div>
          <Link
            to="/donor/my-donations"
            className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Food Item</th>
                <th className="py-3 px-6">Quantity</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Recipient Charity</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {!analytics?.recentDonations || analytics.recentDonations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No donations posted yet.{' '}
                    <Link to="/donor/create-donation" className="text-brand-600 font-semibold hover:underline">
                      Post your first surplus meal!
                    </Link>
                  </td>
                </tr>
              ) : (
                analytics.recentDonations.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      <Link to={`/donations/${d._id}`} className="hover:text-brand-600">
                        {d.foodName}
                      </Link>
                    </td>
                    <td className="py-3.5 px-6 font-medium text-slate-600">
                      {d.quantity} {d.quantityUnit}
                      <span className="text-[10px] text-slate-400 block">(~{d.estimatedServings} servings)</span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">{d.foodCategory}</td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {d.charityId?.organizationName || (
                        <span className="text-slate-400 italic">Awaiting shelter acceptance</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getStatusBadgeClass(d.donationStatus)}`}>
                        {d.donationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500">{formatDate(d.createdAt)}</td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        to={`/donations/${d._id}`}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-800"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
