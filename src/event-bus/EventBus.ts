type Listener = (...args: any[]) => void;

// Define event types for better TypeScript support
type EventMap = {
  userLoggedIn: { userId: string; role: string; permissions: string[] };
  userLoggedOut: undefined;
  notification: { message: string; type: 'success' | 'error' | 'warning' | 'info' };
  seatSelecting: { seatId: number; userId: string; timestamp: number , expiresAt: number};
  seatReserved: { seatId: number; userId: string; expiresAt: number };
  seatReleased: { seatId: number; userId: string };
  seatConflict: { seatId: number };
  ticketBooked: { userId: string; seats: number[]; timestamp: number};
  bookingFailed: { errorMessage: string };
};

class EventBus {
  private listeners: Map<string, Listener[]> = new Map();

  public subscribe<K extends keyof EventMap>(
    event: K, 
    listener: (payload: EventMap[K]) => void
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener as Listener);
    
    // Return an unsubscribe function
    return () => {
      const currentListeners = this.listeners.get(event);
      if (currentListeners) {
        this.listeners.set(
          event,
          currentListeners.filter((l) => l !== listener)
        );
      }
    };
  }

  public publish<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach((listener) => {
        listener(payload);
      });
    }
  }
}

// Attach singleton to window to ensure all microfrontends share it
const globalBus = (window as any).__EVENT_BUS__ || new EventBus();
(window as any).__EVENT_BUS__ = globalBus;

export const eventBus = globalBus;