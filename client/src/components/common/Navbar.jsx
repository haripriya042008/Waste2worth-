import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';
import {
  HeartHandshake,
  Menu,
  X,
  User,
  LogOut,
  Shield,
  Utensils,
  PlusCircle,
  LayoutDashboard,
  MapPin,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'charity') return '/charity';
    return '/donor';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                Waste<span className="text-brand-600">2</span>Worth
              </span>
              <span className="block text-[10px] text-slate-500 tracking-wider font-medium uppercase -mt-1">
                Zero Waste • Zero Hunger
              </span>
            </div>
          </Link>

          {/* Desktop Public Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/about') ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              About
            </Link>
            <Link
              to="/how-it-works"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/how-it-works') ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/features"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/features') ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              Features
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/contact') ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Section */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <>
                {/* Role Specific Action Pill */}
                {user.role === 'donor' && (
                  <Link
                    to="/donor/create-donation"
                    className="flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Donate Food</span>
                  </Link>
                )}

                {user.role === 'charity' && (
                  <Link
                    to="/charity/available-donations"
                    className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-all"
                  >
                    <Utensils className="w-4 h-4" />
                    <span>Find Food</span>
                  </Link>
                )}

                {/* Dashboard shortcut link */}
                <Link
                  to={getDashboardPath()}
                  className="flex items-center space-x-1 text-slate-700 hover:text-brand-700 hover:bg-slate-100 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 mr-1 text-brand-600" />
                  Dashboard
                </Link>

                {/* Real-time Notifications Bell */}
                <NotificationBell />

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs uppercase">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="text-left hidden lg:block">
                      <span className="text-xs font-semibold text-slate-800 block truncate max-w-[120px]">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block -mt-0.5">
                        {user.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-800 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>

                      <Link
                        to={user.role === 'charity' ? '/charity/profile' : user.role === 'admin' ? '/admin' : '/donor/profile'}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        <User className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        Profile Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2 text-xs text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-3.5 h-3.5 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register-donor"
                  className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all"
                >
                  Join as Donor
                </Link>
                <Link
                  to="/register-charity"
                  className="border border-brand-600 text-brand-700 hover:bg-brand-50 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
                >
                  Join as Charity
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center space-x-2">
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            About
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            How It Works
          </Link>
          <Link
            to="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Features
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Contact
          </Link>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 text-sm font-medium rounded-lg bg-brand-600 text-white"
                >
                  Open Dashboard ({user.role})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-center px-4 py-2 text-sm font-medium rounded-lg bg-rose-50 text-rose-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-3 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register-donor"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-3 py-2 text-sm font-medium rounded-lg bg-brand-600 text-white"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
