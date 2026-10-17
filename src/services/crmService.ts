import { DealItem, TableGroup, OpsRequest, NotificationItem, TeamMember, WorkspaceItem, ChatMessage, ChatChannel } from '../types/crm';
import { initialDeals, initialGroups, initialOpsRequests, initialNotifications, initialTeamMembers, initialWorkspaces, initialChatChannels, initialChatMessages } from '../data/initialData';

const STORAGE_KEYS = {
  DEALS: 'pipelinepro_deals_v3',
  GROUPS: 'pipelinepro_groups_v3',
  OPS: 'pipelinepro_ops_v3',
  NOTIFICATIONS: 'pipelinepro_notifications_v3',
  TEAM: 'pipelinepro_team_v3',
  WORKSPACES: 'pipelinepro_workspaces_v3',
  CHANNELS: 'pipelinepro_channels_v3',
  MESSAGES: 'pipelinepro_messages_v3',
  AUTH_USER: 'pipelinepro_auth_user_v3'
};

export class CrmService {
  // Workspaces
  static getWorkspaces(): WorkspaceItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORKSPACES);
      return data ? JSON.parse(data) : initialWorkspaces;
    } catch {
      return initialWorkspaces;
    }
  }

  static saveWorkspaces(workspaces: WorkspaceItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.WORKSPACES, JSON.stringify(workspaces));
    } catch (e) {
      console.error('Failed to save workspaces to localStorage', e);
    }
  }

  // Chat Channels
  static getChatChannels(): ChatChannel[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHANNELS);
      return data ? JSON.parse(data) : initialChatChannels;
    } catch {
      return initialChatChannels;
    }
  }

  static saveChatChannels(channels: ChatChannel[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(channels));
    } catch (e) {
      console.error('Failed to save channels to localStorage', e);
    }
  }

  // Chat Messages
  static getChatMessages(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return data ? JSON.parse(data) : initialChatMessages;
    } catch {
      return initialChatMessages;
    }
  }

  static saveChatMessages(messages: ChatMessage[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save messages to localStorage', e);
    }
  }

  // Current User / Auth
  static getAuthUser(): TeamMember | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static saveAuthUser(user: TeamMember | null): void {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      }
    } catch (e) {
      console.error('Failed to save auth user to localStorage', e);
    }
  }

  // Deals
  static getDeals(): DealItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEALS);
      return data ? JSON.parse(data) : initialDeals;
    } catch {
      return initialDeals;
    }
  }

  static saveDeals(deals: DealItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
    } catch (e) {
      console.error('Failed to save deals to localStorage', e);
    }
  }

  // Groups
  static getGroups(): TableGroup[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GROUPS);
      return data ? JSON.parse(data) : initialGroups;
    } catch {
      return initialGroups;
    }
  }

  static saveGroups(groups: TableGroup[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
    } catch (e) {
      console.error('Failed to save groups to localStorage', e);
    }
  }

  // Operational Requests
  static getOpsRequests(): OpsRequest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OPS);
      return data ? JSON.parse(data) : initialOpsRequests;
    } catch {
      return initialOpsRequests;
    }
  }

  static saveOpsRequests(requests: OpsRequest[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.OPS, JSON.stringify(requests));
    } catch (e) {
      console.error('Failed to save ops requests to localStorage', e);
    }
  }

  // Notifications
  static getNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  }

  static saveNotifications(notifications: NotificationItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to save notifications to localStorage', e);
    }
  }

  // Team
  static getTeam(): TeamMember[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEAM);
      return data ? JSON.parse(data) : initialTeamMembers;
    } catch {
      return initialTeamMembers;
    }
  }

  static saveTeam(team: TeamMember[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(team));
    } catch (e) {
      console.error('Failed to save team to localStorage', e);
    }
  }

  // Reset to demo data
  static resetToDemoData(): { 
    deals: DealItem[]; 
    groups: TableGroup[]; 
    ops: OpsRequest[]; 
    notifications: NotificationItem[]; 
    team: TeamMember[]; 
    workspaces: WorkspaceItem[];
    channels: ChatChannel[];
    messages: ChatMessage[];
  } {
    localStorage.removeItem(STORAGE_KEYS.DEALS);
    localStorage.removeItem(STORAGE_KEYS.GROUPS);
    localStorage.removeItem(STORAGE_KEYS.OPS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.TEAM);
    localStorage.removeItem(STORAGE_KEYS.WORKSPACES);
    localStorage.removeItem(STORAGE_KEYS.CHANNELS);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    return {
      deals: initialDeals,
      groups: initialGroups,
      ops: initialOpsRequests,
      notifications: initialNotifications,
      team: initialTeamMembers,
      workspaces: initialWorkspaces,
      channels: initialChatChannels,
      messages: initialChatMessages
    };
  }

  // Export JSON
  static exportWorkspaceJSON(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      deals: this.getDeals(),
      groups: this.getGroups(),
      opsRequests: this.getOpsRequests()
    };
    return JSON.stringify(backup, null, 2);
  }

  // Export CSV of deals
  static exportDealsCSV(): string {
    const deals = this.getDeals();
    const headers = ['Deal Name', 'Company', 'Stage', 'Value (₱)', 'Close Date', 'Priority', 'Owner', 'Probability (%)', 'Industry'];
    const rows = deals.map(d => [
      `"${d.name.replace(/"/g, '""')}"`,
      `"${d.company.replace(/"/g, '""')}"`,
      d.stage,
      d.value,
      d.closeDate,
      d.priority,
      `"${d.owner.name}"`,
      d.probability,
      `"${d.industry}"`
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}
