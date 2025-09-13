import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import ToastContainer from './Toast';
import { eventBus } from '../event-bus/EventBus';

jest.useFakeTimers();

jest.mock('../event-bus/EventBus', () => ({
  eventBus: {
    publish: jest.fn(),
    subscribe: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Toast Component', () => {
  test('renders toast on notification event', () => {
    const callbackStore: Record<string, Function> = {};
    (eventBus.subscribe as jest.Mock).mockImplementation((event, cb) => {
      callbackStore[event] = cb;
      return jest.fn();
    });

    render(<ToastContainer />);
    act(() => {
      callbackStore['notification']({ message: 'Hello', type: 'success' });
    });

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  test('removes toast on click', () => {
    const callbackStore: Record<string, Function> = {};
    (eventBus.subscribe as jest.Mock).mockImplementation((event, cb) => {
      callbackStore[event] = cb;
      return jest.fn();
    });

    render(<ToastContainer />);
    act(() => {
      callbackStore['notification']({ message: 'Click me', type: 'info' });
    });

    const toast = screen.getByText('Click me');
    fireEvent.click(toast);
    expect(toast).not.toBeInTheDocument();
  });

  test('auto removes toast after 5 seconds', () => {
    const callbackStore: Record<string, Function> = {};
    (eventBus.subscribe as jest.Mock).mockImplementation((event, cb) => {
      callbackStore[event] = cb;
      return jest.fn();
    });

    render(<ToastContainer />);
    act(() => {
      callbackStore['notification']({ message: 'Auto remove', type: 'warning' });
    });

    expect(screen.getByText('Auto remove')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.queryByText('Auto remove')).toBeNull();
  });
});
