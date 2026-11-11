import React from 'react';

// Monthly Activity Trends Bar Chart
export const MonthlyTrendChart = ({ trends = [] }) => {
  if (!trends || trends.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-slate-400">
        No monthly historical data yet.
      </div>
    );
  }

  const maxVal = Math.max(...trends.map((t) => t.count || 0), 5);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="h-56 flex flex-col justify-end pt-4">
      <div className="flex items-end justify-between h-44 gap-2 px-2 border-b border-slate-200">
        {trends.map((t, idx) => {
          const heightPercent = Math.round(((t.count || 0) / maxVal) * 100);
          const monthLabel = months[(t._id?.month || 1) - 1] || 'M';

          return (
            <div key={idx} className="flex-1 flex flex-col items-center group relative">
              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-20">
                {t.count} donations ({t.servings || 0} servings)
              </div>
              <div
                className="w-full max-w-[28px] bg-gradient-to-t from-brand-600 to-emerald-400 rounded-t-md transition-all group-hover:brightness-110"
                style={{ height: `${Math.max(10, heightPercent)}%` }}
              ></div>
              <span className="text-[11px] text-slate-500 font-medium mt-2">{monthLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Food Category Breakdown Component
export const CategoryBreakdownBar = ({ categories = [] }) => {
  if (!categories || categories.length === 0) {
    return <div className="text-sm text-slate-400 py-4">No categories recorded.</div>;
  }

  const total = categories.reduce((sum, c) => sum + (c.count || 0), 0) || 1;

  const colorPalette = [
    'bg-emerald-500',
    'bg-teal-500',
    'bg-amber-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-rose-500',
    'bg-slate-500'
  ];

  return (
    <div className="space-y-3 pt-2">
      {categories.map((cat, idx) => {
        const percent = Math.round(((cat.count || 0) / total) * 100);
        const color = colorPalette[idx % colorPalette.length];

        return (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-700 truncate max-w-[200px]">{cat._id || 'General'}</span>
              <span className="text-slate-500">
                {cat.count} items ({percent}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Circular Impact Metric Ring
export const ImpactProgress = ({ value = 0, max = 100, label = 'Impact', subtext = '' }) => {
  const percent = Math.min(100, Math.round((value / max) * 100));
  const strokeDashoffset = 251.2 - (251.2 * percent) / 100;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            className="text-slate-100"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            className="text-brand-600 transition-all duration-1000 ease-out"
            strokeWidth="8"
            strokeDasharray="251.2"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold text-slate-800">{value}</span>
          <span className="text-[10px] text-slate-500 font-medium uppercase">{label}</span>
        </div>
      </div>
      {subtext && <p className="text-xs text-slate-500 mt-2 text-center">{subtext}</p>}
    </div>
  );
};
