import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { donationService } from '../../services/donationService';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';
import { History, Search, Package, Calendar } from 'lucide-react';

const CharityHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await donationService.getDonations({
          status: statusFilter !== 'all' ? statusFilter : undefined
        });
        setDonations(res.data || []);
      } catch (err) {
        console.error('Error fetching charity history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [statusFilter]);

  const filtered = donations.filter((d) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      d.foodName?.toLowerCase().includes(term) ||
      d.donorId?.name?.toLowerCase().includes(term) ||
      d.foodCategory?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Permanent Distribution Records
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Charity Donation History</h1>
        <p className="text-xs text-slate-500">
          Comprehensive log of all received, collected, and distributed food contributions.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search food or donor..."
            className="w-full text-xs rounded-xl border border-slate-200 pl-9 pr-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50/50"
        >
          <option value="all">All Statuses</option>
          <option value="Accepted">Accepted</option>
          <option value="Collected">Collected</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-6">Food Item</th>
                <th className="py-3.5 px-6">Portions</th>
                <th className="py-3.5 px-6">Donor Details</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Accepted Date</th>
                <th className="py-3.5 px-6">Completed Date</th>
                <th className="py-3.5 px-6 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-400">
                    Loading records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No matching history records found.
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
                      ~{d.estimatedServings} servings ({d.quantity} {d.quantityUnit})
                    </td>
                    <td className="py-3.5 px-6 text-slate-700">
                      <p className="font-semibold">{d.donorId?.name}</p>
                      <p className="text-[10px] text-slate-400">{d.donorId?.phone}</p>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(d.donationStatus)}`}>
                        {d.donationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">{formatDate(d.acceptedAt)}</td>
                    <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">{formatDate(d.completedAt)}</td>
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

export default CharityHistory;
