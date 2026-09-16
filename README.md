# PipelinePro CRM & Operational Workspace

**PipelinePro** is a modern, responsive, highly visual CRM and operational workspace built with React, TypeScript, and Tailwind CSS. The design system faithfully reproduces the clean, modular, drag-and-drop workspace aesthetic of **Monday.com**, featuring rich sales pipeline management, deal forecasting, operational approval workflows, and deep reporting analytics.

---

## 🌟 Key Features

### 1. Monday.com Aesthetic & Modular Workspace
- **Signature Pill Badges**: Vibrant status pills for pipeline stages (Lead In, Contacted, Proposal Sent, Negotiation, Closed Won `#00c875`, Closed Lost `#e2445c`) and urgency/priority indicators.
- **Collapsible Groups**: Color-coded group headers with group collapse toggles, quick inline item creation, and summary footers (Weighted Pipeline ARR, Total Group ARR, and average win probability).
- **Inline Editing**: Click-to-edit cells for deal name, value, stage dropdown, priority dropdown, owner avatar, and target close date.
- **Bulk Actions**: Checkbox selection for multi-item operations (batch move stage, delete, or export).

### 2. Multi-View Architecture
- **Main Table (Grid View)**: Full enterprise table with customizable columns, aggregates, and inline adding.
- **Pipeline Kanban Board**: Drag-and-drop cards across pipeline stages with live drop-zone highlights, confetti celebrations on Closed Won, and quick metrics.
- **Operational Requests & Approvals Desk**: Dedicated ticketing board for sales ops (Discount Approvals, Legal MSA redlines, SOC 2 compliance, Dev Sandbox provisioning) with SLA countdown timers and 1-click Approve / Reject actions with audit notes.
- **Executive Analytics & Reporting**:
  - Interactive conversion funnel.
  - Monthly projected vs. closed won ARR bar chart with Recharts.
  - Account Executive leaderboard with quota attainment and win velocity.
  - Deal distribution by industry sector.

### 3. Collaboration & Audit Log
- **Item Detail Slide-Over Drawer**: Click any deal to open the side panel:
  - **Updates Feed**: Team notes, threaded comments with likes, and simulated teammate mentions.
  - **Audit Trail**: Real-time activity log detailing who changed which property, previous values, and timestamps.
  - **Deal Details**: Primary contact details, email links, and company metadata.

### 4. Architecture & Mock Service Layer
- **Zustand Global Store**: Atomic, reactive state management across all boards, views, and drawers.
- **LocalStorage Sync**: Data persists across reloads with an instant "Reset Demo Data" option in the navbar.
- **Extensible Service Structure**: `crmService.ts` and `mockSocket.ts` mimicking REST/WebSocket endpoints.
- **Exporting**: 1-click Export to CSV for Excel/BI tools.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```text
src/
├── types/
│   └── crm.ts                  # Deal, Group, OpsRequest, Notification, Team types
├── data/
│   └── initialData.ts          # Rich realistic B2B SaaS preloaded data
├── services/
│   ├── crmService.ts           # REST mock layer with LocalStorage persistence & CSV export
│   └── mockSocket.ts           # Simulated live event stream
├── store/
│   └── useCrmStore.ts          # Zustand state store with actions
├── components/
│   ├── layout/                 # Navbar, Sidebar, ViewSelector
│   ├── common/                 # Badge, Avatar, SearchFilterBar
│   ├── table/                  # BoardTable, TableGroup, TableRow
│   ├── kanban/                 # KanbanBoard, KanbanColumn, KanbanCard
│   ├── ops/                    # OpsDesk, ApprovalCard, NewRequestModal
│   ├── analytics/              # AnalyticsDashboard, MetricCard, RevenueChart, Funnel, RepLeaderboard
│   ├── drawer/                 # ItemDetailDrawer, UpdatesFeed, ActivityLog
│   └── modals/                 # NewDealModal, NotificationDrawer
├── App.tsx
├── main.tsx
└── index.css
```
