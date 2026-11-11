import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { charityService } from '../../services/charityService';
import { useGeolocation } from '../../hooks/useGeolocation';
import { Building2, Phone, MapPin, CheckCircle, AlertCircle, Save, ShieldCheck } from 'lucide-react';

const CharityProfile = () => {
  const { user, refreshUser } = useAuth();
  const { coordinates, requestLocation, hasPermission } = useGeolocation();

  const [charity, setCharity] = useState(null);
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: 'NGO',
    description: '',
    address: '',
    serviceCapacity: 100,
    peopleServed: 50,
    operatingHours: '8:00 AM - 8:00 PM',
    contactPhone: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCharity = async () => {
      try {
        const res = await charityService.getProfile();
        setCharity(res.data);
        setFormData({
          organizationName: res.data.organizationName || '',
          organizationType: res.data.organizationType || 'NGO',
          description: res.data.description || '',
          address: res.data.address || '',
          serviceCapacity: res.data.serviceCapacity || 100,
          peopleServed: res.data.peopleServed || 50,
          operatingHours: res.data.operatingHours || '8:00 AM - 8:00 PM',
          contactPhone: res.data.contactPhone || ''
        });
      } catch (err) {
        console.error('Error fetching charity profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharity();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    try {
      await charityService.updateProfile({
        ...formData,
        latitude: coordinates.lat,
        longitude: coordinates.lng
      });
      await refreshUser();
      setMessage('Charity profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update organization details.');
    } finally {
      setSaving(false);
    }
  };

  const orgTypes = [
    'NGO',
    'Shelter',
    'Orphanage',
    'Community Kitchen',
    'Food Bank',
    'Old Age Home',
    'Relief Organization',
    'Other'
  ];

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        Loading organization profile...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Organization Identity
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Charity Profile & Settings</h1>
        <p className="text-xs text-slate-500">
          Manage your verified beneficiary capacity, operating schedule, and location coordinates.
        </p>
      </div>

      {charity?.verificationStatus && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs ${
          charity.verificationStatus === 'Approved'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <span className="font-bold block">Status: {charity.verificationStatus}</span>
              <span className="text-[11px]">
                {charity.verificationStatus === 'Approved'
                  ? 'Your charity is fully authorized to claim surplus food.'
                  : 'Account application is currently under administrative evaluation.'}
              </span>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Legal Name</label>
            <input
              type="text"
              required
              value={formData.organizationName}
              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Type</label>
            <select
              value={formData.organizationType}
              onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50/50"
            >
              {orgTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              required
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Operating Hours</label>
            <input
              type="text"
              required
              value={formData.operatingHours}
              onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Max Daily Capacity (Meals)</label>
            <input
              type="number"
              min="1"
              required
              value={formData.serviceCapacity}
              onChange={(e) => setFormData({ ...formData, serviceCapacity: Number(e.target.value) })}
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Avg Beneficiaries Served</label>
            <input
              type="number"
              min="1"
              required
              value={formData.peopleServed}
              onChange={(e) => setFormData({ ...formData, peopleServed: Number(e.target.value) })}
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Center Address</label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Mission</label>
          <textarea
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          ></textarea>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-slate-700 block">GPS Coordinates:</span>
            <span className="text-slate-500 text-[11px]">
              {coordinates.lat.toFixed(4)}° N, {coordinates.lng.toFixed(4)}° E
            </span>
          </div>
          <button
            type="button"
            onClick={requestLocation}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 flex items-center space-x-1"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{hasPermission ? 'GPS Detected' : 'Update GPS'}</span>
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CharityProfile;
