import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  icon: any;
  colorClass?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  colorClass = 'text-blue-600 bg-blue-50'
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-xl ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="my-1">
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</div>
        {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      {trend && (
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs">
          {trend.isNeutral ? (
            <Minus className="w-3.5 h-3.5 text-slate-400" />
          ) : trend.isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
          )}
          <span
            className={`font-semibold ${
              trend.isNeutral
                ? 'text-slate-500'
                : trend.isPositive
                ? 'text-emerald-600'
                : 'text-rose-600'
            }`}
          >
            {trend.value}
          </span>
          <span className="text-slate-400">vs last quarter</span>
        </div>
      )}
    </div>
  );
};
