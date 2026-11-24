import React, { useState, useEffect } from 'react';
import {
  submitLeaveRequest, getMyLeaveRequests, getAllLeaveRequests,
  approveLeaveRequest, rejectLeaveRequest
} from './api';

function LeavePanel() {
  const role = localStorage.getItem('role');
  const isManager = role === 'ADMIN' || role === 'HR';

  const [myRequests, setMyRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [leaveType, setLeaveType] = useState('CASUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const fetchMine = async () => {
    try {
      const res = await getMyLeaveRequests();
      setMyRequests(res.data.content);
    } catch (err) {}
  };

  const fetchAll = async () => {
    if (!isManager) return;
    try {
      const res = await getAllLeaveRequests();
      setAllRequests(res.data.content);
    } catch (err) {}
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([fetchMine(), fetchAll()]);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await submitLeaveRequest({ leaveType, startDate, endDate, reason });
      setStartDate('');
      setEndDate('');
      setReason('');
      await fetchMine();
    } catch (err) {
      const serverMessage = Object.values(err.response?.data?.fields || {})[0]
        || err.response?.data?.error;
      setError(serverMessage || 'Could not submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveLeaveRequest(id);
      await fetchAll();
    } catch (err) {}
  };

  const handleReject = async (id) => {
    try {
      await rejectLeaveRequest(id);
      await fetchAll();
    } catch (err) {}
  };

  const statusStyle = (status) => {
    if (status === 'APPROVED') return styles.approvedBadge;
    if (status === 'REJECTED') return styles.rejectedBadge;
    return styles.pendingBadge;
  };

  return (
    <div style={styles.content}>
      <div style={styles.formCard}>
        <h3 style={{ marginTop: 0 }}>Submit Leave Request</h3>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <select style={styles.input} value={leaveType} onChange={e => setLeaveType(e.target.value)}>
            <option value="CASUAL">Casual</option>
            <option value="SICK">Sick</option>
            <option value="EARNED">Earned</option>
          </select>
          <input
            style={styles.input} type="date" value={startDate}
            onChange={e => setStartDate(e.target.value)} required
          />
          <input
            style={styles.input} type="date" value={endDate}
            onChange={e => setEndDate(e.target.value)} required
          />
          <input
            style={styles.inputWide} type="text" placeholder="Reason (optional)"
            value={reason} onChange={e => setReason(e.target.value)}
          />
          <button style={styles.btnPrimary} type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>

      <h3 style={styles.sectionTitle}>My Leave Requests</h3>
      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : myRequests.length === 0 ? (
        <div style={styles.empty}>No leave requests yet.</div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Start</th>
                <th style={styles.th}>End</th>
                <th style={styles.th}>Reason</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.map((r, i) => (
                <tr key={r.id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.td}>{r.leaveType}</td>
                  <td style={styles.td}>{r.startDate}</td>
                  <td style={styles.td}>{r.endDate}</td>
                  <td style={styles.td}>{r.reason || '-'}</td>
                  <td style={styles.td}><span style={statusStyle(r.status)}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isManager && (
        <>
          <h3 style={styles.sectionTitle}>All Leave Requests</h3>
          {allRequests.length === 0 ? (
            <div style={styles.empty}>No leave requests yet.</div>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Employee</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Start</th>
                    <th style={styles.th}>End</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allRequests.map((r, i) => (
                    <tr key={r.id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td style={styles.td}>{r.employee?.firstName} {r.employee?.lastName}</td>
                      <td style={styles.td}>{r.leaveType}</td>
                      <td style={styles.td}>{r.startDate}</td>
                      <td style={styles.td}>{r.endDate}</td>
                      <td style={styles.td}><span style={statusStyle(r.status)}>{r.status}</span></td>
                      <td style={styles.td}>
                        {r.status === 'PENDING' ? (
                          <>
                            <button style={styles.approveBtn} onClick={() => handleApprove(r.id)}>Approve</button>
                            <button style={styles.rejectBtn} onClick={() => handleReject(r.id)}>Reject</button>
                          </>
                        ) : (
                          <span style={{ color: '#aaa', fontSize: '13px' }}>-</span>
                        )}
                      </td>
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
  formCard: {
    background: 'white', padding: '20px', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px'
  },
  form: { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' },
  input: {
    padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px',
    fontSize: '14px', outline: 'none'
  },
  inputWide: {
    flex: 1, minWidth: '200px', padding: '10px 12px', border: '1px solid #ddd',
    borderRadius: '6px', fontSize: '14px', outline: 'none'
  },
  error: { background: '#fee', color: '#c00', padding: '10px', borderRadius: '6px', marginBottom: '12px' },
  btnPrimary: {
    background: '#1a73e8', color: 'white', border: 'none', padding: '10px 20px',
    borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500'
  },
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
  pendingBadge: {
    background: '#fff3e0', color: '#e65100', padding: '3px 10px',
    borderRadius: '20px', fontSize: '12px', fontWeight: '500'
  },
  approvedBadge: {
    background: '#e6f4ea', color: '#1e7e34', padding: '3px 10px',
    borderRadius: '20px', fontSize: '12px', fontWeight: '500'
  },
  rejectedBadge: {
    background: '#fce4e4', color: '#c62828', padding: '3px 10px',
    borderRadius: '20px', fontSize: '12px', fontWeight: '500'
  },
  approveBtn: {
    background: '#e6f4ea', color: '#1e7e34', border: '1px solid #a5d6a7',
    padding: '5px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', marginRight: '6px'
  },
  rejectBtn: {
    background: '#fce4e4', color: '#c62828', border: '1px solid #ef9a9a',
    padding: '5px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '13px'
  },
  loading: { textAlign: 'center', padding: '40px', color: '#888' },
  empty: {
    textAlign: 'center', padding: '40px', color: '#888', background: 'white',
    borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  }
};

export default LeavePanel;
