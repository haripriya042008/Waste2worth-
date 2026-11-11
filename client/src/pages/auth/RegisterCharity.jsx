import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGeolocation } from '../../hooks/useGeolocation';
import { Building2, Mail, Phone, Lock, MapPin, AlertCircle, ArrowRight, ShieldAlert, Users } from 'lucide-react';

const RegisterCharity = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { coordinates, requestLocation, hasPermission } = useGeolocation();

  const [formData, setFormData] = useState({
    name: '', // Representative Name
    organizationName: '',
    organizationType: 'NGO',
    email: '',
    phone: '',
    password: '',
    address: '',
    description: '',
    serviceCapacity: 150,
    peopleServed: 80,
    operatingHours: '8:00 AM - 8:00 PM',
    latitude: coordinates.lat,
    longitude: coordinates.lng
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleUseLocation = () => {
    requestLocation();
    setFormData((prev) => ({
      ...prev,
      latitude: coordinates.lat,
      longitude: coordinates.lng
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        ...formData,
        role: 'charity',
        latitude: coordinates.lat,
        longitude: coordinates.lng
      });
      navigate('/charity');
    } catch (err) {
      setError(err.response?.data?.message || 'Charity registration failed. Please verify form details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-700 shadow-sm">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Register Charity or Shelter
          </h2>
          <p className="text-xs text-slate-500">
            Connect your relief center to receive surplus meals from certified donors
          </p>
        </div>

        {/* Verification Notice Banner */}
        <div className="p-3.5 bg-amber-50 border border-amber-200/90 rounded-2xl flex items-start space-x-3 text-xs text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Administrative Verification Protocol:</span>
            <p className="mt-0.5 text-amber-800">
              New charity accounts are marked as <strong>Pending Verification</strong> upon registration. An administrator will verify your organization before donation acceptance is unlocked.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Legal Name</label>
              <input
                type="text"
                required
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                placeholder="e.g. Hope Children Shelter Trust"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Representative Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sister Mary / Coordinator Name"
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Official Contact Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 99000 00000"
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@shelter.org"
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Create Password</label>
              <input
                type="password"
                required
                minLength="6"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min 6 characters"
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Capacity (Meals)</label>
              <input
                type="number"
                min="10"
                required
                value={formData.serviceCapacity}
                onChange={(e) => setFormData({ ...formData, serviceCapacity: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Avg People Served</label>
              <input
                type="number"
                min="5"
                required
                value={formData.peopleServed}
                onChange={(e) => setFormData({ ...formData, peopleServed: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Operating Hours</label>
              <input
                type="text"
                required
                value={formData.operatingHours}
                onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                placeholder="e.g. 8:00 AM - 7:00 PM"
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Physical Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Building, street, neighborhood, city, pincode"
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Mission & Beneficiary Description</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief details about who you serve (children, elderlies, migrants, etc.)"
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            ></textarea>
          </div>

          {/* GPS Coordinates */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-700 block">GPS Coordinates:</span>
              <span className="text-slate-500 text-[11px]">
                {coordinates.lat.toFixed(4)}° N, {coordinates.lng.toFixed(4)}° E
              </span>
            </div>
            <button
              type="button"
              onClick={handleUseLocation}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 flex items-center space-x-1"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{hasPermission ? 'GPS Detected' : 'Use My GPS'}</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? <span>Submitting Application...</span> : (
              <>
                <span>Submit Charity Application</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-500 pt-1">
            Already registered?{' '}
            <Link to="/login" className="text-brand-600 hover:underline font-semibold">
              Sign In here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterCharity;
