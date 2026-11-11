import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { donationService } from '../../services/donationService';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  ArrowRight,
  Navigation
} from 'lucide-react';

const AcceptedDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  const fetchAccepted = async () => {
    setLoading(true);
    try {
      const res = await donationService.getDonations({
        // Will fetch accepted and collected
        status: 'Accepted'
      });
      setDonations(res.data || []);
    } catch (err) {
      console.error('Error loading accepted donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccepted();
  }, []);

  const handleCollect = async (id, foodName) => {
    if (!window.confirm(`Mark "${foodName}" as COLLECTED from donor?`)) return;
    try {
      await donationService.collectDonation(id);
      setActionMessage(`Status updated: "${foodName}" marked as Collected.`);
      setTimeout(() => setActionMessage(''), 4000);
      fetchAccepted();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Pickup Coordination
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Accepted Donations</h1>
        <p className="text-xs text-slate-500">
          Surplus meals claimed by your organization awaiting physical collection from donor premises.
        </p>
      </div>

      {actionMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="h-64 flex items-center justify-center text-xs text-slate-400">
          Loading accepted donations...
        </div>
      ) : donations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">No Pending Pickups</h4>
          <p className="text-xs text-slate-400">You currently have no uncollected accepted donations.</p>
          <Link
            to="/charity/available-donations"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold mt-2"
          >
            <span>Discover Available Food</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {donations.map((d) => (
            <div
              key={d._id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block">
                      {d.foodCategory}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">{d.foodName}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(d.donationStatus)}`}>
                    {d.donationStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Portions</span>
                    <span className="font-extrabold text-brand-700">~{d.estimatedServings} servings ({d.quantity} {d.quantityUnit})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Availability Window</span>
                    <span className="font-semibold text-slate-700">{d.pickupAvailability}</span>
                  </div>
                </div>

                {/* Donor Contact Card */}
                <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-2xl text-xs text-blue-900 space-y-1.5">
                  <div className="flex items-center space-x-2 font-bold text-blue-800">
                    <User className="w-3.5 h-3.5" />
                    <span>Donor Contact & Handover Liaison:</span>
                  </div>
                  <p className="font-semibold text-slate-900">{d.donorId?.name} ({d.donorId?.donorCategory})</p>
                  <p className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-blue-700" />
                    <span className="font-bold">{d.donorId?.phone}</span>
                  </p>
                  <p className="flex items-start space-x-1 pt-1 text-[11px] text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{d.pickupAddress}</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/donations/${d._id}`}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
                >
                  <span>Details & Map</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <div className="flex items-center space-x-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${d.location?.coordinates?.[1] || 12.9716},${d.location?.coordinates?.[0] || 77.5946}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Google Maps Navigation"
                  >
                    <Navigation className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleCollect(d._id, d.foodName)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-md transition flex items-center space-x-1.5"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Mark as Collected</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcceptedDonations;
