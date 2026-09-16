import React, { useState } from 'react';
import { DealStage, DealItem } from '../../types/crm';
import { useCrmStore } from '../../store/useCrmStore';
import { KanbanCard } from './KanbanCard';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  stage: DealStage;
  title: string;
  color: string;
  deals: DealItem[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ stage, title, color, deals }) => {
  const { moveDealStage, setNewDealModalOpen } = useCrmStore();
  const [isDragOver, setIsDragOver] = useState(false);

  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const dealId = e.dataTransfer.getData('text/plain');
    if (dealId) {
      moveDealStage(dealId, stage);
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 min-w-[280px] max-w-[340px] bg-slate-100/70 rounded-2xl p-3 flex flex-col max-h-[calc(100vh-170px)] transition-all select-none ${
        isDragOver ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span 
            className="w-2.5 h-2.5 rounded-full" 
            style={{ backgroundColor: color }} 
          />
          <h3 className="text-xs font-bold text-slate-800 tracking-tight">
            {title}
          </h3>
          <span className="text-[11px] font-semibold bg-white text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
            {deals.length}
          </span>
        </div>

        <button
          onClick={() => setNewDealModalOpen(true)}
          className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-white transition-colors"
          title="Add deal to stage"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stage Total ARR summary */}
      <div className="mb-2 px-1 text-[11px] font-medium text-slate-500 flex justify-between">
        <span>Pipeline:</span>
        <span className="font-bold text-slate-800">₱{totalValue.toLocaleString()}</span>
      </div>

      {/* Cards List Container */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {deals.map((deal) => (
          <KanbanCard key={deal.id} deal={deal} />
        ))}

        {deals.length === 0 && (
          <div className="py-12 border-2 border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400 font-medium">
            Drag deals here
          </div>
        )}
      </div>
    </div>
  );
};
