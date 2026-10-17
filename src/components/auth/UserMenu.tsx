import React, { useState } from 'react';
import { 
  ChevronDown, 
  LogOut, 
  UserCheck, 
  Sparkles,
  Check,
  Smartphone,
  Laptop,
  Cpu,
  Users,
  UserPlus
} from 'lucide-react';
import { useCrmStore } from '../../store/useCrmStore';
import { Avatar } from '../common/Avatar';
import { DeviceMode } from '../../types/crm';

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    currentUser, 
    team, 
    switchUser, 
    setLoginModalOpen, 
    logout,
    deviceMode,
    setDeviceMode,
    setTeamModalOpen 
  } = useCrmStore();

  const deviceOptions: { mode: DeviceMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { mode: 'auto', label: 'Auto Detect (Responsive)', icon: Cpu },
    { mode: 'mobile', label: 'Smartphone Mode', icon: Smartphone },
    { mode: 'desktop', label: 'Desktop Mode', icon: Laptop },
  ];

  return (
    <div className="relative select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
      >
        <Avatar user={currentUser} size="md" />
        <div className="hidden xl:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</span>
          <span className="text-[10px] text-slate-400 leading-tight font-medium">{currentUser.role}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-68 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-40 animate-fadeIn">
            {/* User Profile Header */}
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Avatar user={currentUser} size="md" />
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Device Experience Switcher */}
            <div className="p-2 border-b border-slate-100">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-indigo-500" />
                Device Layout Mode
              </div>

              <div className="space-y-0.5 mt-1">
                {deviceOptions.map(({ mode, label, icon: Icon }) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setDeviceMode(mode);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      deviceMode === mode 
                        ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{label}</span>
                    </div>
                    {deviceMode === mode && (
                      <Check className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Persona Switcher Menu */}
            <div className="p-2 border-b border-slate-100">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Switch Active Persona
                </span>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setTeamModalOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-0.5 capitalize hover:underline"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Manage</span>
                </button>
              </div>

              <div className="space-y-0.5 mt-1">
                {team.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => {
                      switchUser(member);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      currentUser.id === member.id 
                        ? 'bg-blue-50 font-semibold text-blue-700' 
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Avatar user={member} size="sm" />
                      <div className="truncate">
                        <div className="truncate">{member.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{member.role}</div>
                      </div>
                    </div>
                    {currentUser.id === member.id && (
                      <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-1 space-y-0.5">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setTeamModalOpen(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 transition-colors font-medium"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>Team & Commercial Seats</span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  team.length >= 10 ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {team.length}/10
                </span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setLoginModalOpen(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Open Login Dialog</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50 transition-colors font-medium"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
