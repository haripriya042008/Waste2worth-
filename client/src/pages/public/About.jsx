import React from 'react';
import { HeartHandshake, ShieldCheck, Globe, Users, Target, Award, CheckCircle } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-brand-100 text-brand-800 text-xs font-semibold px-3.5 py-1.5 rounded-full">
          <HeartHandshake className="w-4 h-4 text-brand-600" />
          <span>Our Vision & Mission</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Transforming Surplus Into Social Value
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Waste2Worth was established to solve an absurd global paradox: millions of tons of edible food end up in landfills while vulnerable communities battle malnutrition daily.
        </p>
      </div>

      {/* The Food Paradox Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-rose-50/70 border border-rose-200/80 p-8 rounded-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800">The Problem</span>
          <h3 className="text-2xl font-bold text-rose-950">Food Waste & Landfills</h3>
          <p className="text-sm text-rose-900 leading-relaxed">
            Over 40% of food produced in metropolitan cities is discarded by banquet halls, restaurants, corporate cafeterias, and households due to lack of timely collection logistics. Decomposing food generates massive methane emissions, driving climate degradation.
          </p>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200/80 p-8 rounded-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Our Solution</span>
          <h3 className="text-2xl font-bold text-emerald-950">Intelligent Logistics & Routing</h3>
          <p className="text-sm text-emerald-900 leading-relaxed">
            Waste2Worth establishes a unified digital bridge with real-time GPS proximity matching, verified recipient organizations, instant acceptance notifications, and automated serving calculators to distribute meals safely within their consumption window.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-slate-900 text-center">Core Operating Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="p-3 bg-brand-50 text-brand-700 rounded-xl w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-slate-800">Verified Integrity</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every charity and community kitchen undergoes strict admin document verification and capacity inspection before receiving donation acceptance privileges.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl w-fit">
              <Globe className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-slate-800">Geospatial Precision</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Surplus food is perishable. Our GPS-driven proximity engine prioritizes shelters within minimal travel radius, preventing thermal degradation and spoilage.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl w-fit">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-slate-800">End-to-End Transparency</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every donation has a transparent status audit trail: created, accepted, collected, and distributed, giving donors peace of mind and measurable social impact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
