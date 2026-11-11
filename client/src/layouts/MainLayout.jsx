import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useNotifications } from '../context/NotificationContext';
import { Bell, X } from 'lucide-react';

const MainLayout = () => {
  const { latestToast, clearToast } = useNotifications();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Floating real-time notification toast */}
      {latestToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start space-x-3 animate-in slide-in-from-bottom-5 duration-200">
          <div className="p-2 rounded-xl bg-brand-500 text-white mt-0.5">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h5 className="text-xs font-bold text-white">{latestToast.title}</h5>
            <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">{latestToast.message}</p>
          </div>
          <button
            onClick={clearToast}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
