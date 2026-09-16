import React, { useMemo } from 'react';
import { 
  Plus, 
  ChevronsUpDown, 
  Trash2, 
  TrendingUp, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { useCrmStore } from '../../store/useCrmStore';
import { TableGroup } from './TableGroup';
import { DealItem, DealStage } from '../../types/crm';

export const BoardTable: React.FC = () => {
  const { 
    deals, 
    groups, 
    workspaces,
    activeWorkspaceId,
    filters, 
    selectedRows, 
    bulkUpdateStage, 
    bulkDelete,
    selectAllRows,
    setAllGroupsCollapse,
    setNewDealModalOpen
  } = useCrmStore();

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];

  // Filter and sort deals
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      // Workspace filter
      if ((deal.workspaceId || 'enterprise') !== activeWorkspaceId) {
        return false;
      }

      // Search
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const match = 
          deal.name.toLowerCase().includes(q) ||
          deal.company.toLowerCase().includes(q) ||
          deal.contactName.toLowerCase().includes(q) ||
          deal.industry.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Stage filter
      if (filters.stageFilter !== 'all' && deal.stage !== filters.stageFilter) {
        return false;
      }

      // Priority filter
      if (filters.priorityFilter !== 'all' && deal.priority !== filters.priorityFilter) {
        return false;
      }

      // Owner filter
      if (filters.ownerFilter !== 'all' && deal.owner.id !== filters.ownerFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'value') {
        return filters.sortDirection === 'asc' ? a.value - b.value : b.value - a.value;
      }
      if (filters.sortBy === 'probability') {
        return filters.sortDirection === 'asc' ? a.probability - b.probability : b.probability - a.probability;
      }
      if (filters.sortBy === 'closeDate') {
        return filters.sortDirection === 'asc' 
          ? new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime()
          : new Date(b.closeDate).getTime() - new Date(a.closeDate).getTime();
      }
      return a.name.localeCompare(b.name);
    });
  }, [deals, filters, activeWorkspaceId]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;
  const totalValue = filteredDeals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Table Toolbar & Group toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 select-none">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{activeWorkspace.name}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {filteredDeals.length} active
            </span>
          </h1>

          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 pl-3 border-l border-slate-200">
            <button
              onClick={() => setAllGroupsCollapse(false)}
              className="px-2 py-1 rounded hover:bg-slate-100 text-slate-600 font-medium"
            >
              Expand All
            </button>
            <span>/</span>
            <button
              onClick={() => setAllGroupsCollapse(true)}
              className="px-2 py-1 rounded hover:bg-slate-100 text-slate-600 font-medium"
            >
              Collapse All
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500">
            Total Pipeline ARR: <strong className="text-slate-900 font-bold text-sm">₱{totalValue.toLocaleString()}</strong>
          </div>
          <button
            onClick={() => setNewDealModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Deal
          </button>
        </div>
      </div>

      {/* Floating Bulk Action Bar when rows are selected */}
      {selectedCount > 0 && (
        <div className="mb-4 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center justify-between animate-fadeIn z-20">
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="bg-blue-600 px-2 py-0.5 rounded text-white">{selectedCount}</span>
            <span>deals selected</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Batch stage:</span>
            {(['proposal', 'negotiation', 'won', 'lost'] as DealStage[]).map(st => (
              <button
                key={st}
                onClick={() => bulkUpdateStage(st)}
                className="px-2.5 py-1 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 capitalize transition-colors"
              >
                {st}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-700 mx-2" />

            <button
              onClick={bulkDelete}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded bg-red-600/90 hover:bg-red-600 transition-colors text-white"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Selected
            </button>

            <button
              onClick={() => selectAllRows(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Groups Listing */}
      <div className="space-y-4">
        {groups.map((group) => {
          const groupDeals = filteredDeals.filter(d => d.groupId === group.id);
          return (
            <TableGroup
              key={group.id}
              group={group}
              deals={groupDeals}
            />
          );
        })}
      </div>
    </div>
  );
};
