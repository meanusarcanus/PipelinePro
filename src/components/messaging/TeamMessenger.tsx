import React, { useState, useRef, useEffect } from 'react';
import { useCrmStore } from '../../store/useCrmStore';
import { 
  MessageSquare, 
  X, 
  Send, 
  Hash, 
  Users, 
  Minimize2, 
  Maximize2, 
  Sparkles, 
  Smile,
  Paperclip,
  CheckCheck
} from 'lucide-react';
import { Avatar } from '../common/Avatar';

export const TeamMessenger: React.FC = () => {
  const { 
    channels, 
    activeChannelId, 
    messages, 
    isMessengerOpen, 
    currentUser, 
    setActiveChannelId, 
    setMessengerOpen, 
    sendMessage 
  } = useCrmStore();

  const [inputVal, setInputVal] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];
  const channelMessages = messages.filter(m => m.channelId === (activeChannel?.id || 'deal-war-room'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isMessengerOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [channelMessages.length, isMessengerOpen, isMinimized, activeChannelId]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || !activeChannel) return;
    sendMessage(activeChannel.id, inputVal.trim());
    setInputVal('');
  };

  const handleQuickPrompt = (text: string) => {
    if (!activeChannel) return;
    sendMessage(activeChannel.id, text);
  };

  if (!isMessengerOpen) {
    return (
      <button
        onClick={() => setMessengerOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all duration-200 group border border-blue-400/30"
        title="Open Team Collaboration Messenger"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 transition-transform group-hover:-rotate-6" />
          <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
        <span className="text-sm font-semibold tracking-wide pr-1">Team Chat</span>
      </button>
    );
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 z-40 bg-white rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden transition-all duration-300 ${
        isMinimized 
          ? 'w-80 h-14' 
          : 'w-[420px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-6rem)]'
      }`}
    >
      {/* Header */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-sm select-none">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600/90 flex items-center justify-center text-white font-bold text-xs shadow-inner">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white truncate">
                {activeChannel?.name || 'Team Chat'}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Active
              </span>
            </div>
            {!isMinimized && (
              <p className="text-[11px] text-slate-400 truncate">
                {activeChannel?.description || 'Real-time sales & ops updates'}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMessengerOpen(false)}
            className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Close Messenger"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Channel Tabs */}
          <div className="flex items-center gap-1 px-3 py-2 bg-slate-50 border-b border-slate-200 overflow-x-auto text-xs shrink-0">
            {channels.map((chan) => {
              const isActive = chan.id === activeChannel?.id;
              return (
                <button
                  key={chan.id}
                  onClick={() => setActiveChannelId(chan.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <Hash className="w-3.5 h-3.5 opacity-70" />
                  <span>{chan.name.replace('#', '')}</span>
                  {chan.unreadCount && chan.unreadCount > 0 && !isActive ? (
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-blue-50/50 border-b border-blue-100 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0">
            <span className="text-blue-600 font-semibold flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3" /> Quick:
            </span>
            <button
              onClick={() => handleQuickPrompt('Can we get an updated ETA on the Globe Telecom proposal?')}
              className="px-2 py-0.5 bg-white border border-blue-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 rounded-full whitespace-nowrap transition-colors"
            >
              Globe Telecom ETA
            </button>
            <button
              onClick={() => handleQuickPrompt('Has the legal team approved the custom payment terms?')}
              className="px-2 py-0.5 bg-white border border-blue-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 rounded-full whitespace-nowrap transition-colors"
            >
              Check Legal SLA
            </button>
            <button
              onClick={() => handleQuickPrompt('Great job closing the San Miguel deal team!')}
              className="px-2 py-0.5 bg-white border border-blue-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 rounded-full whitespace-nowrap transition-colors"
            >
              Kudos to Reps
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40">
            {channelMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-6">
                <Users className="w-8 h-8 mb-2 opacity-40 text-blue-500" />
                <p className="text-xs font-medium text-slate-600">No messages yet in #{activeChannel?.name}</p>
                <p className="text-[11px] text-slate-400 mt-1">Start the conversation with your sales and operations team!</p>
              </div>
            ) : (
              channelMessages.map((msg) => {
                const isMe = msg.sender.id === currentUser.id;
                return (
                  <div 
                    key={msg.id}
                    className={`flex items-start gap-2.5 group ${isMe ? 'flex-row-reverse' : ''}`}
                  >
                    <Avatar user={msg.sender} size="md" />

                    <div className={`flex flex-col max-w-[78%] ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-1.5 mb-1 px-0.5">
                        <span className="text-[11px] font-semibold text-slate-700">
                          {isMe ? 'You' : msg.sender.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {msg.timestamp}
                        </span>
                      </div>

                      <div 
                        className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-sm transition-all ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>

                      {isMe && (
                        <div className="flex items-center gap-0.5 text-[10px] text-slate-400 mt-0.5 mr-1">
                          <CheckCheck className="w-3 h-3 text-blue-500" />
                          <span>Sent</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form 
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-slate-200 shrink-0"
          >
            <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-1.5 border border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={`Message #${activeChannel?.name.replace('#', '') || 'chat'}...`}
                className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none py-1.5"
              />
              <div className="flex items-center gap-1 text-slate-400">
                <button
                  type="button"
                  className="p-1 hover:text-slate-600 rounded transition-colors"
                  title="Emoji"
                >
                  <Smile className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1 hover:text-slate-600 rounded transition-colors"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  className="p-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                  title="Send message (Enter)"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between px-1 mt-1 text-[10px] text-slate-400">
              <span>Press <kbd className="bg-slate-200 text-slate-700 px-1 py-0.5 rounded text-[9px] font-mono">Enter</kbd> to send</span>
              <span>Online as: <span className="font-semibold text-slate-600">{currentUser.name}</span></span>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
