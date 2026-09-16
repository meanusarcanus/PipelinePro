import React from 'react';
import { DealItem } from '../../types/crm';

interface PipelineFunnelProps {
  deals: DealItem[];
}

export const PipelineFunnel: React.FC<PipelineFunnelProps> = ({ deals }) => {
  const stageStats = [
    { key: 'lead', label: '1. Lead In', color: '#6366f1' },
    { key: 'contacted', label: '2. Contacted', color: '#fdab3d' },
    { key: 'proposal', label: '3. Proposal Sent', color: '#579bfc' },
    { key: 'negotiation', label: '4. Negotiation', color: '#a25ddc' },
    { key: 'won', label: '5. Closed Won', color: '#00c875' },
  ];

  const totalDeals = deals.length || 1;

  const funnelData = stageStats.map((st) => {
    const stageDeals = deals.filter(d => d.stage === st.key);
    const count = stageDeals.length;
    const value = stageDeals.reduce((sum, d) => sum + d.value, 0);
    const percentOfTotal = Math.round((count / totalDeals) * 100);
    return {
      ...st,
      count,
      value,
      percentOfTotal
    };
  });

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Pipeline Stage Conversion Funnel</h3>
          <p className="text-xs text-slate-400">Deal volume and dollar value distribution</p>
        </div>
      </div>

      <div className="space-y-3">
        {funnelData.map((item, idx) => {
          const widthPercent = Math.max(15, 100 - (idx * 15)); // Funnel taper shape
          return (
            <div key={item.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.label}
                </span>
                <span className="font-bold text-slate-900">
                  {item.count} deals • ₱{item.value.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-lg h-7 p-0.5 overflow-hidden flex items-center">
                <div 
                  className="h-full rounded-md flex items-center justify-between px-3 text-[11px] font-bold text-white transition-all duration-500 shadow-2xs"
                  style={{ 
                    width: `${widthPercent}%`, 
                    backgroundColor: item.color 
                  }}
                >
                  <span>{item.count} deals</span>
                  <span>₱{(item.value / 1000).toFixed(0)}k</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
