import React from 'react';
import { render, screen, act } from '@testing-library/react';
import UserProfile from './UserProfile';
import { eventBus } from '../event-bus/EventBus';

// Mock the entire EventBus module
jest.mock('../event-bus/EventBus', () => {
  const listeners = new Map();
  return {
    eventBus: {
      subscribe: jest.fn((event, callback: Function) => {
        if (!listeners.has(event)) {
          listeners.set(event, []);
        }
        listeners.get(event).push(callback);
        // Return a function for unsubscribe
        return () => {
          const callbacks = listeners.get(event);
          if (callbacks) {
            // Add the Function type annotation to the 'cb' parameter
            listeners.set(event, callbacks.filter((cb: Function) => cb !== callback));
          }
        };
      }),
      publish: jest.fn((event, ...args) => {
        if (listeners.has(event)) {
          // Add the Function type annotation to the 'callback' parameter
          listeners.get(event).forEach((callback: Function) => callback(...args));
        }
      }),
    },
  };
});

describe('UserProfile Component', () => {
  test('renders the initial logged out state', () => {
    render(<UserProfile />);
    expect(screen.getByText(/you are currently logged out/i)).toBeInTheDocument();
  });

  it("should show logged out message initially", () => {
    render(<UserProfile />);
    expect(screen.getByText(/You are currently logged out/i)).toBeInTheDocument();
  });

  it("should display user details after userLoggedIn event", () => {
    render(<UserProfile />);
    const user = { userId: "u123", role: "admin" };

    act(() => {
      eventBus.publish("userLoggedIn", user);
    });
    expect(screen.getByText(/Welcome back,/i)).toBeInTheDocument();
    expect(screen.getByText(/u123/i)).toBeInTheDocument();
    expect(screen.getByText(/Your role is:/i)).toBeInTheDocument();
    expect(screen.getByText(/admin/i)).toBeInTheDocument();

  });

  it("should return to logged out state after userLoggedOut event", () => {
    render(<UserProfile />);
    const user = { userId: "u456", role: "customer" };

    act(() => {
      eventBus.publish("userLoggedIn", user);
    });
    expect(screen.getByText(/u456/i)).toBeInTheDocument();

    act(() => {
      eventBus.publish("userLoggedOut");
    });

    expect(screen.getByText(/You are currently logged out/i)).toBeInTheDocument();
  });
});