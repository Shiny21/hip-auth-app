import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';
import { eventBus } from '../event-bus/EventBus';

// Mock eventBus
jest.mock('../event-bus/EventBus', () => ({
  eventBus: {
    publish: jest.fn(),
    subscribe: jest.fn(() => jest.fn()), // returns an unsubscribe fn
  },
}));

// Clear mocks and storages before each test
beforeEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
  localStorage.clear();
});

describe('Login Component', () => {
  test('renders correctly', () => {
    render(<Login />);
    expect(screen.getByText(/Auth App/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter user id/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  test('shows warning if login clicked without userId', () => {
    render(<Login />);
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    expect(eventBus.publish).toHaveBeenCalledWith('notification', {
      message: 'Please enter a User ID',
      type: 'warning',
    });
  });

  test('logs in with userId and role', () => {
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/Enter user id/i), {
      target: { value: 'user1' },
    });
    fireEvent.change(screen.getByDisplayValue('Customer'), {
      target: { value: 'admin' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    const savedUser = JSON.parse(sessionStorage.getItem('user')!);
    expect(savedUser).toMatchObject({
      userId: 'user1',
      role: 'admin',
      permissions: expect.arrayContaining(['manage_users']),
    });

    expect(eventBus.publish).toHaveBeenCalledWith(
      'userLoggedIn',
      expect.objectContaining({ userId: 'user1', role: 'admin' }),
    );

    expect(eventBus.publish).toHaveBeenCalledWith('notification', {
      message: 'Welcome user1!',
      type: 'success',
    });

    const activeUsers = JSON.parse(localStorage.getItem('activeUsers')!);
    expect(activeUsers).toEqual(
      expect.arrayContaining([expect.objectContaining({ userId: 'user1' })]),
    );
  });

  test('logout removes user from storages and publishes events', () => {
    // Pre-populate storage and render
    sessionStorage.setItem(
      'user',
      JSON.stringify({ userId: 'user1', role: 'customer', permissions: [] }),
    );
    localStorage.setItem(
      'activeUsers',
      JSON.stringify([{ userId: 'user1', role: 'customer', permissions: [] }]),
    );

    render(<Login />);
    fireEvent.click(screen.getByRole('button', { name: /Logout/i }));

    expect(eventBus.publish).toHaveBeenCalledWith('userLoggedOut', undefined);
    expect(eventBus.publish).toHaveBeenCalledWith('notification', {
      message: 'Logged out successfully',
      type: 'info',
    });

    expect(sessionStorage.getItem('user')).toBeNull();
    const activeUsers = JSON.parse(localStorage.getItem('activeUsers')!);
    expect(activeUsers).toEqual([]);
  });

});
