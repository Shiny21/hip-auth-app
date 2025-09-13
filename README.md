# Auth App

A React-based authentication micro-frontend with login/logout, role-based access, active user tracking, and toast notifications.  

---

## 🚀 Features
## 🚀 Features

###  Login / Logout flow
- Users can log in with a **User ID** and select a role (`customer`, `admin`, or `manager`).  
- Active user sessions are stored in **sessionStorage** and **localStorage**.  
- Handles cleanup of active users on logout.  

---

###  Role-based permissions
- **customer**: Can book tickets & view own bookings.  
- **admin**: Additional access to reports, user management, and seat maps.  
- **manager**: Access to department reports and seat map.  

---

### Toast Notifications
- Centralized notifications displayed using a **ToastContainer**.  
- Supports `success`, `warning`, `error`, and `info` messages.  
- Auto-dismisses after **5 seconds** or can be clicked to remove.  

---

### User Profile View
- Displays logged-in **user details** and permissions.  
- **Admins** see an **Active Users Dashboard**.  
- **Managers** see a **Manager View**.  
- **Customers** get a **Customer Access Note**.  

---

### EventBus Communication
- Decoupled components communicate via a shared **eventBus**.  
- **Events:**  
  - `userLoggedIn`  
  - `userLoggedOut`  
  - `notification`  
  - Future events (e.g., seat booking)  

---

##  Tech Stack
- React + TypeScript  
- Jest + React Testing Library  
- EventBus pattern  

---

