import React, { useState } from 'react';
import { 
  MessageSquare, 
  Trash2, 
  Calendar, 
  DollarSign, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { DealItem, DealStage, DealPriority } from '../../types/crm';
import { useCrmStore } from '../../store/useCrmStore';
import { StageBadge, PriorityBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';

interface TableRowProps {
  deal: DealItem;
  groupColor: string;
}

export const TableRow: React.FC<TableRowProps> = ({ deal, groupColor }) => {
  const { 
    updateDeal, 
    deleteDeal, 
    moveDealStage, 
    setSelectedDealId, 
    team, 
    selectedRows, 
    toggleRowSelect 
  } = useCrmStore();

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(deal.name);
  const [editingValue, setEditingValue] = useState(false);
  const [valAmount, setValAmount] = useState(String(deal.value));

  const [stageOpen, setStageOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);

  const isSelected = !!selectedRows[deal.id];

  const handleNameBlur = () => {
    setEditingName(false);
    if (nameValue.trim() && nameValue !== deal.name) {
      updateDeal(deal.id, { name: nameValue.trim() });
    }
  };

  const handleValueBlur = () => {
    setEditingValue(false);
    const num = Number(valAmount.replace(/[^0-9.]/g, ''));
    if (!isNaN(num) && num >= 0 && num !== deal.value) {
      updateDeal(deal.id, { value: num });
    }
  };

  const stages: DealStage[] = ['lead', 'contacted', 'proposal', 'negotiation', 'won', 'lost'];
  const priorities: DealPriority[] = ['critical', 'high', 'medium', 'low'];

  return (
    <tr 
      className={`group border-b border-slate-100 hover:bg-blue-50/30 transition-colors text-xs text-slate-700 select-none ${
        isSelected ? 'bg-blue-50/60' : 'bg-white'
      }`}
    >
      {/* Selection Checkbox & Color Border indicator */}
      <td className="w-10 px-2 py-2.5 text-center relative">
        <div 
          className="absolute left-0 top-0 bottom-0 w-1" 
          style={{ backgroundColor: groupColor }} 
        />
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={() => toggleRowSelect(deal.id)}
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      </td>

      {/* Item / Deal Name (Inline Editable) & Drawer Button */}
      <td className="px-3 py-2.5 min-w-[280px]">
        <div className="flex items-center justify-between gap-2">
          {editingName ? (
            <input
              type="text"
              autoFocus
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameBlur();
                if (e.key === 'Escape') {
                  setNameValue(deal.name);
                  setEditingName(false);
                }
              }}
              className="w-full px-2 py-1 text-xs font-semibold text-slate-800 bg-white border border-blue-500 rounded shadow-sm focus:outline-none"
            />
          ) : (
            <div 
              onClick={() => setEditingName(true)}
              className="flex-1 font-semibold text-slate-900 truncate hover:text-blue-600 cursor-pointer"
              title="Click to edit deal name"
            >
              {deal.name}
              <span className="block text-[11px] font-normal text-slate-400 truncate mt-0.5">
                {deal.company} • {deal.industry}
              </span>
            </div>
          )}

          {/* Monday style Updates drawer toggle */}
          <button
            onClick={() => setSelectedDealId(deal.id)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all ${
              deal.updates.length > 0 
                ? 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100' 
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 opacity-0 group-hover:opacity-100'
            }`}
            title="Open Updates & Activity Drawer"
          >
            <MessageSquare className="w-3 h-3" />
            {deal.updates.length > 0 && <span>{deal.updates.length}</span>}
          </button>
        </div>
      </td>

      {/* Owner / Assignee */}
      <td className="px-3 py-2.5 text-center relative w-36">
        <div 
          onClick={() => setOwnerOpen(!ownerOpen)}
          className="cursor-pointer inline-flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-100"
          title="Change owner"
        >
          <Avatar user={deal.owner} size="sm" />
          <span className="truncate max-w-[70px] text-left text-slate-700">{deal.owner.name.split(' ')[0]}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>

        {ownerOpen && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setOwnerOpen(false)} />
            <div className="absolute left-2 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-30 p-1 w-44">
              {team.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    updateDeal(deal.id, { owner: m });
                    setOwnerOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-left text-xs hover:bg-slate-50 transition-colors ${
                    deal.owner.id === m.id ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-700'
                  }`}
                >
                  <Avatar user={m} size="sm" />
                  <div className="truncate">
                    <div>{m.name}</div>
                    <div className="text-[10px] text-slate-400">{m.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </td>

      {/* Deal Stage (Monday status pill) */}
      <td className="px-3 py-2.5 text-center relative w-36">
        <div className="inline-block relative">
          <StageBadge 
            stage={deal.stage} 
            onClick={() => setStageOpen(!stageOpen)}
            className="w-28 text-center"
          />

          {stageOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setStageOpen(false)} />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-30 p-1.5 w-36 space-y-1">
                {stages.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      moveDealStage(deal.id, st);
                      setStageOpen(false);
                    }}
                    className="w-full block"
                  >
                    <StageBadge stage={st} className="w-full text-center" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </td>

      {/* Deal Value (Inline editable currency) */}
      <td className="px-3 py-2.5 text-right font-semibold text-slate-800 w-32">
        {editingValue ? (
          <input
            type="number"
            autoFocus
            value={valAmount}
            onChange={(e) => setValAmount(e.target.value)}
            onBlur={handleValueBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleValueBlur();
              if (e.key === 'Escape') {
                setValAmount(String(deal.value));
                setEditingValue(false);
              }
            }}
            className="w-24 px-1.5 py-0.5 text-right font-bold text-slate-900 border border-blue-500 rounded focus:outline-none"
          />
        ) : (
          <span 
            onClick={() => setEditingValue(true)}
            className="cursor-pointer hover:text-blue-600 hover:underline inline-block"
            title="Click to edit deal value"
          >
            ₱{deal.value.toLocaleString()}
          </span>
        )}
      </td>

      {/* Priority */}
      <td className="px-3 py-2.5 text-center relative w-32">
        <div className="inline-block relative">
          <PriorityBadge 
            priority={deal.priority}
            onClick={() => setPriorityOpen(!priorityOpen)}
            className="w-24"
          />

          {priorityOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setPriorityOpen(false)} />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-30 p-1.5 w-32 space-y-1">
                {priorities.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      updateDeal(deal.id, { priority: p });
                      setPriorityOpen(false);
                    }}
                    className="w-full block"
                  >
                    <PriorityBadge priority={p} className="w-full" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </td>

      {/* Close Date */}
      <td className="px-3 py-2.5 text-center text-slate-600 w-32">
        <input 
          type="date" 
          value={deal.closeDate}
          onChange={(e) => updateDeal(deal.id, { closeDate: e.target.value })}
          className="text-xs bg-transparent border-0 text-slate-700 hover:bg-slate-100 rounded px-1.5 py-0.5 cursor-pointer focus:ring-1 focus:ring-blue-400 focus:outline-none"
        />
      </td>

      {/* Win Probability */}
      <td className="px-3 py-2.5 w-32">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                deal.probability >= 80 
                  ? 'bg-[#00c875]' 
                  : deal.probability >= 50 
                  ? 'bg-blue-500' 
                  : 'bg-amber-500'
              }`}
              style={{ width: `${deal.probability}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-slate-600 w-7 text-right">
            {deal.probability}%
          </span>
        </div>
      </td>

      {/* Row Actions: Delete */}
      <td className="px-2 py-2.5 text-center w-12">
        <button
          onClick={() => {
            if (confirm(`Delete deal "${deal.name}"?`)) {
              deleteDeal(deal.id);
            }
          }}
          className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
          title="Delete row"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
};
