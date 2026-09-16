import React from 'react';
import { 
  Building2, 
  Calendar, 
  MessageSquare, 
  DollarSign, 
  GripVertical 
} from 'lucide-react';
import { DealItem } from '../../types/crm';
import { useCrmStore } from '../../store/useCrmStore';
import { PriorityBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';

interface KanbanCardProps {
  deal: DealItem;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ deal }) => {
  const { setSelectedDealId } = useCrmStore();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', deal.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => setSelectedDealId(deal.id)}
      className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing group relative select-none"
    >
      {/* Card Header: Company & Priority */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 truncate">
          <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
          <span className="truncate">{deal.company}</span>
        </span>
        <PriorityBadge priority={deal.priority} />
      </div>

      {/* Deal Name */}
      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
        {deal.name}
      </h4>

      {/* Probability Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
          <span>Confidence</span>
          <span className="font-bold text-slate-700">{deal.probability}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              deal.probability >= 80 ? 'bg-[#00c875]' : deal.probability >= 50 ? 'bg-blue-500' : 'bg-amber-500'
            }`}
            style={{ width: `${deal.probability}%` }}
          />
        </div>
      </div>

      {/* Footer: Value, Close Date, Owner & Comments */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <div className="font-extrabold text-xs text-slate-900">
          ₱{deal.value.toLocaleString()}
        </div>

        <div className="flex items-center gap-2">
          {deal.updates.length > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              <MessageSquare className="w-2.5 h-2.5" />
              {deal.updates.length}
            </span>
          )}

          <Avatar user={deal.owner} size="sm" />
        </div>
      </div>
    </div>
  );
};
