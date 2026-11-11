import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { MonthlyTrendChart, CategoryBreakdownBar, ImpactProgress } from '../../components/charts/DashboardCharts';
import { BarChart3, TrendingUp, Users, Utensils, ShieldCheck, Package } from 'lucide-react';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await analyticsService.getAdminAnalytics();
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        Generating platform analytics...
      </div>
    );
  }

  const counts = analytics?.statusCounts || {};

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Executive Data Intelligence
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Platform Analytics & Impact Reports</h1>
        <p className="text-xs text-slate-500">
          High-fidelity breakdown of food rescue volume, hunger alleviation throughput, and logistical velocity.
        </p>
      </div>

      {/* Top Impact Rings */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-8">
        <ImpactProgress
          value={analytics?.totalDonations || 0}
          max={100}
          label="Total Contributions"
          subtext="Cumulative donation submissions"
        />
        <ImpactProgress
          value={analytics?.verifiedCharities || 0}
          max={Math.max(analytics?.totalCharities || 10, 10)}
          label="Charity Trust Rate"
          subtext={`${analytics?.verifiedCharities} of ${analytics?.totalCharities} verified`}
        />
        <ImpactProgress
          value={counts.Completed || 0}
          max={Math.max(analytics?.totalDonations || 10, 10)}
          label="Fulfillment Ratio"
          subtext={`${counts.Completed || 0} batches delivered to families`}
        />
      </div>

      {/* Monthly Chart and Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Monthly Contribution Velocity</h3>
            <span className="text-xs font-semibold text-brand-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              Real Time
            </span>
          </div>
          <MonthlyTrendChart trends={analytics?.monthlyTrends || []} />
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Categories Rescued</h3>
          <CategoryBreakdownBar categories={analytics?.categoryBreakdown || []} />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
