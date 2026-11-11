import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { donationService } from '../../services/donationService';
import { useAuth } from '../../context/AuthContext';
import { useGeolocation } from '../../hooks/useGeolocation';
import { formatDate } from '../../utils/formatters';
import Modal from '../../components/common/Modal';
import {
  Package,
  Search,
  Filter,
  MapPin,
  Clock,
  ArrowRight,
  Check,
  AlertCircle,
  ShieldAlert,
  Compass,
  CheckCircle2,
  X
} from 'lucide-react';

const AvailableDonations = () => {
  const { user } = useAuth();
  const { coordinates } = useGeolocation();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [foodType, setFoodType] = useState('all');
  const [sort, setSort] = useState('nearest');
  const [maxDistance, setMaxDistance] = useState('');
  const [search, setSearch] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Reject Modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [activeDonationId, setActiveDonationId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const isApproved = user?.charity?.verificationStatus === 'Approved';

  const fetchAvailableDonations = async () => {
    setLoading(true);
    try {
      const res = await donationService.getAvailableDonations({
        category,
        foodType,
        sort,
        maxDistance,
        lat: coordinates.lat,
        lng: coordinates.lng
      });
      setDonations(res.data || []);
    } catch (err) {
      console.error('Failed to load available donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableDonations();
  }, [category, foodType, sort, maxDistance, coordinates.lat, coordinates.lng]);

  const handleAccept = async (id, foodName) => {
    if (!isApproved) {
      alert('Your charity account is pending administrative verification. Acceptance is restricted.');
      return;
    }

    if (!window.confirm(`Commit to collecting "${foodName}"?`)) return;

    try {
      await donationService.acceptDonation(id);
      setActionMessage(`Successfully claimed "${foodName}"! Pickup coordination details unlocked.`);
      setTimeout(() => setActionMessage(''), 5000);
      fetchAvailableDonations();
    } catch (err) {
      alert(err.response?.data?.message || 'Donation could not be accepted. It may have already been claimed.');
      fetchAvailableDonations();
    }
  };

  const handleRejectSubmit = async () => {
    if (!activeDonationId) return;
    try {
      await donationService.rejectDonation(activeDonationId, rejectionReason);
      setRejectModalOpen(false);
      setActiveDonationId(null);
      setRejectionReason('');
      setActionMessage('Donation declined.');
      setTimeout(() => setActionMessage(''), 4000);
      fetchAvailableDonations();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to decline donation.');
    }
  };

  const filtered = donations.filter((d) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      d.foodName?.toLowerCase().includes(term) ||
      d.pickupAddress?.toLowerCase().includes(term) ||
      d.foodCategory?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Surplus Food Marketplace
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Discover Available Food Donations</h1>
        <p className="text-xs text-slate-500">
          Review surplus food from local restaurants and households. Sort by proximity and claim for immediate pickup.
        </p>
      </div>

      {!isApproved && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center space-x-3 text-xs text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Account Verification Required:</strong> Your charity application is pending admin review. You can inspect food details, but the "Accept Donation" button will unlock once approved.
          </span>
        </div>
      )}

      {actionMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by food title or location..."
              className="w-full text-xs rounded-xl border border-slate-200 pl-9 pr-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50/50"
            >
              <option value="all">All Categories</option>
              <option value="Cooked Meals">Cooked Meals</option>
              <option value="Bakery & Bread">Bakery & Bread</option>
              <option value="Fresh Produce (Fruits & Vegetables)">Fresh Produce</option>
              <option value="Dairy & Beverages">Dairy & Beverages</option>
              <option value="Packaged & Canned Goods">Packaged & Canned</option>
            </select>
          </div>

          {/* Proximity / Sort */}
          <div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50/50 font-medium"
            >
              <option value="nearest">Sort: Nearest Distance</option>
              <option value="newest">Sort: Newest Submissions</option>
            </select>
          </div>

          {/* Max Distance */}
          <div>
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50/50"
            >
              <option value="">Any Distance</option>
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="25">Within 25 km</option>
              <option value="50">Within 50 km</option>
            </select>
          </div>
        </div>
      </div>

      {/* Available Donations Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-xs text-slate-400">
          Scanning available surplus food...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-2">
          <Package className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">No Food Matches Current Filters</h4>
          <p className="text-xs text-slate-400">Try broadening your radius or clearing category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((d) => (
            <div
              key={d._id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Photo header */}
                <div className="h-44 bg-slate-100 relative overflow-hidden">
                  {d.foodImages?.[0] ? (
                    <img src={d.foodImages[0]} alt={d.foodName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <Package className="w-8 h-8 mb-1" />
                      <span className="text-[11px]">No photo</span>
                    </div>
                  )}

                  {d.distanceKm !== null && d.distanceKm !== undefined && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 text-white backdrop-blur shadow">
                      {d.distanceKm} km away
                    </span>
                  )}

                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 text-white shadow">
                    {d.foodCategory}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{d.foodName}</h3>

                  <div className="flex items-center justify-between text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Available</span>
                      <span className="font-bold">{d.quantity} {d.quantityUnit}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Portions</span>
                      <span className="font-bold text-brand-700">~{d.estimatedServings} servings</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-start space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{d.pickupAddress}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span className="text-[11px] font-semibold text-rose-700">
                        Expires: {formatDate(d.expiryDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  to={`/donations/${d._id}`}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  View Details
                </Link>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setActiveDonationId(d._id);
                      setRejectModalOpen(true);
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Decline"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleAccept(d._id, d.foodName)}
                    disabled={!isApproved}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition flex items-center space-x-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    title={!isApproved ? 'Account pending verification' : 'Claim this donation'}
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept Donation</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Decline Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Decline Food Donation"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Please indicate why this donation is not suitable for your organization:
          </p>
          <textarea
            rows="3"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. Beyond transport capacity / dietary restrictions / already stocked"
            className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:ring-2 focus:ring-rose-500 focus:outline-none"
          ></textarea>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectSubmit}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition"
            >
              Submit Decline
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AvailableDonations;
