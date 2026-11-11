import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { donationService } from '../../services/donationService';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';
import GoogleMapComponent from '../../components/common/GoogleMapComponent';
import Modal from '../../components/common/Modal';
import {
  Package,
  Clock,
  Calendar,
  MapPin,
  Utensils,
  Truck,
  CheckCircle,
  AlertCircle,
  User,
  Building2,
  Phone,
  ShieldCheck,
  History,
  ArrowLeft,
  Navigation,
  Ban,
  Check
} from 'lucide-react';

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [donation, setDonation] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modals for actions
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await donationService.getDonationById(id);
      setDonation(res.data);
      setActivities(res.activities || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch donation details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  // Handle Charity Accept Action
  const handleAccept = async () => {
    if (!window.confirm('Are you sure you want to accept and commit to collecting this donation?')) {
      return;
    }
    setActionLoading(true);
    try {
      await donationService.acceptDonation(id);
      setSuccessMessage('Donation accepted successfully! Pickup details unlocked.');
      fetchDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept donation');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Charity Reject Action
  const handleReject = async () => {
    setActionLoading(true);
    try {
      await donationService.rejectDonation(id, rejectionReason);
      setRejectModalOpen(false);
      setSuccessMessage('Donation marked as rejected.');
      fetchDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject donation');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Charity Collect Action
  const handleCollect = async () => {
    if (!window.confirm('Confirm that food items have been safely picked up from donor?')) {
      return;
    }
    setActionLoading(true);
    try {
      await donationService.collectDonation(id);
      setSuccessMessage('Donation marked as Collected.');
      fetchDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update collection status');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Charity Complete Action
  const handleComplete = async () => {
    if (!window.confirm('Confirm that food has been successfully distributed to beneficiaries?')) {
      return;
    }
    setActionLoading(true);
    try {
      await donationService.completeDonation(id);
      setSuccessMessage('Donation completed! Thank you for feeding beneficiaries.');
      fetchDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete donation');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Donor Cancel Action
  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this donation?')) {
      return;
    }
    setActionLoading(true);
    try {
      await donationService.cancelDonation(id);
      setSuccessMessage('Donation has been cancelled.');
      fetchDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel donation');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        Loading donation records...
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">Donation Record Not Found</h3>
        <p className="text-xs text-slate-500">{error || 'Unable to locate this record.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isDonorOwner = user?._id?.toString() === donation.donorId?._id?.toString();
  const isAcceptedCharity = user?._id?.toString() === donation.acceptedBy?._id?.toString();
  const isAdmin = user?.role === 'admin';
  const isCharity = user?.role === 'charity';

  const donationCoords = donation.location?.coordinates || [77.5946, 12.9716];
  const mapCenter = { lat: donationCoords[1], lng: donationCoords[0] };
  const mapMarkers = [
    {
      id: donation._id,
      lat: donationCoords[1],
      lng: donationCoords[0],
      title: donation.foodName,
      snippet: donation.pickupAddress,
      type: 'DONATION',
      directionsUrl: `https://www.google.com/maps/search/?api=1&query=${donationCoords[1]},${donationCoords[0]}`
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(donation.donationStatus)}`}>
          Status: {donation.donationStatus}
        </span>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Food Details & Images */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photos Carousel / Grid */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            {donation.foodImages && donation.foodImages.length > 0 ? (
              <div className="space-y-2 p-2">
                <div className="h-72 rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={donation.foodImages[0]}
                    alt={donation.foodName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {donation.foodImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 px-2 pb-2">
                    {donation.foodImages.slice(1).map((src, idx) => (
                      <div key={idx} className="h-20 rounded-xl overflow-hidden bg-slate-100">
                        <img src={src} alt="Food photo" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-48 bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                <Package className="w-10 h-10 mb-2" />
                <span className="text-xs">No food photographs uploaded</span>
              </div>
            )}

            <div className="p-6 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider block">
                  {donation.foodCategory} • {donation.foodType}
                </span>
                <h1 className="text-2xl font-bold text-slate-900 mt-0.5">{donation.foodName}</h1>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {donation.description || 'No additional food description provided.'}
                </p>
              </div>

              {/* Quantity Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Available Quantity</span>
                  <span className="text-base font-extrabold text-slate-800">
                    {donation.quantity} {donation.quantityUnit}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Calculated Yield</span>
                  <span className="text-base font-extrabold text-brand-700">
                    ~{donation.estimatedServings} servings
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Safe Expiry</span>
                  <span className="text-xs font-bold text-rose-700 block mt-0.5">
                    {formatDate(donation.expiryDate)}
                  </span>
                </div>
              </div>

              {/* Special Instructions */}
              {donation.specialInstructions && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-amber-900 space-y-1">
                  <span className="font-bold block">Special Handling & Storage Instructions:</span>
                  <p>{donation.specialInstructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Location & Map Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Pickup Location & Navigation</h3>
                <p className="text-xs text-slate-500">{donation.pickupAddress}</p>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${donationCoords[1]},${donationCoords[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold flex items-center space-x-1"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Google Maps Directions</span>
              </a>
            </div>

            <GoogleMapComponent
              center={mapCenter}
              zoom={14}
              markers={mapMarkers}
              height="280px"
            />
          </div>

          {/* Audit History Timeline */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <History className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-800">Immutable Donation Audit Trail</h3>
            </div>

            <div className="space-y-4 pt-2">
              {activities.length === 0 ? (
                <p className="text-xs text-slate-400">No activity logged.</p>
              ) : (
                activities.map((act, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{act.description}</p>
                      <span className="text-[10px] text-slate-400">{formatDate(act.timestamp)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Organization Details & Actions */}
        <div className="space-y-6">
          {/* Action Control Panel */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Donation Operations</h3>

            {/* Charity Acceptance Buttons */}
            {isCharity && donation.donationStatus === 'Available' && (
              <div className="space-y-2">
                <button
                  onClick={handleAccept}
                  disabled={actionLoading}
                  className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept Food Donation</span>
                </button>
                <button
                  onClick={() => setRejectModalOpen(true)}
                  disabled={actionLoading}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-xs transition"
                >
                  Decline / Reject
                </button>
              </div>
            )}

            {/* Charity Status Progression */}
            {(isAcceptedCharity || isAdmin) && donation.donationStatus === 'Accepted' && (
              <button
                onClick={handleCollect}
                disabled={actionLoading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-md transition flex items-center justify-center space-x-2"
              >
                <Truck className="w-4 h-4" />
                <span>Mark Food as Collected</span>
              </button>
            )}

            {(isAcceptedCharity || isAdmin) && donation.donationStatus === 'Collected' && (
              <button
                onClick={handleComplete}
                disabled={actionLoading}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md transition flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark Distribution Complete</span>
              </button>
            )}

            {/* Donor Cancellation */}
            {isDonorOwner && donation.donationStatus === 'Available' && (
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium text-xs transition flex items-center justify-center space-x-1"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel Donation</span>
              </button>
            )}

            {/* Completed badge */}
            {donation.donationStatus === 'Completed' && (
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-center space-y-1">
                <CheckCircle className="w-8 h-8 text-teal-600 mx-auto" />
                <h5 className="text-xs font-bold text-teal-900">Distribution Fulfilled</h5>
                <p className="text-[11px] text-teal-700">Food reached verified beneficiaries successfully.</p>
              </div>
            )}
          </div>

          {/* Donor Information */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Donor Information
            </h4>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-sm">
                <User className="w-5 h-5" />
              </div>
              <div className="truncate">
                <h5 className="text-xs font-bold text-slate-800">{donation.donorId?.name}</h5>
                <span className="text-[10px] text-slate-500 font-medium">{donation.donorId?.donorCategory}</span>
              </div>
            </div>

            {(isAcceptedCharity || isAdmin || isDonorOwner) && (
              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{donation.donorId?.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{donation.pickupAddress}</span>
                </div>
              </div>
            )}
          </div>

          {/* Accepting Charity Information */}
          {donation.charityId ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Accepting Organization
              </h4>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h5 className="text-xs font-bold text-slate-800">{donation.charityId?.organizationName}</h5>
                  <span className="text-[10px] text-slate-500 font-medium">{donation.charityId?.organizationType}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{donation.charityId?.contactPhone || 'Contact through coordination'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{donation.charityId?.address}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-3xl text-center text-xs text-slate-400">
              Waiting for an eligible nearby charity to claim this donation.
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Decline Food Donation"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Please provide a reason for declining this donation so the donor can adjust:
          </p>
          <textarea
            rows="3"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. Dietary restriction / outside immediate operational radius / capacity reached"
            className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:ring-2 focus:ring-rose-500 focus:outline-none"
          ></textarea>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition"
            >
              Confirm Decline
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DonationDetails;
