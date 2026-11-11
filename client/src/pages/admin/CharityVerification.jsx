import React, { useState, useEffect } from 'react';
import { charityService } from '../../services/charityService';
import { formatDate } from '../../utils/formatters';
import Modal from '../../components/common/Modal';
import {
  ShieldCheck,
  Search,
  Filter,
  Check,
  X,
  AlertCircle,
  Building2,
  Phone,
  MapPin,
  Clock,
  Users
} from 'lucide-react';

const CharityVerification = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Pending'); // default to Pending to focus on pending verifications
  const [search, setSearch] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Reject Modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCharities = async () => {
    setLoading(true);
    try {
      const res = await charityService.getAllCharities({
        status: statusFilter,
        search
      });
      setCharities(res.data || []);
    } catch (err) {
      console.error('Failed to load charities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, [statusFilter]);

  const handleApprove = async (id, orgName) => {
    if (!window.confirm(`Approve charity organization "${orgName}"? This unlocks their donation acceptance access.`)) return;
    try {
      await charityService.verifyCharity(id, { status: 'Approved' });
      setActionMessage(`Charity "${orgName}" has been successfully APPROVED!`);
      setTimeout(() => setActionMessage(''), 4000);
      fetchCharities();
    } catch (err) {
      alert(err.response?.data?.message || 'Error approving charity');
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedCharity) return;
    setActionLoading(true);
    try {
      await charityService.verifyCharity(selectedCharity._id, {
        status: 'Rejected',
        rejectionReason
      });
      setRejectModalOpen(false);
      setSelectedCharity(null);
      setRejectionReason('');
      setActionMessage('Charity application rejected.');
      setTimeout(() => setActionMessage(''), 4000);
      fetchCharities();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
          Trust & Safety Verification
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Charity & NGO Verification Center</h1>
        <p className="text-xs text-slate-500">
          Review credentials, service capacity, and community credibility before approving food pickup rights.
        </p>
      </div>

      {actionMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        {['Pending', 'Approved', 'Rejected', 'all'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
              statusFilter === st ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st === 'all' ? 'All Charities' : st}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-xs text-slate-400">
          Loading charity verification records...
        </div>
      ) : charities.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          No organizations currently in status '{statusFilter}'.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {charities.map((ch) => (
            <div
              key={ch._id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {ch.organizationType}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{ch.organizationName}</h3>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    ch.verificationStatus === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : ch.verificationStatus === 'Pending'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-rose-100 text-rose-800 border-rose-300'
                  }`}>
                    {ch.verificationStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {ch.description || 'No description provided.'}
                </p>

                {ch.rejectionReason && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                    <strong>Rejection Reason:</strong> {ch.rejectionReason}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Daily Capacity</span>
                    <span className="font-extrabold text-slate-800">{ch.serviceCapacity} meals</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">People Served</span>
                    <span className="font-extrabold text-brand-700">~{ch.peopleServed} beneficiaries</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <p className="flex items-start space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{ch.address}</span>
                  </p>
                  <p className="flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{ch.contactPhone || ch.userId?.phone}</span>
                  </p>
                  <p className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>Hours: {ch.operatingHours}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Registered: {formatDate(ch.createdAt)}
                </span>

                <div className="flex items-center space-x-2">
                  {ch.verificationStatus !== 'Approved' && (
                    <button
                      onClick={() => handleApprove(ch._id, ch.organizationName)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {ch.verificationStatus !== 'Rejected' && (
                    <button
                      onClick={() => {
                        setSelectedCharity(ch);
                        setRejectModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition flex items-center space-x-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Charity Application"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Provide a clear justification for rejecting {selectedCharity?.organizationName}:
          </p>
          <textarea
            rows="3"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. Incomplete registration credentials or unverified physical center"
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
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CharityVerification;
