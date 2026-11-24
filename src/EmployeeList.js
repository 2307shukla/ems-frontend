import React, { useState, useEffect } from 'react';
import { getEmployees, deleteEmployee } from './api';
import EmployeeForm from './EmployeeForm';

function EmployeeList({ onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const role = localStorage.getItem('role');
  const canManage = role === 'ADMIN' || role === 'HR';

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await getEmployees();
      setEmployees(res.data.content);
    } catch (err) {
      if (err.response?.status === 401) onLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      setDeleteConfirm(null);
      fetchEmployees();
    } catch (err) {}
  };

  const filtered = employees.filter(e => {
    const matchesText = `${e.employeeCode} ${e.firstName} ${e.lastName} ${e.email} ${e.department?.name || ''} ${e.designation?.title || ''}`
      .toLowerCase().includes(search.toLowerCase());
    const matchesMin = minSalary === '' || (e.salary != null && e.salary >= parseFloat(minSalary));
    const matchesMax = maxSalary === '' || (e.salary != null && e.salary <= parseFloat(maxSalary));
    return matchesText && matchesMin && matchesMax;
  });

  return (
    <div>
      {/* Main content */}
      <div style={styles.content}>
        <div style={styles.toolbar}>
          <input
            style={styles.search}
            placeholder="Search by name, code, department, designation..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <input
            style={styles.salaryInput}
            type="number"
            placeholder="Min salary"
            value={minSalary}
            onChange={e => setMinSalary(e.target.value)}
          />
          <input
            style={styles.salaryInput}
            type="number"
            placeholder="Max salary"
            value={maxSalary}
            onChange={e => setMaxSalary(e.target.value)}
          />
          {canManage && (
            <button style={styles.addBtn} onClick={() => { setEditId(null); setShowForm(true); }}>
              + Add Employee
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statNum}>{employees.length}</div>
            <div style={styles.statLabel}>Total Employees</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNum}>
              {[...new Set(employees.map(e => e.department?.name).filter(Boolean))].length}
            </div>
            <div style={styles.statLabel}>Departments</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNum}>
              {employees.filter(e => e.status === 'ACTIVE').length}
            </div>
            <div style={styles.statLabel}>Active</div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={styles.loading}>Loading employees...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            {search ? 'No employees match your search.' : 'No employees yet. Click "+ Add Employee" to get started!'}
          </div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Designation</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Salary</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp, i) => (
                  <tr key={emp.id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                    <td style={styles.td}>{emp.employeeCode || '-'}</td>
                    <td style={styles.td}>
                      <div style={styles.nameCell}>
                        <div style={styles.avatar}>
                          {emp.firstName[0]}{emp.lastName[0]}
                        </div>
                        <span>{emp.firstName} {emp.lastName}</span>
                      </div>
                    </td>
                    <td style={styles.td}>{emp.email}</td>
                    <td style={styles.td}>
                      {emp.department && <span style={styles.badge}>{emp.department.name}</span>}
                    </td>
                    <td style={styles.td}>{emp.designation?.title || '-'}</td>
                    <td style={styles.td}>
                      <span style={emp.status === 'ACTIVE' ? styles.activeBadge : styles.inactiveBadge}>
                        {emp.status === 'INACTIVE' ? 'Inactive' : 'Active'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {emp.salary ? `₹${emp.salary.toLocaleString()}` : '-'}
                    </td>
                    <td style={styles.td}>
                      {canManage ? (
                        <>
                          <button style={styles.editBtn} onClick={() => { setEditId(emp.id); setShowForm(true); }}>
                            Edit
                          </button>
                          <button style={styles.deleteBtn} onClick={() => setDeleteConfirm(emp)}>
                            Delete
                          </button>
                        </>
                      ) : (
                        <span style={{ color: '#aaa', fontSize: '13px' }}>View only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <EmployeeForm
          employeeId={editId}
          onSave={() => { setShowForm(false); fetchEmployees(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={styles.overlay}>
          <div style={styles.confirmBox}>
            <h3 style={{ marginBottom: '12px' }}>Delete Employee?</h3>
            <p style={{ color: '#555', marginBottom: '20px' }}>
              Are you sure you want to delete <strong>{deleteConfirm.firstName} {deleteConfirm.lastName}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button style={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button style={styles.confirmDeleteBtn} onClick={() => handleDelete(deleteConfirm.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f0f2f5', fontFamily: 'sans-serif' },
  header: {
    background: '#1a73e8', color: 'white', padding: '16px 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
  },
  headerTitle: { margin: 0, fontSize: '20px', fontWeight: '600' },
  logoutBtn: {
    background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)',
    padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
  },
  content: { padding: '24px', maxWidth: '1100px', margin: '0 auto' },
  toolbar: { display: 'flex', gap: '12px', marginBottom: '20px' },
  search: {
    flex: 1, padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px',
    fontSize: '14px', outline: 'none'
  },
  salaryInput: {
    width: '120px', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px',
    fontSize: '14px', outline: 'none'
  },
  addBtn: {
    background: '#1a73e8', color: 'white', border: 'none', padding: '10px 20px',
    borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500'
  },
  stats: { display: 'flex', gap: '16px', marginBottom: '20px' },
  statCard: {
    flex: 1, background: 'white', padding: '20px', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center'
  },
  statNum: { fontSize: '32px', fontWeight: '700', color: '#1a73e8' },
  statLabel: { color: '#888', fontSize: '13px', marginTop: '4px' },
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
  nameCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: {
    width: '36px', height: '36px', borderRadius: '50%', background: '#1a73e8',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: '600', flexShrink: 0
  },
  badge: {
    background: '#e8f0fe', color: '#1a73e8', padding: '3px 10px',
    borderRadius: '20px', fontSize: '12px', fontWeight: '500'
  },
  activeBadge: {
    background: '#e6f4ea', color: '#1e7e34', padding: '3px 10px',
    borderRadius: '20px', fontSize: '12px', fontWeight: '500'
  },
  inactiveBadge: {
    background: '#f5f5f5', color: '#777', padding: '3px 10px',
    borderRadius: '20px', fontSize: '12px', fontWeight: '500'
  },
  editBtn: {
    background: '#fff8e1', color: '#f57c00', border: '1px solid #ffe082',
    padding: '5px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', marginRight: '6px'
  },
  deleteBtn: {
    background: '#fce4e4', color: '#c62828', border: '1px solid #ef9a9a',
    padding: '5px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '13px'
  },
  loading: { textAlign: 'center', padding: '40px', color: '#888' },
  empty: {
    textAlign: 'center', padding: '60px', color: '#888', background: 'white',
    borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
  },
  confirmBox: {
    background: 'white', padding: '28px', borderRadius: '12px',
    maxWidth: '400px', width: '100%'
  },
  cancelBtn: {
    padding: '9px 18px', background: '#f5f5f5', border: '1px solid #ddd',
    borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
  },
  confirmDeleteBtn: {
    padding: '9px 18px', background: '#d32f2f', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
  }
};

export default EmployeeList;
