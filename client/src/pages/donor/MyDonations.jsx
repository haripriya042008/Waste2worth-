import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { donationService } from '../../services/donationService';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Ban
} from 'lucide-react';

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchMyDonations = async () => {
    setLoading(true);
    try {
      const res = await donationService.getMyDonations({
        status: statusFilter,
        search
      });
      setDonations(res.data || []);
    } catch (err) {
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, [statusFilter]);

  const handleCancel = async (id, foodName) => {
    if (!window.confirm(`Are you sure you want to cancel the donation "${foodName}"?`)) {
      return;
    }
    try {
      await donationService.cancelDonation(id);
      setActionMessage(`Donation "${foodName}" has been cancelled.`);
      setTimeout(() => setActionMessage(''), 4000);
      fetchMyDonations();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel donation');
    }
  };

  const filteredDonations = donations.filter((d) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      d.foodName?.toLowerCase().includes(term) ||
      d.foodCategory?.toLowerCase().includes(term) ||
      d.pickupAddress?.toLowerCase().includes(term)
    );
  });

  const statuses = ['all', 'Available', 'Accepted', 'Collected', 'Completed', 'Cancelled'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Donation Portfolio
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">My Food Donations</h1>
          <p className="text-xs text-slate-500">
            Manage your submitted food donations, check claim statuses, and coordinate pickups.
          </p>
        </div>

        <Link
          to="/donor/create-donation"
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-600/20 transition flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Food Donation</span>
        </Link>
      </div>

      {actionMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by food name or address..."
            className="w-full text-xs rounded-xl border border-slate-200 pl-9 pr-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Donations Grid / List */}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-xs text-slate-400">
          Loading donations...
        </div>
      ) : filteredDonations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Donations Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {statusFilter !== 'all'
              ? `You do not have any donations with status '${statusFilter}'.`
              : 'You have not submitted any food donations yet.'}
          </p>
          <Link
            to="/donor/create-donation"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold mt-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create First Donation</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonations.map((d) => (
            <div
              key={d._id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image Header */}
                <div className="h-44 bg-slate-100 relative overflow-hidden">
                  {d.foodImages && d.foodImages.length > 0 ? (
                    <img
                      src={d.foodImages[0]}
                      alt={d.foodName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <Package className="w-8 h-8 mb-1" />
                      <span className="text-[11px]">No photo uploaded</span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md bg-white/95 ${getStatusBadgeClass(d.donationStatus)}`}>
                      {d.donationStatus}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-900/80 text-white">
                      {d.foodCategory}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{d.foodName}</h3>

                  <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Quantity</span>
                      <span className="font-bold text-slate-800">{d.quantity} {d.quantityUnit}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Yield</span>
                      <span className="font-bold text-brand-700">~{d.estimatedServings} servings</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-start space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{d.pickupAddress}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      <span className="text-[11px] text-slate-500">
                        Expires: {formatDate(d.expiryDate)}
                      </span>
                    </div>
                  </div>

                  {/* Charity acceptance block */}
                  {d.charityId && (
                    <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl text-xs text-blue-900 space-y-1">
                      <span className="font-bold block text-[11px] uppercase tracking-wider text-blue-700">Accepted By:</span>
                      <p className="font-semibold">{d.charityId.organizationName}</p>
                      {d.charityId.contactPhone && (
                        <p className="text-[11px] text-blue-800">Phone: {d.charityId.contactPhone}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  to={`/donations/${d._id}`}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center space-x-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                {d.donationStatus === 'Available' && (
                  <button
                    onClick={() => handleCancel(d._id, d.foodName)}
                    className="text-xs font-medium text-rose-600 hover:text-rose-800 flex items-center space-x-1"
                  >
                    <Ban className="w-3 h-3" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDonations;
