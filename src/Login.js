import React, { useState } from 'react';
import { login } from './api';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(username, password);
      localStorage.setItem('token', res.data.token);
      onLogin();
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Employee Management System</h2>
        <h3 style={styles.subtitle}>Login</h3>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.hint}>Default: admin / admin123</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: '#f0f2f5'
  },
  card: {
    background: 'white', padding: '40px', borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px'
  },
  title: { textAlign: 'center', color: '#1a73e8', marginBottom: '8px', fontSize: '22px' },
  subtitle: { textAlign: 'center', color: '#555', marginBottom: '24px', fontWeight: 'normal' },
  error: { background: '#fee', color: '#c00', padding: '10px', borderRadius: '6px', marginBottom: '16px', textAlign: 'center' },
  field: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', color: '#333', fontWeight: '500' },
  input: {
    width: '100%', padding: '10px 12px', border: '1px solid #ddd',
    borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box',
    outline: 'none'
  },
  button: {
    width: '100%', padding: '12px', background: '#1a73e8', color: 'white',
    border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer',
    marginTop: '8px'
  },
  hint: { textAlign: 'center', color: '#888', fontSize: '13px', marginTop: '16px' }
};

export default Login;
