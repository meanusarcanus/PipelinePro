import { create } from 'zustand';
import { 
  DealItem, 
  TableGroup, 
  OpsRequest, 
  NotificationItem, 
  TeamMember, 
  AppView, 
  FilterState, 
  DealStage, 
  OpsRequestStatus,
  UpdateComment,
  ActivityLogEntry,
  WorkspaceItem,
  ChatMessage,
  ChatChannel,
  ToastItem,
  DeviceMode
} from '../types/crm';
import { CrmService } from '../services/crmService';
import confetti from 'canvas-confetti';

interface CrmStoreState {
  currentView: AppView;
  workspaces: WorkspaceItem[];
  activeWorkspaceId: string;
  deals: DealItem[];
  groups: TableGroup[];
  opsRequests: OpsRequest[];
  notifications: NotificationItem[];
  team: TeamMember[];
  currentUser: TeamMember;
  selectedDealId: string | null;
  collapsedGroups: Record<string, boolean>;
  filters: FilterState;
  
  // Auth & persona
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  login: (user: TeamMember) => void;
  logout: () => void;
  switchUser: (user: TeamMember) => void;
  setLoginModalOpen: (open: boolean) => void;

  // Messaging hub
  channels: ChatChannel[];
  activeChannelId: string;
  messages: ChatMessage[];
  isMessengerOpen: boolean;
  setActiveChannelId: (channelId: string) => void;
  setMessengerOpen: (open: boolean) => void;
  sendMessage: (channelId: string, text: string) => void;

  // Toasts & Demo alerts
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  triggerDemoAlert: () => void;
  handleNotificationClick: (notif: NotificationItem) => void;
  // Device Mode & PWA
  deviceMode: DeviceMode;
  mobileViewType: 'cards' | 'grid';
  pwaInstallPrompt: any | null;
  setDeviceMode: (mode: DeviceMode) => void;
  setMobileViewType: (type: 'cards' | 'grid') => void;
  setPwaInstallPrompt: (prompt: any) => void;

  // UI states
  isNewDealModalOpen: boolean;
  isNewOpsModalOpen: boolean;
  isNotificationOpen: boolean;
  selectedRows: Record<string, boolean>;

  // Actions
  setCurrentView: (view: AppView) => void;
  setActiveWorkspaceId: (workspaceId: string) => void;
  setSelectedDealId: (id: string | null) => void;
  toggleGroupCollapse: (groupId: string) => void;
  setAllGroupsCollapse: (collapsed: boolean) => void;
  
  // Deal operations
  updateDeal: (dealId: string, updates: Partial<DealItem>, logChange?: boolean) => void;
  addDeal: (dealData: Partial<DealItem> & { name: string; company: string; value: number }) => void;
  deleteDeal: (dealId: string) => void;
  moveDealStage: (dealId: string, newStage: DealStage) => void;
  addCommentToDeal: (dealId: string, text: string) => void;
  toggleLikeComment: (dealId: string, commentId: string) => void;
  
  // Ops requests
  updateOpsRequestStatus: (requestId: string, status: OpsRequestStatus, note?: string) => void;
  addOpsRequest: (reqData: Partial<OpsRequest> & { title: string; company: string; type: any }) => void;
  
  // Filters & selection
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  toggleRowSelect: (dealId: string) => void;
  selectAllRows: (selected: boolean) => void;
  bulkUpdateStage: (stage: DealStage) => void;
  bulkDelete: () => void;

  // Modals & Drawers
  setNewDealModalOpen: (open: boolean) => void;
  setNewOpsModalOpen: (open: boolean) => void;
  setNotificationOpen: (open: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: NotificationItem) => void;

  // Workspace
  resetToDemoData: () => void;
  exportCSV: () => void;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  stageFilter: 'all',
  priorityFilter: 'all',
  ownerFilter: 'all',
  industryFilter: 'all',
  sortBy: 'closeDate',
  sortDirection: 'asc'
};

const playChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Ignore audio restriction
  }
};

export const useCrmStore = create<CrmStoreState>((set, get) => ({
  currentView: 'table',
  workspaces: CrmService.getWorkspaces(),
  activeWorkspaceId: 'enterprise',
  deals: CrmService.getDeals(),
  groups: CrmService.getGroups(),
  opsRequests: CrmService.getOpsRequests(),
  notifications: CrmService.getNotifications(),
  team: CrmService.getTeam(),
  currentUser: CrmService.getAuthUser() || CrmService.getTeam()[0],
  selectedDealId: null,
  collapsedGroups: {},
  filters: defaultFilters,

  // Auth
  isAuthenticated: true,
  isLoginModalOpen: false,
  login: (user) => {
    CrmService.saveAuthUser(user);
    set({ currentUser: user, isAuthenticated: true, isLoginModalOpen: false });
    get().addToast({
      title: `Welcome back, ${user.name}!`,
      message: `Signed in as ${user.role}. All enterprise permissions loaded.`,
      type: 'success'
    });
  },
  logout: () => {
    CrmService.saveAuthUser(null);
    set({ isAuthenticated: false, isLoginModalOpen: true });
  },
  switchUser: (user) => {
    CrmService.saveAuthUser(user);
    set({ currentUser: user, isAuthenticated: true });
    get().addToast({
      title: `Switched Active Persona`,
      message: `Now acting as ${user.name} (${user.role})`,
      type: 'info'
    });
  },
  setLoginModalOpen: (open) => set({ isLoginModalOpen: open }),

  // Messaging hub
  channels: CrmService.getChatChannels(),
  activeChannelId: 'channel-war-room',
  messages: CrmService.getChatMessages(),
  isMessengerOpen: false,
  setActiveChannelId: (channelId) => set({ activeChannelId: channelId }),
  setMessengerOpen: (open) => set({ isMessengerOpen: open }),
  sendMessage: (channelId, text) => {
    const sender = get().currentUser;
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      channelId,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextMessages = [...get().messages, newMsg];
    CrmService.saveChatMessages(nextMessages);
    set({ messages: nextMessages });

    // Intelligent simulated response
    setTimeout(() => {
      const teammates = get().team.filter(t => t.id !== sender.id);
      const randomTeammate = teammates[Math.floor(Math.random() * teammates.length)] || get().team[0];
      
      let replyText = 'Acknowledged. I am reviewing the figures now.';
      if (text.toLowerCase().includes('discount') || text.toLowerCase().includes('pricing')) {
        replyText = `Understood. Make sure to check the margin threshold before submitting to executive ops.`;
      } else if (text.toLowerCase().includes('demo') || text.toLowerCase().includes('sandbox')) {
        replyText = `The staging environment is primed and healthy. Let me know if you need mock datasets.`;
      } else if (text.toLowerCase().includes('closed') || text.toLowerCase().includes('won')) {
        replyText = `Huge milestone! Let's get customer success aligned on the onboarding kickoff call! 🚀`;
      } else {
        replyText = `Thanks for the update, ${sender.name.split(' ')[0]}! Synced into my pipeline notes.`;
      }

      const simMsg: ChatMessage = {
        id: 'msg-' + Date.now(),
        channelId,
        sender: randomTeammate,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSimulated: true
      };

      const updated = [...get().messages, simMsg];
      CrmService.saveChatMessages(updated);
      set({ messages: updated });
      playChime();
    }, 1200);
  },

  // Toasts
  toasts: [],
  addToast: (toastData) => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substring(2, 5);
    const newToast: ToastItem = { ...toastData, id };
    set(s => ({ toasts: [...s.toasts, newToast] }));
    playChime();

    const duration = toastData.duration || 4500;
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },
  removeToast: (id) => {
    set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }));
  },
  triggerDemoAlert: () => {
    const sampleAlerts = [
      {
        title: 'New High-Value Lead Assigned',
        message: 'A ₱420,000 ARR enterprise retail prospect just booked a demo.',
        type: 'success' as const
      },
      {
        title: 'Urgent Ops Review Required',
        message: 'HealthPulse Analytics BAA compliance audit deadline is within 6 hours.',
        type: 'warning' as const
      },
      {
        title: 'Contract Executed Online 🎉',
        message: 'Quantum Retail countersigned the tier-1 support addendum!',
        type: 'success' as const
      }
    ];
    const alert = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];
    get().addToast(alert);
    get().addNotification({
      id: 'notif-' + Date.now(),
      title: alert.title,
      description: alert.message,
      type: alert.type,
      timestamp: 'Just now',
      read: false,
      dealId: 'deal-1',
      viewTarget: 'ops'
    });
  },
  handleNotificationClick: (notif) => {
    get().markNotificationRead(notif.id);
    if (notif.viewTarget) {
      get().setCurrentView(notif.viewTarget);
    }
    if (notif.dealId) {
      get().setSelectedDealId(notif.dealId);
    }
    set({ isNotificationOpen: false });
  },
  
  // Device mode & PWA
  deviceMode: 'auto',
  mobileViewType: 'cards',
  pwaInstallPrompt: null,
  setDeviceMode: (mode) => set({ deviceMode: mode }),
  setMobileViewType: (type) => set({ mobileViewType: type }),
  setPwaInstallPrompt: (prompt) => set({ pwaInstallPrompt: prompt }),

  isNewDealModalOpen: false,
  isNewOpsModalOpen: false,
  isNotificationOpen: false,
  selectedRows: {},

  setCurrentView: (view) => set({ currentView: view }),
  setActiveWorkspaceId: (workspaceId) => set({ activeWorkspaceId: workspaceId, selectedRows: {} }),
  setSelectedDealId: (id) => set({ selectedDealId: id }),

  toggleGroupCollapse: (groupId) => set((state) => ({
    collapsedGroups: {
      ...state.collapsedGroups,
      [groupId]: !state.collapsedGroups[groupId]
    }
  })),

  setAllGroupsCollapse: (collapsed) => set((state) => {
    const next: Record<string, boolean> = {};
    state.groups.forEach(g => { next[g.id] = collapsed; });
    return { collapsedGroups: next };
  }),

  updateDeal: (dealId, updates, logChange = true) => {
    set((state) => {
      const deal = state.deals.find(d => d.id === dealId);
      if (!deal) return state;

      const updatedActivity = [...deal.activityLog];
      if (logChange) {
        Object.entries(updates).forEach(([key, val]) => {
          if (key !== 'updates' && key !== 'activityLog') {
            const prev = (deal as any)[key];
            if (prev !== val) {
              const logEntry: ActivityLogEntry = {
                id: 'act-' + Date.now() + Math.random().toString(36).substr(2, 4),
                author: state.currentUser.name,
                action: `Updated ${key}`,
                field: key,
                previousValue: String(prev ?? ''),
                newValue: String(val ?? ''),
                timestamp: 'Just now'
              };
              updatedActivity.unshift(logEntry);
            }
          }
        });
      }

      const newDeals = state.deals.map(d => {
        if (d.id === dealId) {
          return {
            ...d,
            ...updates,
            activityLog: updatedActivity
          };
        }
        return d;
      });

      CrmService.saveDeals(newDeals);
      return { deals: newDeals };
    });
  },

  addDeal: (dealData) => {
    set((state) => {
      const newId = 'deal-' + Date.now();
      const newDeal: DealItem = {
        id: newId,
        name: dealData.name,
        company: dealData.company,
        contactName: dealData.contactName || 'Pending Contact',
        contactEmail: dealData.contactEmail || 'contact@example.com',
        stage: dealData.stage || 'lead',
        value: Number(dealData.value) || 0,
        closeDate: dealData.closeDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        priority: dealData.priority || 'medium',
        owner: dealData.owner || state.currentUser,
        probability: dealData.probability ?? 40,
        groupId: dealData.groupId || state.groups[0]?.id || 'active',
        industry: dealData.industry || 'Technology & SaaS',
        workspaceId: dealData.workspaceId || state.activeWorkspaceId || 'enterprise',
        notes: dealData.notes || '',
        updates: [],
        activityLog: [
          {
            id: 'act-' + Date.now(),
            author: state.currentUser.name,
            action: 'Created opportunity record',
            timestamp: 'Just now'
          }
        ],
        createdAt: new Date().toISOString().split('T')[0],
        lastContactDate: new Date().toISOString().split('T')[0]
      };

      const newDeals = [newDeal, ...state.deals];
      CrmService.saveDeals(newDeals);

      // Add notification
      const newNotif: NotificationItem = {
        id: 'notif-' + Date.now(),
        title: 'New Deal Added',
        description: `${newDeal.name} was added by ${state.currentUser.name}`,
        type: 'info',
        timestamp: 'Just now',
        read: false
      };
      const newNotifs = [newNotif, ...state.notifications];
      CrmService.saveNotifications(newNotifs);

      return { deals: newDeals, notifications: newNotifs, isNewDealModalOpen: false };
    });
  },

  deleteDeal: (dealId) => {
    set((state) => {
      const newDeals = state.deals.filter(d => d.id !== dealId);
      CrmService.saveDeals(newDeals);
      return { 
        deals: newDeals, 
        selectedDealId: state.selectedDealId === dealId ? null : state.selectedDealId 
      };
    });
  },

  moveDealStage: (dealId, newStage) => {
    const currentDeal = get().deals.find(d => d.id === dealId);
    if (!currentDeal || currentDeal.stage === newStage) return;

    if (newStage === 'won') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti fallback
      }
    }

    get().updateDeal(dealId, {
      stage: newStage,
      probability: newStage === 'won' ? 100 : newStage === 'lost' ? 0 : currentDeal.probability
    });

    // Notify
    if (newStage === 'won') {
      const winNotif: NotificationItem = {
        id: 'notif-' + Date.now(),
        title: 'Closed Won! 🎉',
        description: `${currentDeal.company} (₱${currentDeal.value.toLocaleString()}) marked as Closed Won!`,
        type: 'success',
        timestamp: 'Just now',
        read: false
      };
      set(s => {
        const notifs = [winNotif, ...s.notifications];
        CrmService.saveNotifications(notifs);
        return { notifications: notifs };
      });
    }
  },

  addCommentToDeal: (dealId, text) => {
    set((state) => {
      const user = state.currentUser;
      const newComment: UpdateComment = {
        id: 'comm-' + Date.now(),
        author: user,
        content: text,
        timestamp: 'Just now',
        likes: 0
      };

      const newDeals = state.deals.map(d => {
        if (d.id === dealId) {
          return {
            ...d,
            updates: [newComment, ...d.updates],
            activityLog: [
              {
                id: 'act-' + Date.now(),
                author: user.name,
                action: 'Posted an update note',
                timestamp: 'Just now'
              },
              ...d.activityLog
            ]
          };
        }
        return d;
      });

      CrmService.saveDeals(newDeals);
      return { deals: newDeals };
    });
  },

  toggleLikeComment: (dealId, commentId) => {
    set((state) => {
      const newDeals = state.deals.map(d => {
        if (d.id === dealId) {
          const newUpdates = d.updates.map(u => {
            if (u.id === commentId) {
              const hasLiked = !u.hasLiked;
              return {
                ...u,
                hasLiked,
                likes: hasLiked ? u.likes + 1 : Math.max(0, u.likes - 1)
              };
            }
            return u;
          });
          return { ...d, updates: newUpdates };
        }
        return d;
      });

      CrmService.saveDeals(newDeals);
      return { deals: newDeals };
    });
  },

  updateOpsRequestStatus: (requestId, status, note) => {
    set((state) => {
      const newRequests = state.opsRequests.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            status,
            approvalNote: note || r.approvalNote,
            approver: state.currentUser,
            updatedAt: 'Just now'
          };
        }
        return r;
      });

      CrmService.saveOpsRequests(newRequests);

      // Trigger notification
      const req = state.opsRequests.find(r => r.id === requestId);
      const statusTitle = status === 'approved' ? 'Request Approved ✅' : status === 'rejected' ? 'Request Rejected ❌' : 'Request Updated';
      const newNotif: NotificationItem = {
        id: 'notif-' + Date.now(),
        title: statusTitle,
        description: `${req?.title || 'Operational ticket'} marked as ${status}.`,
        type: status === 'approved' ? 'success' : status === 'rejected' ? 'alert' : 'info',
        timestamp: 'Just now',
        read: false
      };
      const updatedNotifs = [newNotif, ...state.notifications];
      CrmService.saveNotifications(updatedNotifs);

      return { opsRequests: newRequests, notifications: updatedNotifs };
    });
  },

  addOpsRequest: (reqData) => {
    set((state) => {
      const newReq: OpsRequest = {
        id: 'ops-' + Date.now(),
        title: reqData.title,
        dealId: reqData.dealId,
        dealName: reqData.dealName,
        company: reqData.company,
        type: reqData.type || 'discount_approval',
        requestedBy: state.currentUser,
        status: 'pending',
        urgency: reqData.urgency || 'medium',
        discountPercent: reqData.discountPercent,
        amount: reqData.amount,
        notes: reqData.notes || '',
        slaHoursLeft: 24,
        createdAt: 'Just now',
        updatedAt: 'Just now'
      };

      const newOps = [newReq, ...state.opsRequests];
      CrmService.saveOpsRequests(newOps);

      const notif: NotificationItem = {
        id: 'notif-' + Date.now(),
        title: 'New Operational Ticket',
        description: `${newReq.title} submitted by ${state.currentUser.name}`,
        type: 'warning',
        timestamp: 'Just now',
        read: false
      };
      const newNotifs = [notif, ...state.notifications];
      CrmService.saveNotifications(newNotifs);

      return { opsRequests: newOps, notifications: newNotifs, isNewOpsModalOpen: false };
    });
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value
      }
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },

  toggleRowSelect: (dealId) => {
    set((state) => ({
      selectedRows: {
        ...state.selectedRows,
        [dealId]: !state.selectedRows[dealId]
      }
    }));
  },

  selectAllRows: (selected) => {
    set((state) => {
      const next: Record<string, boolean> = {};
      if (selected) {
        state.deals.forEach(d => { next[d.id] = true; });
      }
      return { selectedRows: next };
    });
  },

  bulkUpdateStage: (stage) => {
    set((state) => {
      const selectedIds = Object.keys(state.selectedRows).filter(id => state.selectedRows[id]);
      if (selectedIds.length === 0) return state;

      const newDeals = state.deals.map(d => {
        if (selectedIds.includes(d.id)) {
          return {
            ...d,
            stage,
            probability: stage === 'won' ? 100 : stage === 'lost' ? 0 : d.probability
          };
        }
        return d;
      });

      CrmService.saveDeals(newDeals);
      return { deals: newDeals, selectedRows: {} };
    });
  },

  bulkDelete: () => {
    set((state) => {
      const selectedIds = Object.keys(state.selectedRows).filter(id => state.selectedRows[id]);
      const newDeals = state.deals.filter(d => !selectedIds.includes(d.id));
      CrmService.saveDeals(newDeals);
      return { deals: newDeals, selectedRows: {} };
    });
  },

  setNewDealModalOpen: (open) => set({ isNewDealModalOpen: open }),
  setNewOpsModalOpen: (open) => set({ isNewOpsModalOpen: open }),
  setNotificationOpen: (open) => set({ isNotificationOpen: open }),

  markNotificationRead: (id) => {
    set((state) => {
      const updated = state.notifications.map(n => n.id === id ? { ...n, read: true } : n);
      CrmService.saveNotifications(updated);
      return { notifications: updated };
    });
  },

  markAllNotificationsRead: () => {
    set((state) => {
      const updated = state.notifications.map(n => ({ ...n, read: true }));
      CrmService.saveNotifications(updated);
      return { notifications: updated };
    });
  },

  addNotification: (notif) => {
    set((state) => {
      const next = [notif, ...state.notifications];
      CrmService.saveNotifications(next);
      return { notifications: next };
    });
  },

  resetToDemoData: () => {
    const data = CrmService.resetToDemoData();
    set({
      workspaces: data.workspaces,
      activeWorkspaceId: 'enterprise',
      deals: data.deals,
      groups: data.groups,
      opsRequests: data.ops,
      notifications: data.notifications,
      team: data.team,
      currentUser: data.team[0],
      channels: data.channels,
      messages: data.messages,
      activeChannelId: 'channel-war-room',
      selectedDealId: null,
      selectedRows: {},
      filters: defaultFilters
    });
  },

  exportCSV: () => {
    const csvContent = CrmService.exportDealsCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pipeline_pro_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}));
