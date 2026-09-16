import React from 'react';
import { 
  Table as TableIcon, 
  Kanban as KanbanIcon, 
  BarChart3, 
  FileCheck2,
  Layers
} from 'lucide-react';
import { useCrmStore } from '../../store/useCrmStore';
import { AppView } from '../../types/crm';

export const ViewSelector: React.FC = () => {
  const { currentView, setCurrentView, deals, opsRequests } = useCrmStore();

  const pendingOpsCount = opsRequests.filter(r => r.status === 'pending').length;

  const views: { id: AppView; label: string; icon: any; count?: number; highlightBadge?: boolean }[] = [
    { id: 'table', label: 'Main Table', icon: TableIcon, count: deals.length },
    { id: 'kanban', label: 'Kanban Stages', icon: KanbanIcon },
    { id: 'ops', label: 'Operational Requests', icon: FileCheck2, count: pendingOpsCount, highlightBadge: pendingOpsCount > 0 },
    { id: 'analytics', label: 'Executive Analytics', icon: BarChart3 },
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-6 pt-2.5 flex items-center gap-1 overflow-x-auto select-none">
      {views.map((v) => {
        const Icon = v.icon;
        const isActive = currentView === v.id;
        return (
          <button
            key={v.id}
            onClick={() => setCurrentView(v.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-md transition-all border-b-2 relative ${
              isActive
                ? 'text-blue-600 border-blue-600 bg-blue-50/50'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>{v.label}</span>
            {v.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  v.highlightBadge
                    ? 'bg-amber-500 text-white'
                    : isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {v.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
