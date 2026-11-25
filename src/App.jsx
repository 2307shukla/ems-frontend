import React, { useState } from 'react';
import Login from './Login';
import Nav from './Nav';
import EmployeeList from './EmployeeList';
import AttendancePanel from './AttendancePanel';
import LeavePanel from './LeavePanel';
import DashboardPanel from './DashboardPanel';
import UsersPanel from './UsersPanel';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState('employees');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const panels = {
    employees: <EmployeeList onLogout={handleLogout} />,
    attendance: <AttendancePanel />,
    leave: <LeavePanel />,
    dashboard: <DashboardPanel />,
    users: <UsersPanel />,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: 'sans-serif' }}>
      <Nav active={activeTab} onSelect={setActiveTab} onLogout={handleLogout} />
      {panels[activeTab]}
    </div>
  );
}

export default App;
