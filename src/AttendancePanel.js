import React, { useState, useEffect } from 'react';
import { checkIn, checkOut, getMyAttendance, getAllAttendance } from './api';

function AttendancePanel() {
  const role = localStorage.getItem('role');
  const isManager = role === 'ADMIN' || role === 'HR';

  const [myRecords, setMyRecords] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const fetchMine = async () => {
    try {
      const res = await getMyAttendance();
      setMyRecords(res.data.content);
    } catch (err) {}
  };

  const fetchAll = async () => {
    if (!isManager) return;
    try {
      const res = await getAllAttendance();
      setAllRecords(res.data.content);
    } catch (err) {}
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([fetchMine(), fetchAll()]);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const todayRecord = myRecords.find(r => r.date === new Date().toISOString().slice(0, 10));

  const handleCheckIn = async () => {
    setBusy(true);
    setError('');
    try {
      await checkIn();
      await fetchMine();
    } catch (err) {
      setError(err.response?.data?.error || 'Check-in failed');
    } finally {
      setBusy(false);
    }
  };

  const handleCheckOut = async () => {
    setBusy(true);
    setError('');
    try {
      await checkOut();
      await fetchMine();
    } catch (err) {
      setError(err.response?.data?.error || 'Check-out failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={styles.content}>
      <div style={styles.actionsCard}>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.actions}>
          <button
            style={todayRecord ? styles.btnDisabled : styles.btnPrimary}
            onClick={handleCheckIn}
            disabled={busy || !!todayRecord}
          >
            Check In
          </button>
          <button
            style={(!todayRecord || todayRecord.checkOut) ? styles.btnDisabled : styles.btnSecondary}
            onClick={handleCheckOut}
            disabled={busy || !todayRecord || !!todayRecord.checkOut}
          >
            Check Out
          </button>
          {todayRecord && (
            <span style={styles.todayStatus}>
              Today: in {todayRecord.checkIn}
              {todayRecord.checkOut ? `, out ${todayRecord.checkOut}` : ' (not checked out yet)'}
            </span>
          )}
        </div>
      </div>

      <h3 style={styles.sectionTitle}>My Attendance</h3>
      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : myRecords.length === 0 ? (
        <div style={styles.empty}>No attendance records yet.</div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Check In</th>
                <th style={styles.th}>Check Out</th>
              </tr>
            </thead>
            <tbody>
              {myRecords.map((r, i) => (
                <tr key={r.id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.td}>{r.date}</td>
                  <td style={styles.td}>{r.checkIn || '-'}</td>
                  <td style={styles.td}>{r.checkOut || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isManager && (
        <>
          <h3 style={styles.sectionTitle}>All Employees' Attendance</h3>
          {allRecords.length === 0 ? (
            <div style={styles.empty}>No attendance records yet.</div>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Employee</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Check In</th>
                    <th style={styles.th}>Check Out</th>
                  </tr>
                </thead>
                <tbody>
                  {allRecords.map((r, i) => (
                    <tr key={r.id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td style={styles.td}>{r.employee?.firstName} {r.employee?.lastName}</td>
                      <td style={styles.td}>{r.date}</td>
                      <td style={styles.td}>{r.checkIn || '-'}</td>
                      <td style={styles.td}>{r.checkOut || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  content: { padding: '24px', maxWidth: '1100px', margin: '0 auto' },
  actionsCard: {
    background: 'white', padding: '20px', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px'
  },
  actions: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' },
  error: { background: '#fee', color: '#c00', padding: '10px', borderRadius: '6px', marginBottom: '12px' },
  btnPrimary: {
    background: '#1a73e8', color: 'white', border: 'none', padding: '10px 20px',
    borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500'
  },
  btnSecondary: {
    background: '#f57c00', color: 'white', border: 'none', padding: '10px 20px',
    borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500'
  },
  btnDisabled: {
    background: '#eee', color: '#999', border: 'none', padding: '10px 20px',
    borderRadius: '8px', cursor: 'not-allowed', fontSize: '14px', fontWeight: '500'
  },
  todayStatus: { color: '#555', fontSize: '14px' },
  sectionTitle: { color: '#333', marginBottom: '12px', marginTop: '28px' },
  tableWrap: {
    background: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    overflow: 'hidden'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8f9fa' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '13px', color: '#666', fontWeight: '600', borderBottom: '1px solid #eee' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#333', borderBottom: '1px solid #f5f5f5' },
  trEven: { background: 'white' },
  trOdd: { background: '#fafafa' },
  loading: { textAlign: 'center', padding: '40px', color: '#888' },
  empty: {
    textAlign: 'center', padding: '40px', color: '#888', background: 'white',
    borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  }
};

export default AttendancePanel;
