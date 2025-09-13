import { eventBus } from './EventBus';

describe('EventBus', () => {
  beforeEach(() => {
    // Clear any lingering listeners
    (eventBus as any).listeners = new Map();
  });

  test('subscribe and publish should call listener with payload', () => {
    const mockListener = jest.fn();
    eventBus.subscribe('notification', mockListener);

    const payload = { message: 'Hello', type: 'info' } as const;
    eventBus.publish('notification', payload);

    expect(mockListener).toHaveBeenCalledTimes(1);
    expect(mockListener).toHaveBeenCalledWith(payload);
  });

  test('unsubscribe should remove listener', () => {
    const mockListener = jest.fn();
    const unsubscribe = eventBus.subscribe('userLoggedOut', mockListener);

    // Unsubscribe
    unsubscribe();
    eventBus.publish('userLoggedOut', undefined);

    expect(mockListener).not.toHaveBeenCalled();
  });

  test('multiple listeners should all be called', () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    eventBus.subscribe('seatConflict', listener1);
    eventBus.subscribe('seatConflict', listener2);

    const payload = { seatId: 99 };
    eventBus.publish('seatConflict', payload);

    expect(listener1).toHaveBeenCalledWith(payload);
    expect(listener2).toHaveBeenCalledWith(payload);
  });

  test('publishing different events works with correct payloads', () => {
    const loginListener = jest.fn();
    const seatListener = jest.fn();

    eventBus.subscribe('userLoggedIn', loginListener);
    eventBus.subscribe('seatReserved', seatListener);

    const loginPayload = { userId: 'u1', role: 'admin', permissions: ['manage_users'] };
    const seatPayload = { seatId: 10, userId: 'u1', expiresAt: Date.now() + 5000 };

    eventBus.publish('userLoggedIn', loginPayload);
    eventBus.publish('seatReserved', seatPayload);

    expect(loginListener).toHaveBeenCalledWith(loginPayload);
    expect(seatListener).toHaveBeenCalledWith(seatPayload);
  });

  test('should reuse singleton from window', () => {
    const busFromWindow = (window as any).__EVENT_BUS__;
    expect(busFromWindow).toBe(eventBus);
  });
});
