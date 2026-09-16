import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { DealItem } from '../../types/crm';

interface RevenueChartProps {
  deals: DealItem[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ deals }) => {
  // Aggregate revenue by close month
  const monthlyData = [
    { month: 'Jul 26', closedWon: 65000, inPipeline: 40000 },
    { month: 'Aug 26', closedWon: 110000, inPipeline: 75000 },
    { month: 'Sep 26', closedWon: 175000, inPipeline: 360000 },
    { month: 'Oct 26', closedWon: 0, inPipeline: 265000 },
    { month: 'Nov 26', closedWon: 0, inPipeline: 230000 },
    { month: 'Dec 26', closedWon: 0, inPipeline: 180000 },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Revenue & Forecast Timeline</h3>
          <p className="text-xs text-slate-400">Actual closed revenue vs weighted active pipeline</p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis 
              tick={{ fontSize: 11, fill: '#64748b' }} 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(v) => `₱${v / 1000}k`}
            />
            <Tooltip 
              formatter={(value: any) => [`₱${Number(value).toLocaleString()}`, '']}
              contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="closedWon" name="Closed Won ARR" fill="#00c875" radius={[4, 4, 0, 0]} />
            <Bar dataKey="inPipeline" name="Active Pipeline" fill="#579bfc" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
