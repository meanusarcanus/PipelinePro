import React, { useState } from 'react';
import { 
  Search, 
  Mail, 
  ExternalLink, 
  Calendar, 
  Plus, 
  Grid, 
  Layers, 
  Check, 
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { useCrmStore } from '../../store/useCrmStore';
import { DealItem, DealStage, DealPriority } from '../../types/crm';
import { Avatar } from '../common/Avatar';
import { BoardTable } from '../table/BoardTable';

const STAGE_CONFIG: Record<DealStage, { label: string; bg: string; text: string }> = {
  'lead': { label: 'Lead In', bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700' },
  'contacted': { label: 'Contacted', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
  'proposal': { label: 'Proposal', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
  'negotiation': { label: 'Negotiation', bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
  'won': { label: 'Closed Won', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
  'lost': { label: 'Closed Lost', bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700' }
};

const PRIORITY_CONFIG: Record<DealPriority, { label: string; color: string }> = {
  critical: { label: 'Urgent', color: 'bg-rose-500' },
  high: { label: 'High', color: 'bg-orange-500' },
  medium: { label: 'Med', color: 'bg-blue-500' },
  low: { label: 'Low', color: 'bg-slate-400' }
};

export const MobileDealList: React.FC = () => {
  const { 
    deals, 
    activeWorkspaceId, 
    setSelectedDealId, 
    moveDealStage,
    setNewDealModalOpen,
    mobileViewType,
    setMobileViewType
  } = useCrmStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState<DealStage | 'all'>('all');
  const [activeStagePickerDealId, setActiveStagePickerDealId] = useState<string | null>(null);

  // Filter deals for active workspace
  const workspaceDeals = deals.filter(d => (d.workspaceId || 'enterprise') === activeWorkspaceId);

  const filteredDeals = workspaceDeals.filter(deal => {
    const matchesSearch = 
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deal.contactName && deal.contactName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStage = selectedStageFilter === 'all' || deal.stage === selectedStageFilter;
    return matchesSearch && matchesStage;
  });

  const totalValue = filteredDeals.reduce((sum, d) => sum + d.value, 0);

  if (mobileViewType === 'grid') {
    return (
      <div className="pb-20">
        {/* Toggle back to cards bar */}
        <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">Full Spreadsheet Grid</span>
          <button
            onClick={() => setMobileViewType('cards')}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-xs"
          >
            <Layers className="w-3.5 h-3.5" />
            Switch to Touch Cards
          </button>
        </div>
        <div className="overflow-x-auto">
          <BoardTable />
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 pb-24 space-y-3 select-none">
      {/* Search and View Toggle Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deals, company..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <button
          onClick={() => setMobileViewType('grid')}
          className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 shadow-2xs"
          title="Switch to Spreadsheet Grid"
        >
          <Grid className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Stage Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        <button
          onClick={() => setSelectedStageFilter('all')}
          className={`px-3 py-1 rounded-full whitespace-nowrap text-xs font-semibold transition-all ${
            selectedStageFilter === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          All ({workspaceDeals.length})
        </button>
        {(['lead', 'proposal', 'negotiation', 'won'] as DealStage[]).map(stage => (
          <button
            key={stage}
            onClick={() => setSelectedStageFilter(selectedStageFilter === stage ? 'all' : stage)}
            className={`px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium transition-all ${
              selectedStageFilter === stage
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {STAGE_CONFIG[stage].label}
          </button>
        ))}
      </div>

      {/* Summary Stat */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-medium">
        <span>{filteredDeals.length} Deals in view</span>
        <span className="font-bold text-slate-800">Total: ₱{totalValue.toLocaleString('en-US')}</span>
      </div>

      {/* Deal Cards Feed */}
      <div className="space-y-2.5">
        {filteredDeals.map((deal) => {
          const stageInfo = STAGE_CONFIG[deal.stage] || STAGE_CONFIG['lead'];
          const priorityInfo = PRIORITY_CONFIG[deal.priority] || PRIORITY_CONFIG['medium'];

          return (
            <div
              key={deal.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs hover:shadow-md transition-all relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div 
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: deal.owner?.color || '#3B82F6' }}
              />

              {/* Header: Company & Amount */}
              <div className="flex items-start justify-between gap-2 mt-0.5">
                <div 
                  onClick={() => setSelectedDealId(deal.id)}
                  className="flex-1 cursor-pointer"
                >
                  <h3 className="font-bold text-sm text-slate-900 leading-tight hover:text-blue-600 transition-colors">
                    {deal.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500 font-medium">
                    <span>{deal.company}</span>
                    {deal.industry && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] text-slate-400">{deal.industry}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-sm text-emerald-600 tracking-tight">
                    ₱{deal.value.toLocaleString('en-US')}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {deal.probability}% win prob
                  </div>
                </div>
              </div>

              {/* Stage & Priority Pill Row */}
              <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100">
                {/* 1-Tap Stage Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setActiveStagePickerDealId(activeStagePickerDealId === deal.id ? null : deal.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${stageInfo.bg} ${stageInfo.text} active:scale-95 transition-all shadow-2xs`}
                  >
                    <span>{stageInfo.label}</span>
                    <ChevronRight className="w-3 h-3 rotate-90 opacity-60" />
                  </button>

                  {/* Stage Dropdown */}
                  {activeStagePickerDealId === deal.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setActiveStagePickerDealId(null)} 
                      />
                      <div className="absolute left-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-50 min-w-[170px] animate-in fade-in zoom-in-95">
                        <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400">
                          Change Stage
                        </div>
                        {(Object.keys(STAGE_CONFIG) as DealStage[]).map((stg) => (
                          <button
                            key={stg}
                            onClick={() => {
                              moveDealStage(deal.id, stg);
                              setActiveStagePickerDealId(null);
                            }}
                            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              deal.stage === stg ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span>{STAGE_CONFIG[stg].label}</span>
                            {deal.stage === stg && <Check className="w-3.5 h-3.5 text-blue-600" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Priority Badge & Close Date */}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                    <span className={`w-1.5 h-1.5 rounded-full ${priorityInfo.color}`} />
                    {priorityInfo.label}
                  </span>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{deal.closeDate}</span>
                  </div>
                </div>
              </div>

              {/* Owner & Action Buttons */}
              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <Avatar user={deal.owner} size="sm" />
                  <span className="text-xs text-slate-600 font-medium">{deal.owner.name.split(' ')[0]}</span>
                </div>

                {/* Direct Action Links */}
                <div className="flex items-center gap-1 text-slate-400">
                  {deal.contactEmail && (
                    <a
                      href={`mailto:${deal.contactEmail}`}
                      className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title={`Email ${deal.contactEmail}`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedDealId(deal.id)}
                    className="p-1.5 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Open Full Details & Updates"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredDeals.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400">
            <Layers className="w-8 h-8 mx-auto mb-2 opacity-40 text-blue-500" />
            <p className="text-xs font-semibold text-slate-700">No deals found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Try clearing your filters or create a new deal.</p>
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) for Mobile "+ Deal" */}
      <button
        onClick={() => setNewDealModalOpen(true)}
        className="fixed bottom-18 right-4 z-30 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xl hover:shadow-blue-500/30 active:scale-90 transition-all duration-200"
        title="Add New Opportunity"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};
