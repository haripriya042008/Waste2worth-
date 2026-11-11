import React from 'react';

export const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  color = 'brand',
  trend
}) => {
  const colorStyles = {
    brand: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    teal: 'bg-teal-50 text-teal-600 border-teal-100'
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {title}
          </span>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${colorStyles[color] || colorStyles.brand}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {(subtext || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>{subtext}</span>
          {trend && <span className="font-semibold text-brand-600">{trend}</span>}
        </div>
      )}
    </div>
  );
};
