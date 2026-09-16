import React from 'react';
import { DealItem } from '../../types/crm';
import { History, Clock, ArrowRight } from 'lucide-react';

interface ActivityLogProps {
  deal: DealItem;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ deal }) => {
  return (
    <div className="p-4 overflow-y-auto h-full space-y-4">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        <History className="w-3.5 h-3.5" />
        Audit Trail & State History
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {deal.activityLog.map((log) => (
          <div key={log.id} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white" />

            <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-2xs text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="font-semibold text-slate-700">{log.author}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {log.timestamp}
                </span>
              </div>

              <div className="font-medium text-slate-800">
                {log.action}
              </div>

              {log.previousValue && log.newValue && (
                <div className="mt-2 flex items-center gap-2 text-[11px] font-mono bg-slate-50 p-1.5 rounded border border-slate-100">
                  <span className="line-through text-slate-400">{log.previousValue}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="font-semibold text-blue-600">{log.newValue}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
