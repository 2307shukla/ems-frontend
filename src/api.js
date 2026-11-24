import axios from 'axios';

// Override locally by creating a .env.local file (never committed) containing:
//   REACT_APP_API_BASE=http://localhost:8083
// Restart `npm start` after creating/changing it. Falls back to production.
const API_BASE = process.env.REACT_APP_API_BASE || 'https://employee-management-system-bwvw.onrender.com';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (username, password) =>
  api.post('/api/auth/login', { username, password });

export const register = (username, password, employeeCode) =>
  api.post('/api/auth/register', { username, password, employeeCode: employeeCode || undefined });

// The backend now paginates (?page, ?size, ?sort). This app still shows the
// full list client-side with its own search box, so request a large page
// instead of rebuilding the UI around server-side paging right now.
export const getEmployees = () => api.get('/api/employees?size=1000');
export const getEmployee = (id) => api.get(`/api/employees/${id}`);
export const createEmployee = (data) => api.post('/api/employees', data);
export const updateEmployee = (id, data) => api.put(`/api/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/api/employees/${id}`);

export const getDepartments = () => api.get('/api/departments');
export const createDepartment = (data) => api.post('/api/departments', data);

export const getDesignations = () => api.get('/api/designations');
export const createDesignation = (data) => api.post('/api/designations', data);

export const checkIn = () => api.post('/api/attendance/check-in');
export const checkOut = () => api.post('/api/attendance/check-out');
export const getMyAttendance = () => api.get('/api/attendance/me?size=1000');
export const getAllAttendance = () => api.get('/api/attendance?size=1000');

export const submitLeaveRequest = (data) => api.post('/api/leave-requests', data);
export const getMyLeaveRequests = () => api.get('/api/leave-requests/me?size=1000');
export const getAllLeaveRequests = () => api.get('/api/leave-requests?size=1000');
export const approveLeaveRequest = (id) => api.put(`/api/leave-requests/${id}/approve`);
export const rejectLeaveRequest = (id) => api.put(`/api/leave-requests/${id}/reject`);

export const getDashboardStats = () => api.get('/api/dashboard');

export const getUsers = () => api.get('/api/users');
export const updateUserRole = (id, role) => api.put(`/api/users/${id}/role`, { role });
