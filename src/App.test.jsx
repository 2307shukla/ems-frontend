import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => localStorage.clear());

test('shows the sign-in screen when nobody is signed in', () => {
  render(<App />);
  expect(screen.getByText('Employee Management System')).toBeInTheDocument();
  expect(screen.queryByText('Logout')).not.toBeInTheDocument();
});

test('shows the app with a Logout button once a token is stored', () => {
  localStorage.setItem('token', 'test-token');
  localStorage.setItem('role', 'ROLE_ADMIN');
  render(<App />);
  expect(screen.getByText('Logout')).toBeInTheDocument();
});
