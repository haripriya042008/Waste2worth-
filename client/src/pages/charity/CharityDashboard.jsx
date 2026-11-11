import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/analyticsService';
import { donationService } from '../../services/donationService';
import { StatCard } from '../../components/common/StatCard';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';
import {
  Building2,
  Package,
  Truck,
  CheckCircle2,
  Users,
  Utensils,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  MapPin,
  Clock
} from 'lucide-react';

const CharityDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [nearbyDonations, setNearbyDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [anRes, donRes] = await Promise.all([
          analyticsService.getCharityAnalytics(),
          donationService.getAvailableDonations({ limit: 4 })
        ]);
        setAnalytics(anRes.data);
        setNearbyDonations(donRes.data || []);
      } catch (err) {
        console.error('Error fetching charity dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        Loading organization dashboard...
      </div>
    );
  }

  const charityStatus = user?.charity?.verificationStatus || analytics?.verificationStatus || 'Pending';
  const isApproved = charityStatus === 'Approved';

  return (
    <div className="space-y-8">
      {/* Verification Status Warning if not approved */}
      {!isApproved && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-3xl flex items-start space-x-3 text-amber-900 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold">Charity Account Status: {charityStatus}</h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              Your organization account is undergoing administrative review. You can browse available surplus meals, but <strong>donation acceptance is locked</strong> until verified by platform administration.
            </p>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
              Community Relief Portal
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isApproved ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-amber-950'
            }`}>
              {charityStatus}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {user?.charity?.organizationName || user?.name}
          </h1>
          <p className="text-xs text-emerald-100 max-w-lg">
            Discover nearby surplus food from hotels, restaurants, and catering halls ready for collection and community distribution.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/charity/available-donations"
            className="px-5 py-2.5 rounded-xl bg-white text-emerald-950 font-semibold text-xs shadow-md hover:bg-emerald-50 transition-all flex items-center space-x-1.5"
          >
            <Utensils className="w-4 h-4 text-emerald-700" />
            <span>Discover Available Meals</span>
          </Link>
          <Link
            to="/charity/collections"
            className="px-4 py-2.5 rounded-xl bg-emerald-900/80 text-white font-medium text-xs hover:bg-emerald-900 transition-colors flex items-center space-x-1.5 border border-emerald-600/40"
          >
            <Truck className="w-4 h-4 text-emerald-300" />
            <span>Active Pickups ({analytics?.pendingPickups || 0})</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Accepted Donations"
          value={analytics?.totalAccepted || 0}
          subtext="Total committed batches"
          icon={Package}
          color="brand"
        />
        <StatCard
          title="Pending Pickups"
          value={analytics?.pendingPickups || 0}
          subtext="Currently coordinating"
          icon={Truck}
          color="amber"
        />
        <StatCard
          title="Completed Distributions"
          value={analytics?.totalCompleted || 0}
          subtext="Delivered to beneficiaries"
          icon={CheckCircle2}
          color="teal"
        />
        <StatCard
          title="Beneficiary Servings Fed"
          value={`~${analytics?.totalServingsDistributed || 0}`}
          subtext="Portions delivered"
          icon={Users}
          color="blue"
        />
      </div>

      {/* Available Food Donations Nearby Spotlight */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Fresh Surplus Meals Ready for Pickup</h3>
            <p className="text-xs text-slate-500">Live feed of donations within your operational territory</p>
          </div>
          <Link
            to="/charity/available-donations"
            className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center space-x-1"
          >
            <span>Browse All Available</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {nearbyDonations.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <Utensils className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs">No uncollected surplus food posted nearby at this moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {nearbyDonations.slice(0, 4).map((d) => (
              <div
                key={d._id}
                className="rounded-2xl border border-slate-200 p-4 space-y-3 hover:border-brand-500 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="h-28 rounded-xl overflow-hidden bg-slate-100 relative">
                    {d.foodImages?.[0] ? (
                      <img src={d.foodImages[0]} alt={d.foodName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                    {d.distanceKm !== undefined && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold">
                        {d.distanceKm} km away
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-brand-600 uppercase">{d.foodCategory}</span>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{d.foodName}</h4>
                  </div>

                  <div className="text-xs text-slate-600 flex justify-between bg-slate-50 p-2 rounded-lg">
                    <span>{d.quantity} {d.quantityUnit}</span>
                    <span className="font-bold text-brand-700">~{d.estimatedServings} servings</span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center space-x-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{d.pickupAddress}</span>
                  </div>
                </div>

                <Link
                  to={`/donations/${d._id}`}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold text-center block transition"
                >
                  Review Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CharityDashboard;
