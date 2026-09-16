import React, { useMemo } from 'react';
import { useCrmStore } from '../../store/useCrmStore';
import { DealStage } from '../../types/crm';
import { KanbanColumn } from './KanbanColumn';

export const KanbanBoard: React.FC = () => {
  const { deals, filters, workspaces, activeWorkspaceId } = useCrmStore();

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];

  const stageConfigs: { stage: DealStage; title: string; color: string }[] = [
    { stage: 'lead', title: 'Lead In', color: '#6366f1' },
    { stage: 'contacted', title: 'Contacted', color: '#fdab3d' },
    { stage: 'proposal', title: 'Proposal Sent', color: '#579bfc' },
    { stage: 'negotiation', title: 'Negotiation', color: '#a25ddc' },
    { stage: 'won', title: 'Closed Won', color: '#00c875' },
    { stage: 'lost', title: 'Closed Lost', color: '#e2445c' }
  ];

  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      // Workspace filter
      if ((deal.workspaceId || 'enterprise') !== activeWorkspaceId) {
        return false;
      }

      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const match = 
          deal.name.toLowerCase().includes(q) ||
          deal.company.toLowerCase().includes(q) ||
          deal.contactName.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (filters.priorityFilter !== 'all' && deal.priority !== filters.priorityFilter) {
        return false;
      }
      if (filters.ownerFilter !== 'all' && deal.owner.id !== filters.ownerFilter) {
        return false;
      }
      return true;
    });
  }, [deals, filters, activeWorkspaceId]);

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>{activeWorkspace.name}</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Kanban Stages
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Drag and drop opportunities between pipeline stages to update progress and forecast metrics.
        </p>
      </div>

      {/* Horizontal scrollable columns */}
      <div className="flex gap-4 overflow-x-auto pb-6 items-start">
        {stageConfigs.map((cfg) => {
          const stageDeals = filteredDeals.filter(d => d.stage === cfg.stage);
          return (
            <KanbanColumn
              key={cfg.stage}
              stage={cfg.stage}
              title={cfg.title}
              color={cfg.color}
              deals={stageDeals}
            />
          );
        })}
      </div>
    </div>
  );
};
