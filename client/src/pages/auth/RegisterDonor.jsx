import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGeolocation } from '../../hooks/useGeolocation';
import { HeartHandshake, User, Mail, Phone, Lock, MapPin, AlertCircle, ArrowRight, Check } from 'lucide-react';

const RegisterDonor = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { coordinates, requestLocation, hasPermission } = useGeolocation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    donorCategory: 'Individual / Household',
    address: '',
    latitude: coordinates.lat,
    longitude: coordinates.lng
  });

  const [loading, setLoading] = useState(false);
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
        role: 'donor',
        latitude: coordinates.lat,
        longitude: coordinates.lng
      });
      navigate('/donor');
    } catch (err) {
      setError(err.response?.data?.message || 'Donor registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-brand-50 text-brand-600 shadow-sm">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Join as Food Donor
          </h2>
          <p className="text-xs text-slate-500">
            Donate your surplus food and help eliminate local hunger
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Donor Name / Business Title</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rahul Verma or Green Leaf Cafe"
                className="w-full text-xs rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="donor@domain.com"
                  className="w-full text-xs rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98450 00000"
                  className="w-full text-xs rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Donor Category</label>
              <select
                value={formData.donorCategory}
                onChange={(e) => setFormData({ ...formData, donorCategory: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50/50"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Create Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full text-xs rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Default Pickup Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address, building, city, postal code"
                className="w-full text-xs rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* GPS Location Capture */}
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
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span>{hasPermission ? 'GPS Detected' : 'Use My GPS'}</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? <span>Creating Donor Account...</span> : (
              <>
                <span>Complete Registration</span>
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

export default RegisterDonor;
