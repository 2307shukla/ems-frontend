import React, { useState, useEffect } from 'react';
import { createEmployee, updateEmployee, getEmployee } from './api';

function EmployeeForm({ employeeId, onSave, onCancel }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    department: '', position: '', salary: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (employeeId) {
      getEmployee(employeeId).then(res => setForm(res.data)).catch(() => {});
    }
  }, [employeeId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = { ...form, salary: form.salary ? parseFloat(form.salary) : null };
      if (employeeId) await updateEmployee(employeeId, data);
      else await createEmployee(data);
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>{employeeId ? 'Edit Employee' : 'Add New Employee'}</h3>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>First Name *</label>
              <input style={styles.input} name="firstName" value={form.firstName}
                onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Last Name *</label>
              <input style={styles.input} name="lastName" value={form.lastName}
                onChange={handleChange} required />
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email *</label>
            <input style={styles.input} name="email" type="email" value={form.email}
              onChange={handleChange} required />
          </div>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Department</label>
              <input style={styles.input} name="department" value={form.department}
                onChange={handleChange} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Position</label>
              <input style={styles.input} name="position" value={form.position}
                onChange={handleChange} />
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Salary</label>
            <input style={styles.input} name="salary" type="number" value={form.salary}
              onChange={handleChange} placeholder="Optional" />
          </div>
          <div style={styles.buttons}>
            <button type="button" style={styles.cancelBtn} onClick={onCancel}>Cancel</button>
            <button type="submit" style={styles.saveBtn} disabled={loading}>
              {loading ? 'Saving...' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modal: {
    background: 'white', padding: '32px', borderRadius: '12px',
    width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto'
  },
  title: { marginBottom: '20px', color: '#333', fontSize: '20px' },
  error: { background: '#fee', color: '#c00', padding: '10px', borderRadius: '6px', marginBottom: '16px' },
  row: { display: 'flex', gap: '16px' },
  field: { flex: 1, marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px', fontWeight: '500' },
  input: {
    width: '100%', padding: '9px 12px', border: '1px solid #ddd',
    borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box'
  },
  buttons: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
  cancelBtn: {
    padding: '10px 20px', background: '#f5f5f5', color: '#333',
    border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
  },
  saveBtn: {
    padding: '10px 24px', background: '#1a73e8', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
  }
};

export default EmployeeForm;
