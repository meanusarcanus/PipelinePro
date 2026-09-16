export type DealStage = 'lead' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost';

export type DealPriority = 'critical' | 'high' | 'medium' | 'low';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  initials: string;
  color: string;
}

export interface UpdateComment {
  id: string;
  author: TeamMember;
  content: string;
  timestamp: string;
  likes: number;
  hasLiked?: boolean;
  attachments?: { name: string; size: string; type: string }[];
}

export interface ActivityLogEntry {
  id: string;
  author: string;
  action: string;
  field?: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface DealItem {
  id: string;
  name: string;
  company: string;
  contactName: string;
  contactEmail: string;
  stage: DealStage;
  value: number;
  closeDate: string;
  priority: DealPriority;
  owner: TeamMember;
  probability: number;
  groupId: string;
  industry: string;
  workspaceId?: string;
  notes?: string;
  updates: UpdateComment[];
  activityLog: ActivityLogEntry[];
  createdAt: string;
  lastContactDate?: string;
}

export interface WorkspaceItem {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface TableGroup {
  id: string;
  title: string;
  color: string; // Tailwind hex e.g. #579bfc, #00c875, #a25ddc
  workspaceId?: string;
}

export type OpsRequestType = 
  | 'discount_approval'
  | 'legal_msa' 
  | 'security_soc2' 
  | 'custom_integration' 
  | 'sandbox_provisioning';

export type OpsRequestStatus = 'pending' | 'in_review' | 'approved' | 'rejected';

export interface OpsRequest {
  id: string;
  title: string;
  dealId?: string;
  dealName?: string;
  company: string;
  type: OpsRequestType;
  requestedBy: TeamMember;
  approver?: TeamMember;
  status: OpsRequestStatus;
  urgency: DealPriority;
  discountPercent?: number;
  amount?: number;
  notes: string;
  slaHoursLeft: number;
  createdAt: string;
  updatedAt: string;
  approvalNote?: string;
}

export type AppView = 'table' | 'kanban' | 'analytics' | 'ops';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
  read: boolean;
  dealId?: string;
  viewTarget?: AppView;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  sender: TeamMember;
  text: string;
  timestamp: string;
  isSimulated?: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  isDirect?: boolean;
  directUser?: TeamMember;
  unreadCount?: number;
}

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  duration?: number;
}

export interface FilterState {
  searchQuery: string;
  stageFilter: DealStage | 'all';
  priorityFilter: DealPriority | 'all';
  ownerFilter: string | 'all';
  industryFilter: string | 'all';
  sortBy: 'name' | 'value' | 'closeDate' | 'probability' | 'priority';
  sortDirection: 'asc' | 'desc';
}

export type DeviceMode = 'auto' | 'mobile' | 'desktop';
