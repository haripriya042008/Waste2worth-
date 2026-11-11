import React from 'react';
import {
  Calculator,
  MapPin,
  Building2,
  Compass,
  UploadCloud,
  Bell,
  History,
  BarChart3,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const Features = () => {
  const modules = [
    {
      title: 'Module 1: Food Quantity Decision',
      icon: Calculator,
      color: 'bg-emerald-50 text-emerald-700',
      description: 'Intelligent calculation of estimated meal servings from raw weight, volume, or packaged units. Automatically generates splitting recommendations across multiple centers for large volumes and detects headcount deficits.'
    },
    {
      title: 'Module 2: Public Place Recommendation',
      icon: MapPin,
      color: 'bg-teal-50 text-teal-700',
      description: 'Directory of verified civic distribution hubs, municipal shelters, transit stations, and community dining centers. Provides Google Maps navigation links and distance calculations.'
    },
    {
      title: 'Module 3: Community Place Suggestion',
      icon: Building2,
      color: 'bg-blue-50 text-blue-700',
      description: 'Discovers verified shelters, orphanages, old age homes, and community kitchens matching donor food types, capacity requirements, and operating hours.'
    },
    {
      title: 'GPS-Based Proximity Engine',
      icon: Compass,
      color: 'bg-indigo-50 text-indigo-700',
      description: 'Powered by MongoDB geospatial indexing (2dsphere) and Google Maps API. Calculates distances with Haversine precision, enabling radius-based filtering from 5km to 50km.'
    },
    {
      title: 'Food Image Upload & Validation',
      icon: UploadCloud,
      color: 'bg-amber-50 text-amber-700',
      description: 'Multer-powered secure file upload system. Validates image MIME types (JPEG, PNG, WEBP), enforces a 5MB size limit, generates safe unique filenames, and renders previews before submission.'
    },
    {
      title: 'Real-Time Notification Pipeline',
      icon: Bell,
      color: 'bg-purple-50 text-purple-700',
      description: 'Socket.io WebSocket connections authenticated via JWT tokens. Users receive real-time updates for submissions, claims, collections, and approvals without manual page refreshes.'
    },
    {
      title: 'Immutable Donation Audit Timeline',
      icon: History,
      color: 'bg-rose-50 text-rose-700',
      description: 'Comprehensive audit trails for every donation status transition: Available -> Accepted -> Collected -> Completed. Full activity logs preserve timestamps and actor identities.'
    },
    {
      title: 'Role-Based Analytics Dashboards',
      icon: BarChart3,
      color: 'bg-slate-50 text-slate-700',
      description: 'Dedicated analytics dashboards for Administrators, Donors, and Charities with dynamic database queries, status breakdown ratios, monthly collection curves, and category breakdowns.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Comprehensive Feature Architecture
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Explore all essential modules engineered into Waste2Worth to ensure reliability, transparency, and high social throughput.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {modules.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3"
            >
              <div className={`p-3 rounded-2xl w-fit ${m.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{m.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{m.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Features;
