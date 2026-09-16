import { TeamMember, TableGroup, DealItem, OpsRequest, NotificationItem, WorkspaceItem, ChatMessage, ChatChannel } from '../types/crm';

export const initialWorkspaces: WorkspaceItem[] = [
  {
    id: 'enterprise',
    name: 'Global Enterprise Deals',
    description: 'Direct enterprise sales & strategic multi-region opportunities',
    color: '#579bfc'
  },
  {
    id: 'renewals',
    name: 'Customer Success Renewals',
    description: 'Contract renewals, expansion licenses & customer retention',
    color: '#00c875'
  },
  {
    id: 'partners',
    name: 'Partner & Channel Sales',
    description: 'Reseller alliances, co-sell initiatives & distributor pipelines',
    color: '#a25ddc'
  }
];

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Alex Morgan',
    email: 'alex.morgan@pipelinepro.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'VP of Sales',
    initials: 'AM',
    color: '#00c875'
  },
  {
    id: 'user-2',
    name: 'Sophia Chen',
    email: 'sophia.chen@pipelinepro.io',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'Senior Enterprise AE',
    initials: 'SC',
    color: '#579bfc'
  },
  {
    id: 'user-3',
    name: 'Marcus Vance',
    email: 'marcus.vance@pipelinepro.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Enterprise AE',
    initials: 'MV',
    color: '#a25ddc'
  },
  {
    id: 'user-4',
    name: 'Elena Rostova',
    email: 'elena.rostova@pipelinepro.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'Commercial Sales Lead',
    initials: 'ER',
    color: '#fdab3d'
  },
  {
    id: 'user-5',
    name: 'Liam O\'Connor',
    email: 'liam.oconnor@pipelinepro.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Lead Solutions Architect',
    initials: 'LO',
    color: '#e2445c'
  }
];

export const initialGroups: TableGroup[] = [
  {
    id: 'closing_soon',
    title: 'Closing This Month (High Velocity)',
    color: '#fdab3d'
  },
  {
    id: 'active',
    title: 'Active Pipeline & Qualified Deals',
    color: '#579bfc'
  },
  {
    id: 'won_accounts',
    title: 'Closed Won & Enterprise Expansion',
    color: '#00c875'
  }
];

export const initialDeals: DealItem[] = [
  {
    id: 'deal-1',
    name: 'Quantum Retail - Global Omnichannel rollout',
    company: 'Quantum Retail Group',
    contactName: 'Victoria Hayes',
    contactEmail: 'v.hayes@quantumretail.com',
    stage: 'negotiation',
    value: 220000,
    closeDate: '2026-09-30',
    priority: 'critical',
    owner: initialTeamMembers[1], // Sophia
    probability: 85,
    groupId: 'closing_soon',
    industry: 'Retail & E-commerce',
    notes: 'Finalizing 3-year enterprise license with multi-currency checkout module.',
    updates: [
      {
        id: 'up-1',
        author: initialTeamMembers[1],
        content: 'Procurement reviewed master terms. They asked for a 15% discount on tier-1 support if signed before month end.',
        timestamp: '2 hours ago',
        likes: 3,
        hasLiked: true
      },
      {
        id: 'up-2',
        author: initialTeamMembers[0],
        content: 'Approved the tier-1 support discount. Let’s get legal to send execution copy by Wednesday!',
        timestamp: '1 hour ago',
        likes: 2
      }
    ],
    activityLog: [
      {
        id: 'act-1',
        author: 'Sophia Chen',
        action: 'Stage changed',
        field: 'stage',
        previousValue: 'Proposal Sent',
        newValue: 'Negotiation',
        timestamp: 'Yesterday at 4:15 PM'
      },
      {
        id: 'act-2',
        author: 'Sophia Chen',
        action: 'Deal value updated',
        field: 'value',
        previousValue: '₱180,000',
        newValue: '₱220,000',
        timestamp: '2 days ago'
      }
    ],
    createdAt: '2026-08-10',
    lastContactDate: '2026-09-14'
  },
  {
    id: 'deal-2',
    name: 'CloudScale Inc - Multi-Region Infrastructure Hub',
    company: 'CloudScale Technologies',
    contactName: 'Derek Zhang',
    contactEmail: 'dzhang@cloudscale.io',
    stage: 'proposal',
    value: 180000,
    closeDate: '2026-10-15',
    priority: 'high',
    owner: initialTeamMembers[2], // Marcus
    probability: 70,
    groupId: 'active',
    industry: 'Cloud Infrastructure',
    notes: 'Technical POC successfully concluded with Liam. Architecture sign-off achieved.',
    updates: [
      {
        id: 'up-3',
        author: initialTeamMembers[4], // Liam
        content: 'Architectural review passed with 10/10 latency metrics. Benchmarked 12,000 TPS on test cluster.',
        timestamp: '1 day ago',
        likes: 5
      }
    ],
    activityLog: [
      {
        id: 'act-3',
        author: 'Marcus Vance',
        action: 'Proposal document uploaded',
        timestamp: '3 days ago'
      }
    ],
    createdAt: '2026-08-18',
    lastContactDate: '2026-09-13'
  },
  {
    id: 'deal-3',
    name: 'HealthPulse Analytics - HIPAA Compliance Cloud',
    company: 'HealthPulse Labs',
    contactName: 'Dr. Aris Thorne',
    contactEmail: 'athorne@healthpulselabs.org',
    stage: 'negotiation',
    value: 140000,
    closeDate: '2026-09-28',
    priority: 'critical',
    owner: initialTeamMembers[1], // Sophia
    probability: 90,
    groupId: 'closing_soon',
    industry: 'Healthcare & Life Sciences',
    notes: 'Need standard BAA and SOC 2 Type II audit report delivered for security audit review.',
    updates: [
      {
        id: 'up-4',
        author: initialTeamMembers[1],
        content: 'Security team requested an addendum on zero-knowledge encryption keys.',
        timestamp: '4 hours ago',
        likes: 1
      }
    ],
    activityLog: [
      {
        id: 'act-4',
        author: 'Alex Morgan',
        action: 'Priority increased to Critical',
        timestamp: 'Yesterday'
      }
    ],
    createdAt: '2026-07-25',
    lastContactDate: '2026-09-15'
  },
  {
    id: 'deal-4',
    name: 'FinTech Orbit - Core Banking API Integration',
    company: 'FinTech Orbit Group',
    contactName: 'Clara Beaumont',
    contactEmail: 'clara@orbitfin.co.uk',
    stage: 'contacted',
    value: 95000,
    closeDate: '2026-11-05',
    priority: 'medium',
    owner: initialTeamMembers[3], // Elena
    probability: 50,
    groupId: 'active',
    industry: 'Financial Services',
    notes: 'Demo scheduled for Friday with Head of Open Banking.',
    updates: [
      {
        id: 'up-5',
        author: initialTeamMembers[3],
        content: 'Completed intro call with Clara. Shared case study on ISO 20022 messaging.',
        timestamp: '3 days ago',
        likes: 2
      }
    ],
    activityLog: [
      {
        id: 'act-5',
        author: 'Elena Rostova',
        action: 'Created lead record',
        timestamp: '2026-09-02'
      }
    ],
    createdAt: '2026-09-02',
    lastContactDate: '2026-09-12'
  },
  {
    id: 'deal-5',
    name: 'CyberShield Security - Threat Intelligence Feed',
    company: 'CyberShield Networks',
    contactName: 'Garrison Shaw',
    contactEmail: 'g.shaw@cybershield.net',
    stage: 'won',
    value: 110000,
    closeDate: '2026-09-08',
    priority: 'high',
    owner: initialTeamMembers[2], // Marcus
    probability: 100,
    groupId: 'won_accounts',
    industry: 'Cybersecurity',
    workspaceId: 'renewals',
    notes: 'Closed annual recurring contract. Onboarding kickoff scheduled with customer success.',
    updates: [
      {
        id: 'up-6',
        author: initialTeamMembers[2],
        content: 'Contract officially executed by CFO! First wire confirmed.',
        timestamp: '5 days ago',
        likes: 7,
        hasLiked: true
      }
    ],
    activityLog: [
      {
        id: 'act-6',
        author: 'Marcus Vance',
        action: 'Stage updated to Closed Won',
        previousValue: 'Negotiation',
        newValue: 'Closed Won',
        timestamp: '2026-09-08'
      }
    ],
    createdAt: '2026-07-14',
    lastContactDate: '2026-09-08'
  },
  {
    id: 'deal-6',
    name: 'Apex Logistics - Fleet Telematics Pipeline',
    company: 'Apex Logistics Global',
    contactName: 'Mateo Morales',
    contactEmail: 'mateo@apexlogistics.com',
    stage: 'proposal',
    value: 85000,
    closeDate: '2026-10-20',
    priority: 'medium',
    owner: initialTeamMembers[3], // Elena
    probability: 60,
    groupId: 'active',
    industry: 'Logistics & Supply Chain',
    notes: 'Evaluating our geo-fencing and real-time route optimization modules.',
    updates: [],
    activityLog: [
      {
        id: 'act-7',
        author: 'Elena Rostova',
        action: 'Sent pricing quotation',
        timestamp: '4 days ago'
      }
    ],
    createdAt: '2026-08-30',
    lastContactDate: '2026-09-11'
  },
  {
    id: 'deal-7',
    name: 'GreenWave Energy - Smart Grid Metering',
    company: 'GreenWave Utilities',
    contactName: 'Ananya Patel',
    contactEmail: 'apatel@greenwave.energy',
    stage: 'lead',
    value: 135000,
    closeDate: '2026-11-30',
    priority: 'high',
    owner: initialTeamMembers[2], // Marcus
    probability: 30,
    groupId: 'active',
    industry: 'Renewables & Energy',
    notes: 'Inbound inquiry from CleanTech Summit. High interest in carbon accounting API.',
    updates: [],
    activityLog: [
      {
        id: 'act-8',
        author: 'Marcus Vance',
        action: 'Lead captured from inbound form',
        timestamp: '5 days ago'
      }
    ],
    createdAt: '2026-09-10',
    lastContactDate: '2026-09-10'
  },
  {
    id: 'deal-8',
    name: 'Nexus Dynamics - Autonomous Robotics Fleet',
    company: 'Nexus Dynamics AI',
    contactName: 'Julian Brand',
    contactEmail: 'j.brand@nexusai.io',
    stage: 'won',
    value: 65000,
    closeDate: '2026-09-01',
    priority: 'medium',
    owner: initialTeamMembers[1], // Sophia
    probability: 100,
    groupId: 'won_accounts',
    industry: 'Robotics & AI',
    workspaceId: 'renewals',
    notes: 'Expansion deal closed with existing enterprise customer.',
    updates: [],
    activityLog: [
      {
        id: 'act-9',
        author: 'Sophia Chen',
        action: 'Renewal signed for 2 years',
        timestamp: '2026-09-01'
      }
    ],
    createdAt: '2026-06-20',
    lastContactDate: '2026-09-01'
  },
  {
    id: 'deal-renew-1',
    name: 'Starlight Media - Q4 Enterprise Retention Package',
    company: 'Starlight Media Network',
    contactName: 'Chloe DuPont',
    contactEmail: 'chloe@starlightmedia.com',
    stage: 'proposal',
    value: 85000,
    closeDate: '2026-10-30',
    priority: 'high',
    owner: initialTeamMembers[1],
    probability: 75,
    groupId: 'closing_soon',
    industry: 'Media & Entertainment',
    workspaceId: 'renewals',
    notes: 'Renewing 500 seat license with upgraded real-time analytics module.',
    updates: [],
    activityLog: [
      {
        id: 'act-10',
        author: 'Sophia Chen',
        action: 'Sent renewal quotation',
        timestamp: '1 day ago'
      }
    ],
    createdAt: '2026-09-01',
    lastContactDate: '2026-09-14'
  },
  {
    id: 'deal-renew-2',
    name: 'Alpha Corp - Core Platform Annual Uplift & SLA',
    company: 'Alpha Corporation',
    contactName: 'Samuel Stone',
    contactEmail: 's.stone@alphacorp.io',
    stage: 'negotiation',
    value: 120000,
    closeDate: '2026-09-29',
    priority: 'critical',
    owner: initialTeamMembers[2],
    probability: 85,
    groupId: 'active',
    industry: 'Financial Services',
    workspaceId: 'renewals',
    notes: 'Negotiating custom Tier-1 mission critical SLA addendum.',
    updates: [],
    activityLog: [],
    createdAt: '2026-08-15',
    lastContactDate: '2026-09-15'
  },
  {
    id: 'deal-part-1',
    name: 'Accenture SEA - APAC Co-Sell Cloud Infrastructure',
    company: 'Accenture Southeast Asia',
    contactName: 'Kenji Sato',
    contactEmail: 'kenji.sato@accenture.com',
    stage: 'negotiation',
    value: 350000,
    closeDate: '2026-11-15',
    priority: 'critical',
    owner: initialTeamMembers[0],
    probability: 80,
    groupId: 'closing_soon',
    industry: 'Consulting & SI',
    workspaceId: 'partners',
    notes: 'Joint enterprise pipeline for regional banking modernization.',
    updates: [],
    activityLog: [],
    createdAt: '2026-08-01',
    lastContactDate: '2026-09-12'
  },
  {
    id: 'deal-part-2',
    name: 'Deloitte Tech - Global System Integrator Reseller Agreement',
    company: 'Deloitte Consulting',
    contactName: 'Rachel Vance',
    contactEmail: 'rvance@deloitte.com',
    stage: 'proposal',
    value: 280000,
    closeDate: '2026-10-25',
    priority: 'high',
    owner: initialTeamMembers[3],
    probability: 65,
    groupId: 'active',
    industry: 'Enterprise SI',
    workspaceId: 'partners',
    notes: 'Global Master Reseller contract with certified partner margins.',
    updates: [],
    activityLog: [],
    createdAt: '2026-08-20',
    lastContactDate: '2026-09-10'
  },
  {
    id: 'deal-part-3',
    name: 'SoftServe Alliance - Managed Services Tier-1 Referral',
    company: 'SoftServe Systems',
    contactName: 'Taras Boyko',
    contactEmail: 'tboyko@softserveinc.com',
    stage: 'contacted',
    value: 120000,
    closeDate: '2026-12-01',
    priority: 'medium',
    owner: initialTeamMembers[4],
    probability: 45,
    groupId: 'active',
    industry: 'Cloud Integration',
    workspaceId: 'partners',
    notes: 'Co-marketing and referral tier kick-off scheduled.',
    updates: [],
    activityLog: [],
    createdAt: '2026-09-05',
    lastContactDate: '2026-09-15'
  }
];

export const initialOpsRequests: OpsRequest[] = [
  {
    id: 'ops-1',
    title: '25% Multi-Year Discount & Payment Terms Review',
    dealId: 'deal-1',
    dealName: 'Quantum Retail - Global Omnichannel rollout',
    company: 'Quantum Retail Group',
    type: 'discount_approval',
    requestedBy: initialTeamMembers[1], // Sophia
    approver: initialTeamMembers[0], // Alex
    status: 'pending',
    urgency: 'critical',
    discountPercent: 25,
    amount: 55000,
    notes: 'Customer requires 25% discount on year 1 in exchange for committing to a guaranteed 3-year term with upfront annual payment.',
    slaHoursLeft: 6,
    createdAt: '2026-09-15 09:30',
    updatedAt: '2026-09-15 09:30'
  },
  {
    id: 'ops-2',
    title: 'Custom Mutual Indemnity & SLA Clause Addendum',
    dealId: 'deal-2',
    dealName: 'CloudScale Inc - Multi-Region Infrastructure Hub',
    company: 'CloudScale Technologies',
    type: 'legal_msa',
    requestedBy: initialTeamMembers[2], // Marcus
    approver: initialTeamMembers[0],
    status: 'in_review',
    urgency: 'high',
    notes: 'Customer legal counsel submitted redlines on section 8 (Limitation of Liability). Legal counsel review required.',
    slaHoursLeft: 18,
    createdAt: '2026-09-14 14:00',
    updatedAt: '2026-09-15 11:20'
  },
  {
    id: 'ops-3',
    title: 'SOC 2 Type II Vendor Risk Assessment Package',
    dealId: 'deal-3',
    dealName: 'HealthPulse Analytics - HIPAA Compliance Cloud',
    company: 'HealthPulse Labs',
    type: 'security_soc2',
    requestedBy: initialTeamMembers[1],
    approver: initialTeamMembers[4], // Liam
    status: 'approved',
    urgency: 'critical',
    notes: 'Provided HIPAA business associate agreement and 2026 SOC 2 Type II audit certificate.',
    slaHoursLeft: 0,
    createdAt: '2026-09-13 16:45',
    updatedAt: '2026-09-14 10:15',
    approvalNote: 'Approved. Package dispatched with NDA countersigned.'
  },
  {
    id: 'ops-4',
    title: 'Dedicated Isolated Sandbox Provisioning (HIPAA)',
    dealId: 'deal-4',
    dealName: 'FinTech Orbit - Core Banking API Integration',
    company: 'FinTech Orbit Group',
    type: 'sandbox_provisioning',
    requestedBy: initialTeamMembers[3], // Elena
    approver: initialTeamMembers[4], // Liam
    status: 'pending',
    urgency: 'medium',
    notes: 'Spin up an isolated staging tenant with mock banking transaction seeds for the client trial.',
    slaHoursLeft: 24,
    createdAt: '2026-09-15 11:00',
    updatedAt: '2026-09-15 11:00'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Urgent Discount Approval Required',
    description: 'Sophia requested 25% discount approval for Quantum Retail (₱220,000 ARR).',
    type: 'alert',
    timestamp: '10m ago',
    read: false,
    dealId: 'deal-1',
    viewTarget: 'ops'
  },
  {
    id: 'notif-2',
    title: 'Deal Stage Advanced',
    description: 'HealthPulse Analytics moved to Negotiation stage with 90% confidence.',
    type: 'info',
    timestamp: '1h ago',
    read: false,
    dealId: 'deal-3',
    viewTarget: 'table'
  },
  {
    id: 'notif-3',
    title: 'Closed Won Celebration! 🎉',
    description: 'CyberShield Security (₱110,000) was marked as Won by Marcus Vance.',
    type: 'success',
    timestamp: '5h ago',
    read: true,
    dealId: 'deal-5',
    viewTarget: 'kanban'
  }
];

export const initialChatChannels: ChatChannel[] = [
  {
    id: 'channel-war-room',
    name: 'deal-war-room',
    description: 'Enterprise pipeline deal execution & pricing negotiation strategy'
  },
  {
    id: 'channel-approvals',
    name: 'approvals-ops',
    description: 'Discount requests, SLA escalations & legal redlines'
  },
  {
    id: 'channel-general',
    name: 'general-pipeline',
    description: 'General sales announcements, wins and pipeline updates'
  }
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    channelId: 'channel-war-room',
    sender: initialTeamMembers[1], // Sophia
    text: 'Procurement for Quantum Retail is pushing for 25% discount if signed by Friday. Alex, can you review the ops ticket?',
    timestamp: '10:15 AM'
  },
  {
    id: 'msg-2',
    channelId: 'channel-war-room',
    sender: initialTeamMembers[0], // Alex
    text: 'Checking it right now on the Ops Desk. If they commit to 3-year upfront annual billing, let’s approve it.',
    timestamp: '10:18 AM'
  },
  {
    id: 'msg-3',
    channelId: 'channel-war-room',
    sender: initialTeamMembers[4], // Liam
    text: 'Sandbox instance for FinTech Orbit is configured and passing health checks. Latency benchmark is 12ms.',
    timestamp: '10:30 AM'
  },
  {
    id: 'msg-4',
    channelId: 'channel-approvals',
    sender: initialTeamMembers[2], // Marcus
    text: 'CloudScale legal counsel redlined the limitation of liability section. Escalated to ops for review.',
    timestamp: 'Yesterday'
  }
];
