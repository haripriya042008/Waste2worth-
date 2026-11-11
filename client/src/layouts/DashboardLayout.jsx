import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/common/NotificationBell';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  History,
  Users,
  Building2,
  MapPin,
  Calculator,
  Bell,
  Settings,
  ShieldCheck,
  CheckCircle,
  Truck,
  BarChart3,
  Activity,
  LogOut,
  Menu,
  X,
  Compass,
  AlertCircle
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Donor Navigation
  const donorLinks = [
    { name: 'Donor Dashboard', path: '/donor', icon: LayoutDashboard },
    { name: 'Create Food Donation', path: '/donor/create-donation', icon: PlusCircle },
    { name: 'My Active Donations', path: '/donor/my-donations', icon: Package },
    { name: 'Donation History', path: '/donor/history', icon: History },
    { name: 'Nearby Charities', path: '/donor/nearby-charities', icon: Building2 },
    { name: 'Portion Calculator', path: '/donor/calculator', icon: Calculator },
    { name: 'Notifications', path: '/donor/notifications', icon: Bell },
    { name: 'Profile Settings', path: '/donor/profile', icon: Settings }
  ];

  // Charity Navigation
  const charityLinks = [
    { name: 'Charity Dashboard', path: '/charity', icon: LayoutDashboard },
    { name: 'Discover Donations', path: '/charity/available-donations', icon: Package },
    { name: 'Accepted Donations', path: '/charity/accepted-donations', icon: CheckCircle },
    { name: 'Collection Management', path: '/charity/collections', icon: Truck },
    { name: 'Donation History', path: '/charity/history', icon: History },
    { name: 'GPS Recommendations', path: '/charity/recommendations', icon: Compass },
    { name: 'Notifications', path: '/charity/notifications', icon: Bell },
    { name: 'Organization Profile', path: '/charity/profile', icon: Building2 }
  ];

  // Admin Navigation
  const adminLinks = [
    { name: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Charity Verification', path: '/admin/charities', icon: ShieldCheck },
    { name: 'All Donations', path: '/admin/donations', icon: Package },
    { name: 'Public Places & Hubs', path: '/admin/public-places', icon: MapPin },
    { name: 'Analytics & Reports', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Activity Audit Log', path: '/admin/activities', icon: Activity }
  ];

  let currentLinks = donorLinks;
  if (user?.role === 'admin') currentLinks = adminLinks;
  if (user?.role === 'charity') currentLinks = charityLinks;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Desktop & Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800 shadow-xl`}
      >
        <div>
          {/* Brand header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
                W2W
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Waste2Worth</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info banner in sidebar */}
          <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-950/40">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-brand-600/30 text-brand-400 border border-brand-500/30 flex items-center justify-center font-bold text-sm uppercase">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <h4 className="text-xs font-semibold text-white truncate">{user?.name}</h4>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-950/80 border border-brand-800 px-1.5 py-0.5 rounded">
                    {user?.role}
                  </span>
                  {user?.role === 'charity' && user.charity?.verificationStatus && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      user.charity.verificationStatus === 'Approved'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                        : 'bg-amber-950/80 text-amber-300 border-amber-800'
                    }`}>
                      {user.charity.verificationStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Verification alert warning for unapproved charities */}
          {user?.role === 'charity' && user.charity?.verificationStatus === 'Pending' && (
            <div className="mx-3 mt-3 p-2.5 rounded-xl bg-amber-950/50 border border-amber-800/60 text-[11px] text-amber-200 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>Charity under admin verification. Donation acceptance unlocks upon approval.</span>
            </div>
          )}

          {/* Nav links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {currentLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <Link
            to="/"
            className="flex items-center space-x-3 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Public Home</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm sm:text-base font-semibold text-slate-800 capitalize">
              {user?.role} Portal
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <NotificationBell />
            <div className="h-6 w-px bg-slate-200"></div>
            <span className="text-xs font-medium text-slate-600 hidden sm:inline-block">
              {user?.name}
            </span>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
