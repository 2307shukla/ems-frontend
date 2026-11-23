# Employee Management System — Frontend

A React UI for the [employee-management-system](https://github.com/2307shukla/employee-management-system)
backend: login/registration, a searchable employee list, and an add/edit form.

## Live deployment

- **App**: https://ems-frontend-88e9.onrender.com
- **Backend API**: https://employee-management-system-bwvw.onrender.com

## Running locally

```bash
npm install
npm start
```

Opens at `http://localhost:3000`. The API base URL is hardcoded in `src/api.js`
(`API_BASE`) — point it at a locally-running backend if needed.

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
| `src/App.js` | Top-level: shows `Login` or `EmployeeList` based on whether a token exists |
| `src/Login.js` | Login/Register form |
| `src/EmployeeList.js` | Searchable table, role-gated Add/Edit/Delete |
| `src/EmployeeForm.js` | Add/Edit modal |
| `src/api.js` | All backend calls (axios, with the JWT attached via an interceptor) |

## Available scripts

- `npm start` — dev server with hot reload
- `npm run build` — production build to `build/`
- `npm test` — CRA's test runner
