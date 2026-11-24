import React from 'react';

function Nav({ active, onSelect, onLogout }) {
  const role = localStorage.getItem('role');
  const isManager = role === 'ADMIN' || role === 'HR';
  const isAdmin = role === 'ADMIN';

  const tabs = [
    { key: 'employees', label: 'Employees' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'leave', label: 'Leave' },
    ...(isManager ? [{ key: 'dashboard', label: 'Dashboard' }] : []),
    ...(isAdmin ? [{ key: 'users', label: 'Users' }] : []),
  ];

  return (
    <div style={styles.header}>
      <h1 style={styles.headerTitle}>Employee Management System</h1>
      <div style={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            style={active === tab.key ? styles.tabActive : styles.tab}
            onClick={() => onSelect(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
    </div>
  );
}

const styles = {
  header: {
    background: '#1a73e8', color: 'white', padding: '16px 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
    flexWrap: 'wrap'
  },
  headerTitle: { margin: 0, fontSize: '20px', fontWeight: '600', whiteSpace: 'nowrap' },
  tabs: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  tab: {
    background: 'transparent', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.3)',
    padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
  },
  tabActive: {
    background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.5)',
    padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600'
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)',
    padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
  }
};

export default Nav;
