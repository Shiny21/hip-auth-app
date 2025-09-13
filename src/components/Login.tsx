import React, { useState, useEffect } from 'react';
import { eventBus } from '../event-bus/EventBus';

interface User {
  userId: string;
  role: string;
  permissions: string[];
}

const ACTIVE_USERS_KEY = 'activeUsers';

const ROLE_PERMISSIONS = {
  customer: ['book_tickets', 'view_own_bookings'],
  admin: ['book_tickets', 'view_all_bookings', 'view_reports', 'manage_users', 'view_seat_map'],
  manager: ['book_tickets', 'view_department_reports', 'view_seat_map']
};

const Login = () => {
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState<'customer' | 'admin' | 'manager'>('customer');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check sessionStorage on mount
  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) setIsLoggedIn(true);

    // Subscribe to login/logout events to update state
    const unsubLogin = eventBus.subscribe('userLoggedIn', () => setIsLoggedIn(true));
    const unsubLogout = eventBus.subscribe('userLoggedOut', () => setIsLoggedIn(false));

    return () => {
      unsubLogin();
      unsubLogout();
    };
  }, []);

  const handleLogin = () => {
    if (!userId) {
      eventBus.publish('notification', { 
        message: 'Please enter a User ID', 
        type: 'warning' 
      });
      return;
    }

    const userPayload: User = { 
      userId, 
      role, 
      permissions: ROLE_PERMISSIONS[role] || []
    };

    eventBus.publish('userLoggedIn', userPayload);
    sessionStorage.setItem('user', JSON.stringify(userPayload));

    // Update active users list
    const saved = localStorage.getItem(ACTIVE_USERS_KEY);
    const activeUsers: User[] = saved ? JSON.parse(saved) : [];
    if (!activeUsers.find((u) => u.userId === userId)) activeUsers.push(userPayload);
    localStorage.setItem(ACTIVE_USERS_KEY, JSON.stringify(activeUsers));

    eventBus.publish('notification', { 
      message: `Welcome ${userId}!`, 
      type: 'success' 
    });
  };

const handleLogout = () => {
  const saved = localStorage.getItem(ACTIVE_USERS_KEY);
  const current = sessionStorage.getItem('user');
  const currentUser: User | null = current ? JSON.parse(current) : null;

  if (saved && currentUser) {
    let activeUsers: User[] = JSON.parse(saved);
    activeUsers = activeUsers.filter((u) => u.userId !== currentUser.userId);
    localStorage.setItem(ACTIVE_USERS_KEY, JSON.stringify(activeUsers));
  }

  eventBus.publish('userLoggedOut', undefined);
  eventBus.publish('notification', { 
    message: 'Logged out successfully', 
    type: 'info' 
  });
  sessionStorage.removeItem('user');
};

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px' }}>
      <h1>Auth App</h1>
      <p>Simulate a login with a chosen user.</p>

      <div style={{ marginBottom: '10px' }}>
        <label>
          User ID:{' '}
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user id"
            style={{ padding: '5px', marginRight: '10px' }}
            disabled={isLoggedIn} // disable input if logged in
          />
        </label>
        <label>
          Role:{' '}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'customer' | 'admin' | 'manager')}
            style={{ padding: '5px' }}
            disabled={isLoggedIn} // disable select if logged in
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
        </label>
      </div>

      <button onClick={handleLogin} style={{ margin: '5px' }} disabled={isLoggedIn}>
        Login
      </button>
      <button onClick={handleLogout} style={{ margin: '5px' }} disabled={!isLoggedIn}>
        Logout
      </button>
    </div>
  );
};

export default Login;
