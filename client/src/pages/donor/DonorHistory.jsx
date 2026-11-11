import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { donationService } from '../../services/donationService';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';
import { History, Search, Download, Calendar, Filter, Package, ExternalLink } from 'lucide-react';

const DonorHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await donationService.getMyDonations({
          category: categoryFilter,
          status: statusFilter
        });
        setDonations(res.data || []);
      } catch (err) {
        console.error('Failed to load donation history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [categoryFilter, statusFilter]);

  const filtered = donations.filter((d) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      d.foodName?.toLowerCase().includes(term) ||
      d.charityId?.organizationName?.toLowerCase().includes(term) ||
      d.pickupAddress?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          Historical Audit Records
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Donation History</h1>
        <p className="text-xs text-slate-500">
          Permanent chronological log of all your contributions, recipient organizations, and life-cycle dates.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by food or recipient charity..."
            className="w-full text-xs rounded-xl border border-slate-200 pl-9 pr-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50/50"
          >
            <option value="all">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Accepted">Accepted</option>
            <option value="Collected">Collected</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50/50"
          >
            <option value="all">All Categories</option>
            <option value="Cooked Meals">Cooked Meals</option>
            <option value="Bakery & Bread">Bakery & Bread</option>
            <option value="Fresh Produce (Fruits & Vegetables)">Fresh Produce</option>
            <option value="Dairy & Beverages">Dairy & Beverages</option>
            <option value="Packaged & Canned Goods">Packaged & Canned</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-6">Food Item</th>
                <th className="py-3.5 px-6">Quantity</th>
                <th className="py-3.5 px-6">Recipient Charity</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Created</th>
                <th className="py-3.5 px-6">Accepted</th>
                <th className="py-3.5 px-6">Collected</th>
                <th className="py-3.5 px-6">Completed</th>
                <th className="py-3.5 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-10 text-center text-slate-400">
                    Loading records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    No donation history records found.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      {d.foodName}
                      <span className="text-[10px] text-slate-400 block font-normal">{d.foodCategory}</span>
                    </td>
                    <td className="py-3.5 px-6 font-medium text-slate-700">
                      {d.quantity} {d.quantityUnit}
                      <span className="text-[10px] text-slate-400 block">~{d.estimatedServings} servings</span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-700">
                      {d.charityId?.organizationName || (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(d.donationStatus)}`}>
                        {d.donationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">{formatDate(d.createdAt)}</td>
                    <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">{formatDate(d.acceptedAt)}</td>
                    <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">{formatDate(d.collectedAt)}</td>
                    <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">{formatDate(d.completedAt)}</td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        to={`/donations/${d._id}`}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-800"
                      >
                        View
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

export default DonorHistory;
