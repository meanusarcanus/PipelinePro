import { NotificationItem } from '../types/crm';

type SocketListener = (event: { type: string; payload: any }) => void;

class MockSocketService {
  private listeners: Set<SocketListener> = new Set();
  private intervalId: any = null;

  subscribe(listener: SocketListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(type: string, payload: any) {
    this.listeners.forEach(cb => cb({ type, payload }));
  }

  startSimulatedLiveTraffic() {
    if (this.intervalId) return;

    // Simulate occasional incoming updates
    const mockEvents = [
      {
        title: 'Prospect Viewed Proposal',
        description: 'Derek Zhang opened "CloudScale Infrastructure Hub" proposal deck.',
        type: 'info' as const
      },
      {
        title: 'New Inbound Lead Detected',
        description: 'Vanguard Health requested a product demo for 500+ seats.',
        type: 'success' as const
      },
      {
        title: 'SLA Warning',
        description: 'Quantum Retail discount approval SLA is under 6 hours.',
        type: 'warning' as const
      }
    ];

    let idx = 0;
    this.intervalId = setInterval(() => {
      if (this.listeners.size > 0 && Math.random() > 0.4) {
        const evt = mockEvents[idx % mockEvents.length];
        idx++;
        const newNotification: NotificationItem = {
          id: 'notif-' + Date.now(),
          title: evt.title,
          description: evt.description,
          type: evt.type,
          timestamp: 'Just now',
          read: false
        };
        this.emit('NOTIFICATION_RECEIVED', newNotification);
      }
    }, 45000); // every 45s a simulated event
  }

  stopSimulatedLiveTraffic() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const mockSocket = new MockSocketService();
