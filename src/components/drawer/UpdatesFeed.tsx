import React, { useState } from 'react';
import { ThumbsUp, Send, Paperclip, MessageSquare } from 'lucide-react';
import { DealItem } from '../../types/crm';
import { useCrmStore } from '../../store/useCrmStore';
import { Avatar } from '../common/Avatar';

interface UpdatesFeedProps {
  deal: DealItem;
}

export const UpdatesFeed: React.FC<UpdatesFeedProps> = ({ deal }) => {
  const { addCommentToDeal, toggleLikeComment, currentUser } = useCrmStore();
  const [commentText, setCommentText] = useState('');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCommentToDeal(deal.id, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Comment Input Box (Monday style) */}
      <div className="p-4 bg-white border-b border-slate-200">
        <form onSubmit={handlePost} className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              placeholder={`Write an update for ${deal.name}, @mention teammates...`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-400 resize-none bg-slate-50/50 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Avatar user={currentUser} size="sm" />
              <span className="text-[11px] font-medium text-slate-600">Posting as {currentUser.name.split(' ')[0]}</span>
            </div>

            <button
              type="submit"
              disabled={!commentText.trim()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
            >
              <Send className="w-3 h-3" />
              Update
            </button>
          </div>
        </form>
      </div>

      {/* Feed list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {deal.updates.map((update) => (
          <div key={update.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Avatar user={update.author} size="sm" />
                <div>
                  <span className="text-xs font-bold text-slate-800">{update.author.name}</span>
                  <span className="text-[10px] text-slate-400 ml-2">{update.timestamp}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line mb-3">
              {update.content}
            </p>

            {/* Like & Reaction actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <button
                onClick={() => toggleLikeComment(deal.id, update.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded transition-colors font-medium ${
                  update.hasLiked
                    ? 'text-blue-600 bg-blue-50 font-bold'
                    : 'hover:bg-slate-100 text-slate-500'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${update.hasLiked ? 'fill-blue-600 text-blue-600' : ''}`} />
                <span>{update.likes} {update.likes === 1 ? 'Like' : 'Likes'}</span>
              </button>

              <span className="text-[11px] text-slate-400">Seen by team</span>
            </div>
          </div>
        ))}

        {deal.updates.length === 0 && (
          <div className="py-16 text-center text-slate-400 text-xs">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-600">No updates yet on this deal</p>
            <p className="text-[11px] mt-1">Start collaborating by posting notes, call logs, or client feedback above.</p>
          </div>
        )}
      </div>
    </div>
  );
};
