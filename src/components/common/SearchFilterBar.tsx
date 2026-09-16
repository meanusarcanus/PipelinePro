import React from 'react';
import { Search, Filter, Download, Plus, RotateCcw, X } from 'lucide-react';
import { useCrmStore } from '../../store/useCrmStore';
import { DealStage, DealPriority } from '../../types/crm';

export const SearchFilterBar: React.FC = () => {
  const { 
    filters, 
    setFilter, 
    resetFilters, 
    team, 
    currentView, 
    setNewDealModalOpen, 
    setNewOpsModalOpen,
    exportCSV,
    deals 
  } = useCrmStore();

  const isFiltered = 
    filters.searchQuery !== '' || 
    filters.stageFilter !== 'all' || 
    filters.priorityFilter !== 'all' || 
    filters.ownerFilter !== 'all';

  const stages: { value: DealStage | 'all'; label: string }[] = [
    { value: 'all', label: 'All Stages' },
    { value: 'lead', label: 'Lead In' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'proposal', label: 'Proposal Sent' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'won', label: 'Closed Won' },
    { value: 'lost', label: 'Closed Lost' },
  ];

  const priorities: { value: DealPriority | 'all'; label: string }[] = [
    { value: 'all', label: 'All Priorities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 select-none">
      {/* Search Input */}
      <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search deals, accounts, contacts..."
            value={filters.searchQuery}
            onChange={(e) => setFilter('searchQuery', e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all text-slate-800 placeholder-slate-400"
          />
          {filters.searchQuery && (
            <button 
              onClick={() => setFilter('searchQuery', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mr-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filter:</span>
        </div>

        {/* Stage Filter */}
        <select
          value={filters.stageFilter}
          onChange={(e) => setFilter('stageFilter', e.target.value as any)}
          className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-md px-2.5 py-1.5 font-medium hover:bg-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          {stages.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priorityFilter}
          onChange={(e) => setFilter('priorityFilter', e.target.value as any)}
          className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-md px-2.5 py-1.5 font-medium hover:bg-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          {priorities.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        {/* Owner Filter */}
        <select
          value={filters.ownerFilter}
          onChange={(e) => setFilter('ownerFilter', e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-md px-2.5 py-1.5 font-medium hover:bg-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="all">All Owners</option>
          {team.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        {/* Clear Filters */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1.5 rounded transition-colors font-medium"
            title="Reset active filters"
          >
            <RotateCcw className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors shadow-sm"
          title="Export deals to CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          Export CSV
        </button>

        {currentView === 'ops' ? (
          <button
            onClick={() => setNewOpsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            New Request
          </button>
        ) : (
          <button
            onClick={() => setNewDealModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            New Deal
          </button>
        )}
      </div>
    </div>
  );
};
