import React, { useState, useEffect } from 'react';
import { createEmployee, updateEmployee, getEmployee, getDepartments, getDesignations } from './api';

const emptyForm = {
  employeeCode: '', firstName: '', lastName: '', email: '', mobileNo: '',
  dob: '', gender: '', departmentId: '', designationId: '', status: 'ACTIVE',
  salary: '', joiningDate: ''
};

function EmployeeForm({ employeeId, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getDepartments().then(res => setDepartments(res.data)).catch(() => {});
    getDesignations().then(res => setDesignations(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (employeeId) {
      getEmployee(employeeId).then(res => {
        const emp = res.data;
        setForm({
          employeeCode: emp.employeeCode || '',
          firstName: emp.firstName || '',
          lastName: emp.lastName || '',
          email: emp.email || '',
          mobileNo: emp.mobileNo || '',
          dob: emp.dob || '',
          gender: emp.gender || '',
          departmentId: emp.department ? String(emp.department.id) : '',
          designationId: emp.designation ? String(emp.designation.id) : '',
          status: emp.status || 'ACTIVE',
          salary: emp.salary ?? '',
          joiningDate: emp.joiningDate || '',
        });
      }).catch(() => {});
    }
  }, [employeeId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = {
        ...form,
        salary: form.salary !== '' ? parseFloat(form.salary) : null,
        departmentId: form.departmentId ? parseInt(form.departmentId, 10) : null,
        designationId: form.designationId ? parseInt(form.designationId, 10) : null,
        dob: form.dob || null,
        joiningDate: form.joiningDate || null,
        gender: form.gender || null,
      };
      if (employeeId) await updateEmployee(employeeId, data);
      else await createEmployee(data);
      onSave();
    } catch (err) {
      const serverMessage = Object.values(err.response?.data?.fields || {})[0]
        || err.response?.data?.error;
      setError(serverMessage || 'Failed to save employee');
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
              <label style={styles.label}>Employee Code *</label>
              <input style={styles.input} name="employeeCode" value={form.employeeCode}
                onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Status</label>
              <select style={styles.input} name="status" value={form.status} onChange={handleChange}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
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
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Email *</label>
              <input style={styles.input} name="email" type="email" value={form.email}
                onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Mobile No</label>
              <input style={styles.input} name="mobileNo" value={form.mobileNo}
                onChange={handleChange} placeholder="Optional" />
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Date of Birth</label>
              <input style={styles.input} name="dob" type="date" value={form.dob}
                onChange={handleChange} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Gender</label>
              <select style={styles.input} name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Not specified</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Department</label>
              <select style={styles.input} name="departmentId" value={form.departmentId} onChange={handleChange}>
                <option value="">None</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Designation</label>
              <select style={styles.input} name="designationId" value={form.designationId} onChange={handleChange}>
                <option value="">None</option>
                {designations.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Salary</label>
              <input style={styles.input} name="salary" type="number" value={form.salary}
                onChange={handleChange} placeholder="Optional" />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Joining Date</label>
              <input style={styles.input} name="joiningDate" type="date" value={form.joiningDate}
                onChange={handleChange} />
            </div>
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
    width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto'
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
