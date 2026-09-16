import React, { useEffect } from 'react';
import { useCrmStore } from './store/useCrmStore';
import { useDeviceMode } from './hooks/useDeviceMode';
import { mockSocket } from './services/mockSocket';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ViewSelector } from './components/layout/ViewSelector';
import { SearchFilterBar } from './components/common/SearchFilterBar';
import { BoardTable } from './components/table/BoardTable';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { OpsDesk } from './components/ops/OpsDesk';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { ItemDetailDrawer } from './components/drawer/ItemDetailDrawer';
import { NewDealModal } from './components/modals/NewDealModal';
import { NewRequestModal } from './components/ops/NewRequestModal';
import { NotificationDrawer } from './components/modals/NotificationDrawer';
import { LoginModal } from './components/auth/LoginModal';
import { TeamMessenger } from './components/messaging/TeamMessenger';
import { ToastContainer } from './components/common/ToastContainer';
import { MobileNavBar } from './components/layout/MobileNavBar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { MobileDealList } from './components/mobile/MobileDealList';
import { PwaInstallBanner } from './components/common/PwaInstallBanner';

export const App: React.FC = () => {
  const { currentView, addNotification } = useCrmStore();
  const { isMobile } = useDeviceMode();

  useEffect(() => {
    // Start simulated live events
    mockSocket.startSimulatedLiveTraffic();

    const unsubscribe = mockSocket.subscribe((event) => {
      if (event.type === 'NOTIFICATION_RECEIVED') {
        addNotification(event.payload);
      }
    });

    return () => {
      unsubscribe();
      mockSocket.stopSimulatedLiveTraffic();
    };
  }, [addNotification]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f6f7fb] text-slate-800 relative select-none">
      {/* Real-time Toast Notifications */}
      <ToastContainer />

      {isMobile ? (
        /* ================= MOBILE / SMARTPHONE PWA LAYOUT ================= */
        <div className="flex flex-col h-full w-full overflow-hidden">
          {/* PWA Install Promotion Banner */}
          <PwaInstallBanner />

          {/* Compact Mobile Top App Bar */}
          <MobileNavBar />

          {/* Mobile Main Content View Area */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
            {currentView === 'table' && <MobileDealList />}
            {currentView === 'kanban' && (
              <div className="pb-20">
                <KanbanBoard />
              </div>
            )}
            {currentView === 'ops' && (
              <div className="pb-20">
                <OpsDesk />
              </div>
            )}
            {currentView === 'analytics' && (
              <div className="pb-20">
                <AnalyticsDashboard />
              </div>
            )}
          </main>

          {/* Smartphone Bottom Native Bar */}
          <MobileBottomNav />
        </div>
      ) : (
        /* ================= DESKTOP / WORKSPACE LAYOUT ================= */
        <>
          {/* Collapsible Left Navigation Bar */}
          <Sidebar />

          {/* Main App Container */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Top Navbar */}
            <Navbar />

            {/* Monday.com View Switcher Tabs */}
            <ViewSelector />

            {/* Search, Filter and Actions Bar */}
            {currentView !== 'analytics' && <SearchFilterBar />}

            {/* Active View Body */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
              {currentView === 'table' && <BoardTable />}
              {currentView === 'kanban' && <KanbanBoard />}
              {currentView === 'ops' && <OpsDesk />}
              {currentView === 'analytics' && <AnalyticsDashboard />}
            </main>
          </div>
        </>
      )}

      {/* Slide-over Item Details Drawer */}
      <ItemDetailDrawer />

      {/* Team Messaging Collaboration Dock */}
      <TeamMessenger />

      {/* Modals */}
      <LoginModal />
      <NewDealModal />
      <NewRequestModal />
      <NotificationDrawer />
    </div>
  );
};

export default App;
