import axios from 'axios';

const API_BASE = 'https://employee-management-system-bwvw.onrender.com';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (username, password) =>
  api.post('/api/auth/login', { username, password });

export const register = (username, password) =>
  api.post('/api/auth/register', { username, password });

// The backend now paginates (?page, ?size, ?sort). This app still shows the
// full list client-side with its own search box, so request a large page
// instead of rebuilding the UI around server-side paging right now.
export const getEmployees = () => api.get('/api/employees?size=1000');
export const getEmployee = (id) => api.get(`/api/employees/${id}`);
export const createEmployee = (data) => api.post('/api/employees', data);
export const updateEmployee = (id, data) => api.put(`/api/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/api/employees/${id}`);
