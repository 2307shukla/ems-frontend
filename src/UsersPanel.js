import React, { useState, useEffect } from 'react';
import { getUsers, updateUserRole } from './api';

function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id, role) => {
    setSavingId(id);
    try {
      await updateUserRole(id, role);
      await fetchUsers();
    } catch (err) {} finally {
      setSavingId(null);
    }
  };

  return (
    <div style={styles.content}>
      <h3 style={styles.sectionTitle}>User Accounts</h3>
      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : users.length === 0 ? (
        <div style={styles.empty}>No user accounts yet.</div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Linked Employee Id</th>
                <th style={styles.th}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.td}>{u.username}</td>
                  <td style={styles.td}>{u.employeeId ?? '-'}</td>
                  <td style={styles.td}>
                    <select
                      style={styles.select}
                      value={u.role}
                      disabled={savingId === u.id}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value="EMPLOYEE">EMPLOYEE</option>
                      <option value="HR">HR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  content: { padding: '24px', maxWidth: '1100px', margin: '0 auto' },
  sectionTitle: { color: '#333', marginBottom: '12px', marginTop: 0 },
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
  select: {
    padding: '6px 10px', border: '1px solid #ddd', borderRadius: '6px',
    fontSize: '13px', outline: 'none'
  },
  loading: { textAlign: 'center', padding: '40px', color: '#888' },
  empty: {
    textAlign: 'center', padding: '40px', color: '#888', background: 'white',
    borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  }
};

export default UsersPanel;
