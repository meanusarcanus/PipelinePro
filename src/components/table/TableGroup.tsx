import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Sparkles } from 'lucide-react';
import { TableGroup as TableGroupType, DealItem } from '../../types/crm';
import { useCrmStore } from '../../store/useCrmStore';
import { TableRow } from './TableRow';

interface TableGroupProps {
  group: TableGroupType;
  deals: DealItem[];
}

export const TableGroup: React.FC<TableGroupProps> = ({ group, deals }) => {
  const { 
    collapsedGroups, 
    toggleGroupCollapse, 
    addDeal,
    selectedRows,
    toggleRowSelect,
    selectAllRows 
  } = useCrmStore();

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCompany, setNewItemCompany] = useState('');
  const [newItemValue, setNewItemValue] = useState('50000');

  const isCollapsed = !!collapsedGroups[group.id];

  // Group aggregates
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
  const avgProbability = deals.length ? Math.round(deals.reduce((sum, d) => sum + d.probability, 0) / deals.length) : 0;
  const weightedValue = deals.reduce((sum, d) => sum + (d.value * (d.probability / 100)), 0);

  const handleCreateInlineItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addDeal({
      name: newItemName.trim(),
      company: newItemCompany.trim() || newItemName.trim(),
      value: Number(newItemValue) || 50000,
      groupId: group.id,
      stage: 'lead',
      priority: 'medium',
      probability: 40
    });

    setNewItemName('');
    setNewItemCompany('');
    setIsAddingItem(false);
  };

  return (
    <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all">
      {/* Group Header - Monday style */}
      <div 
        className="px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-slate-50/60 select-none"
        style={{ borderLeft: `5px solid ${group.color}` }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleGroupCollapse(group.id)}
            className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <span 
            className="text-sm font-bold tracking-tight"
            style={{ color: group.color }}
          >
            {group.title}
          </span>

          <span className="text-xs bg-slate-200/80 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
            {deals.length} {deals.length === 1 ? 'deal' : 'deals'}
          </span>
        </div>

        {/* Header Right summary stats */}
        <div className="flex items-center gap-4 text-xs">
          <div className="text-slate-500 hidden sm:block">
            Weighted Pipeline: <span className="font-semibold text-slate-800">₱{Math.round(weightedValue).toLocaleString()}</span>
          </div>
          <div className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
            Total: ₱{totalValue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      {!isCollapsed && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider select-none">
                <th className="w-10 px-2 py-2.5 text-center">
                  <input
                    type="checkbox"
                    checked={deals.length > 0 && deals.every(d => selectedRows[d.id])}
                    onChange={(e) => {
                      const shouldSelect = e.target.checked;
                      deals.forEach(d => {
                        if (Boolean(selectedRows[d.id]) !== shouldSelect) {
                          toggleRowSelect(d.id);
                        }
                      });
                    }}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    title="Select all in group"
                  />
                </th>
                <th className="px-3 py-2.5 min-w-[280px]">Deal & Organization</th>
                <th className="px-3 py-2.5 text-center w-36">Owner</th>
                <th className="px-3 py-2.5 text-center w-36">Stage</th>
                <th className="px-3 py-2.5 text-right w-32">ARR Value</th>
                <th className="px-3 py-2.5 text-center w-32">Priority</th>
                <th className="px-3 py-2.5 text-center w-32">Est. Close</th>
                <th className="px-3 py-2.5 text-center w-32">Confidence</th>
                <th className="px-2 py-2.5 text-center w-12"></th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <TableRow key={deal.id} deal={deal} groupColor={group.color} />
              ))}

              {deals.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-xs text-slate-400">
                    No deals currently in this group. Click "+ Add Deal" below.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Inline Add Item Row / Trigger */}
          <div className="p-2 border-t border-slate-100 bg-slate-50/40">
            {isAddingItem ? (
              <form onSubmit={handleCreateInlineItem} className="flex flex-wrap items-center gap-2 px-2 py-1">
                <input
                  type="text"
                  autoFocus
                  placeholder="Deal name (e.g. Acme Corp Enterprise Cloud)..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1 min-w-[200px] text-xs px-2.5 py-1.5 bg-white border border-blue-500 rounded focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Company name..."
                  value={newItemCompany}
                  onChange={(e) => setNewItemCompany(e.target.value)}
                  className="w-40 text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none"
                />
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">₱</span>
                  <input
                    type="number"
                    placeholder="50000"
                    value={newItemValue}
                    onChange={(e) => setNewItemValue(e.target.value)}
                    className="w-28 pl-5 text-xs px-2 py-1.5 bg-white border border-slate-300 rounded focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
                >
                  Save Deal
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-medium"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingItem(true)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-medium px-3 py-1.5 rounded-md hover:bg-white transition-colors group"
              >
                <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-blue-500" />
                <span>+ Add Deal to {group.title}</span>
              </button>
            )}
          </div>

          {/* Group Footer Summary Row - Monday Signature style */}
          {deals.length > 0 && (
            <div className="px-4 py-2.5 bg-slate-100/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-4">
                <span>Summary ({deals.length} items)</span>
                <span className="text-slate-400">•</span>
                <span>Avg. Win Probability: <strong className="text-slate-800">{avgProbability}%</strong></span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-500">Group Total:</span>
                <span className="text-sm font-extrabold text-slate-900">₱{totalValue.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
