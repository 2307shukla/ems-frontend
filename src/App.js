import React, { useState } from 'react';
import Login from './Login';
import EmployeeList from './EmployeeList';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  return isLoggedIn
    ? <EmployeeList onLogout={() => setIsLoggedIn(false)} />
    : <Login onLogin={() => setIsLoggedIn(true)} />;
}

export default App;
