import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HeartHandshake, Lock, Mail, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ email, password });
      const user = res.user;

      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'charity') navigate('/charity');
      else navigate('/donor');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Account Switcher for Instant Evaluation
  const setDemoCredentials = (role) => {
    setError('');
    if (role === 'admin') {
      setEmail('admin@waste2worth.org');
      setPassword('Admin@1234');
    } else if (role === 'donor') {
      setEmail('donor@waste2worth.org');
      setPassword('Donor@1234');
    } else if (role === 'restaurant') {
      setEmail('catering@grandpalace.com');
      setPassword('Donor@1234');
    } else if (role === 'charity') {
      setEmail('contact@hopeshelter.org');
      setPassword('Charity@1234');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-brand-50 text-brand-600 shadow-sm">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Sign in to Waste2Worth
          </h2>
          <p className="text-xs text-slate-500">
            Access your food donation management dashboard
          </p>
        </div>

        {/* Demo Account Pills for Testing Convenience */}
        <div className="p-3.5 bg-slate-100/90 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Instant Demo Login (Single Click Autofill):</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setDemoCredentials('admin')}
              className="py-1.5 px-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-[11px] font-medium text-left truncate transition"
            >
              👑 Administrator
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('donor')}
              className="py-1.5 px-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-[11px] font-medium text-left truncate transition"
            >
              🥗 Food Donor (Household)
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('restaurant')}
              className="py-1.5 px-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-[11px] font-medium text-left truncate transition"
            >
              🏨 Hotel / Caterer Donor
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('charity')}
              className="py-1.5 px-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-[11px] font-medium text-left truncate transition"
            >
              🤝 Verified Charity / NGO
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full text-xs rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? <span>Authenticating...</span> : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-center text-xs text-slate-500 space-y-2">
            <p>
              New here?{' '}
              <Link to="/register-donor" className="text-brand-600 hover:underline font-semibold">
                Register as Food Donor
              </Link>{' '}
              or{' '}
              <Link to="/register-charity" className="text-brand-600 hover:underline font-semibold">
                Register Charity
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
