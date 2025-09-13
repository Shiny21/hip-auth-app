import React from 'react';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import ToastContainer from './components/Toast';

const App = () => {
  return (
    <div>
      <Login />
      <hr style={{ margin: '20px 0' }} />
      <UserProfile />
      <ToastContainer />
    </div>
  );
};

export default App;