import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <span className="text-6xl font-extrabold text-brand-600">404</span>
      <h1 className="text-2xl font-bold text-slate-800">Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-md">
        The requested page does not exist or has been relocated to another section of the Waste2Worth system.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
