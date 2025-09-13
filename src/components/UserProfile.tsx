import React, { useState, useEffect } from 'react';
import { eventBus } from '../event-bus/EventBus';

interface User {
  userId: string;
  role: string;
  permissions?: string[];
}

const ACTIVE_USERS_KEY = 'activeUsers';

const ROLE_PERMISSIONS = {
  customer: ['book_tickets', 'view_own_bookings'],
  admin: ['book_tickets', 'view_all_bookings', 'view_reports', 'manage_users', 'view_seat_map'],
  manager: ['book_tickets', 'view_department_reports', 'view_seat_map']
};

const migrateUserData = (user: any): User => {
  if (user.permissions) {
    return user as User;
  }
  return {
    ...user,
    permissions: ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || []
  };
};

const UserProfile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load and migrate current user from sessionStorage
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const migratedUser = migrateUserData(parsed);
        setIsLoggedIn(true);
        setCurrentUser(migratedUser);

        // Update sessionStorage with migrated data
        sessionStorage.setItem('user', JSON.stringify(migratedUser));
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }

    // Load and migrate active users from localStorage
    const savedActive = localStorage.getItem(ACTIVE_USERS_KEY);
    if (savedActive) {
      try {
        const parsedUsers = JSON.parse(savedActive);
        const migratedUsers = parsedUsers.map(migrateUserData);
        setActiveUsers(migratedUsers);

        localStorage.setItem(ACTIVE_USERS_KEY, JSON.stringify(migratedUsers));
      } catch (error) {
        console.error('Failed to parse active users:', error);
      }
    }

    const unsubLogin = eventBus.subscribe('userLoggedIn', (payload: User) => {
      setIsLoggedIn(true);
      setCurrentUser(payload);
    });

    const unsubLogout = eventBus.subscribe('userLoggedOut', () => {
      setIsLoggedIn(false);
      setCurrentUser(null);
    });

    return () => {
      unsubLogin();
      unsubLogout();
    };
  }, []);

  const hasPermission = (permission: string): boolean => {
    return currentUser?.permissions?.includes(permission) || false;
  };

  if (!isLoggedIn || !currentUser) {
    return (
      <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px' }}>
        <h3>User Profile</h3>
        <p>You are currently logged out.</p>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px' }}>
      <h3>User Profile</h3>
      <p>Welcome back, <strong>{currentUser.userId}</strong>!</p>
      <p>Your role is: <strong>{currentUser.role}</strong></p>

      {currentUser.permissions && (
        <p>Permissions: {currentUser.permissions.join(', ')}</p>
      )}

      {hasPermission('manage_users') && (
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f5f5f5' }}>
          <h4>Admin Dashboard – Active Users</h4>
          <ul>
            {activeUsers.map((u, idx) => (
              <li key={idx}>
                User: <strong>{u.userId}</strong> | Role: <em>{u.role}</em>
                {u.permissions && ` | Permissions: ${u.permissions.join(', ')}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasPermission('view_department_reports') && !hasPermission('manage_users') && (
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f0f8ff' }}>
          <h4>Manager View</h4>
          <p>You have manager privileges for department reports.</p>
        </div>
      )}

      {!hasPermission('manage_users') && !hasPermission('view_department_reports') && (
        <div style={{ marginTop: '15px' }}>
          <p>You have customer access to book tickets and view your bookings.</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
