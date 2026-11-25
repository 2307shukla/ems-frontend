import React, { useState, useEffect } from 'react';
import { getDashboardStats } from './api';

function DashboardPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(res => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.loading}>Loading dashboard...</div>;
  if (!stats) return <div style={styles.loading}>Could not load dashboard.</div>;

  const cards = [
    { label: 'Total Employees', value: stats.totalEmployees },
    { label: 'Active Employees', value: stats.activeEmployees },
    { label: 'Departments', value: stats.totalDepartments },
    { label: 'Employees on Leave Today', value: stats.employeesOnLeave },
  ];

  return (
    <div style={styles.content}>
      <div style={styles.grid}>
        {cards.map(card => (
          <div key={card.label} style={styles.card}>
            <div style={styles.cardValue}>{card.value}</div>
            <div style={styles.cardLabel}>{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  content: { padding: '24px', maxWidth: '1100px', margin: '0 auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
  card: {
    background: 'white', padding: '28px', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center'
  },
  cardValue: { fontSize: '36px', fontWeight: '700', color: '#1a73e8' },
  cardLabel: { color: '#888', fontSize: '14px', marginTop: '6px' },
  loading: { textAlign: 'center', padding: '40px', color: '#888' }
};

export default DashboardPanel;
