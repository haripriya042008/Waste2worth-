import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { useGeolocation } from '../../hooks/useGeolocation';
import { User, Phone, MapPin, CheckCircle, AlertCircle, Save } from 'lucide-react';

const DonorProfile = () => {
  const { user, refreshUser } = useAuth();
  const { coordinates, requestLocation, hasPermission } = useGeolocation();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [donorCategory, setDonorCategory] = useState(user?.donorCategory || 'Individual / Household');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const categories = [
    'Individual / Household',
    'Restaurant',
    'Hotel',
    'Event Organizer',
    'Bakery',
    'Supermarket',
    'Corporate / Office',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await userService.updateProfile({
        name,
        phone,
        address,
        donorCategory,
        latitude: coordinates.lat,
        longitude: coordinates.lng
      });
      await refreshUser();
      setMessage('Profile settings saved successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          Account Preferences
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Profile & Address Settings</h1>
        <p className="text-xs text-slate-500">
          Update your contact information and default surplus food pickup address.
        </p>
      </div>

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
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name / Establishment Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address (Read-only)</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-100 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Donor Category</label>
          <select
            value={donorCategory}
            onChange={(e) => setDonorCategory(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50/50"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Default Pickup Address</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
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
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            <span>{hasPermission ? 'GPS Detected' : 'Update GPS'}</span>
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonorProfile;
