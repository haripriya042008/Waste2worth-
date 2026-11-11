import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { donationService } from '../../services/donationService';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';
import {
  Truck,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  ArrowRight,
  Navigation,
  Check,
  AlertTriangle,
  Ban
} from 'lucide-react';

const CollectionManagement = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active'); // 'active' (Accepted + Collected), 'Collected', 'Completed'
  const [actionMessage, setActionMessage] = useState('');

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const statusParam = filter === 'active' ? 'Accepted' : filter;
      const res = await donationService.getDonations({
        // For active collections, fetch both or filter on client
      });
      // Filter collections that belong to this charity
      setDonations(res.data || []);
    } catch (err) {
      console.error('Failed to load collections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [filter]);

  const handleCollect = async (id, foodName) => {
    try {
      await donationService.collectDonation(id);
      setActionMessage(`"${foodName}" marked as Collected from donor.`);
      setTimeout(() => setActionMessage(''), 4000);
      fetchCollections();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleComplete = async (id, foodName) => {
    if (!window.confirm(`Confirm that "${foodName}" has been successfully distributed to beneficiaries?`)) return;
    try {
      await donationService.completeDonation(id);
      setActionMessage(`"${foodName}" marked as Distributed & Completed! 🎉`);
      setTimeout(() => setActionMessage(''), 4000);
      fetchCollections();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const relevantDonations = donations.filter((d) => {
    if (filter === 'active') return d.donationStatus === 'Accepted' || d.donationStatus === 'Collected';
    if (filter === 'Collected') return d.donationStatus === 'Collected';
    if (filter === 'Completed') return d.donationStatus === 'Completed';
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Distribution & Logistics Management
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Collection Management</h1>
        <p className="text-xs text-slate-500">
          Coordinate transit logistics, verify physical pickup, and close out distribution fulfillment records.
        </p>
      </div>

      {actionMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            filter === 'active' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Active Logistics (Pickup & In-Transit)
        </button>
        <button
          onClick={() => setFilter('Collected')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            filter === 'Collected' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Awaiting Final Distribution
        </button>
        <button
          onClick={() => setFilter('Completed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            filter === 'Completed' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Completed Distributions
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-6">Food Details</th>
                <th className="py-3.5 px-6">Portions</th>
                <th className="py-3.5 px-6">Donor & Contact</th>
                <th className="py-3.5 px-6">Pickup Location</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Logistics Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-400">
                    Loading collections...
                  </td>
                </tr>
              ) : relevantDonations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No matching collections in this status.
                  </td>
                </tr>
              ) : (
                relevantDonations.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      <Link to={`/donations/${d._id}`} className="hover:text-brand-600">
                        {d.foodName}
                      </Link>
                      <span className="text-[10px] text-slate-400 block font-normal">{d.foodCategory}</span>
                    </td>
                    <td className="py-3.5 px-6 font-medium text-slate-700">
                      {d.quantity} {d.quantityUnit}
                      <span className="text-[10px] text-brand-700 font-bold block">~{d.estimatedServings} servings</span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-700">
                      <p className="font-semibold">{d.donorId?.name || 'Donor'}</p>
                      <p className="text-[11px] text-slate-500">{d.donorId?.phone}</p>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 max-w-xs truncate">
                      {d.pickupAddress}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(d.donationStatus)}`}>
                        {d.donationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right whitespace-nowrap">
                      {d.donationStatus === 'Accepted' && (
                        <button
                          onClick={() => handleCollect(d._id, d.foodName)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-sm transition"
                        >
                          Mark Collected
                        </button>
                      )}

                      {d.donationStatus === 'Collected' && (
                        <button
                          onClick={() => handleComplete(d._id, d.foodName)}
                          className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition"
                        >
                          Mark Completed
                        </button>
                      )}

                      {d.donationStatus === 'Completed' && (
                        <span className="text-[11px] font-bold text-teal-700">Fulfillment Done</span>
                      )}
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

export default CollectionManagement;
