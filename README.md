# hip-auth-app
Auth App

A simple authentication micro-frontend application built with React.
It demonstrates user login/logout, session & active user tracking, notifications via a Toast system, and role-based UI rendering via a shared EventBus.

Features

Login / Logout flow

Users simulate login functionality with a User ID and select a role (customer, admin, or manager).

Active user sessions are stored in sessionStorage and localStorage.

Handles cleanup of active users on logout.

Role-based permissions

customer: Can book tickets & view own bookings.

admin: Additional access to reports, user management, and seat maps.

manager: Access to department reports and seat map.

Toast Notifications

Centralized notifications displayed using a ToastContainer.

Supports success, warning, error, and info messages.

Auto-dismisses after 5 seconds or can be clicked to remove.

User Profile View

Displays logged-in user details and permissions.

Admins see an Active Users Dashboard.

Managers see a Manager View.

Customers get a Customer Access Note.

EventBus Communication

Decoupled components communicate via a shared eventBus.

Events: userLoggedIn, userLoggedOut, notification, and others (e.g., seat booking events for future use).

🛠️ Tech Stack

React (with Hooks for state management & effects)

TypeScript (for type safety)

Jest + React Testing Library (for unit testing)

EventBus pattern for micro-frontend communication
