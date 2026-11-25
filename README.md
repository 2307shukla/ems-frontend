# Employee Management System — Frontend

A React UI for the [employee-management-system](https://github.com/2307shukla/employee-management-system)
backend: login/registration, a searchable employee list, and an add/edit form.

## At a glance

- Sign in or register on one screen.
- Searchable employee list; administrators can add, edit and delete, employees get a read-only view.
- Built with React and Vite, and talks to the Employee Management System API.
- Free to run: deployed on a free hosting tier.

## Live deployment

- **App**: https://ems-frontend-88e9.onrender.com
- **Backend API**: https://employee-management-system-bwvw.onrender.com

## Running locally

Needs Node.js 20.19 or newer (Node 22 recommended).

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000` and uses the live backend API by default. To use a
locally running backend instead, copy `.env.example` to `.env.local` and set
`REACT_APP_API_BASE` (for example `http://localhost:8083`), then restart `npm run dev`.

## Auth & roles

- Login and Register are both on the same screen (toggle between them).
- Self-registration always creates an **EMPLOYEE** (read-only) account — there's no
  public way to self-assign admin.
- After login, the JWT and role are stored in `localStorage` (`token`, `role`).
- **ADMIN** accounts see Add/Edit/Delete controls on the employee list; **EMPLOYEE**
  accounts see a read-only "View only" list — this mirrors the backend's own
  role-based access control (an `EMPLOYEE` token gets a real `403` from the API if it
  tries to write, regardless of what the UI shows).

## How the employee list works

The backend's `GET /api/employees` is paginated (`PagedModel`: `{content, page}`).
This app requests a large page size (`?size=1000`, see `src/api.js`) and does its own
client-side search/filtering over the full result, rather than building server-side
page-by-page navigation — reasonable for this app's expected scale, not meant to hold
up at thousands of employees.

## Project structure

| File | Purpose |
|---|---|
| `src/App.jsx` | Top-level: shows `Login` or the signed-in app (employees, attendance, leave, dashboard, users) |
| `src/Login.jsx` | Login/Register form |
| `src/EmployeeList.jsx` | Searchable table, role-gated Add/Edit/Delete |
| `src/EmployeeForm.jsx` | Add/Edit modal |
| `src/api.js` | All backend calls (axios, with the JWT attached via an interceptor) |
| `vite.config.js` | Vite build and Vitest test settings |

## Available scripts

- `npm run dev` (or `npm start`): dev server with hot reload on port 3000
- `npm run build`: production build to `dist/`
- `npm run preview`: serve the production build locally
- `npm test`: run the tests once with Vitest

The Docker image builds with Node 22 and serves `dist/` with nginx.
