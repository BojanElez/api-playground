# API Playground

## Setup Project

1. Install Node.js

   Recommended: Node.js 20+ and npm 10+.

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

- Use existing a `.env.example` rename it to `.env` file in the project root.
- Add Google OAuth client ID:

```env
VITE_GOOGLE_CLIENT_ID=existing_google_client_id_here
```

4. Start development server

```bash
npm run dev
```

5. Open application

- Vite will print the local URL in terminal, usually `http://localhost:5173`.

## Useful Commands

```bash
npm run dev            # Start dev server
npm run build          # Type-check and production build
npm run preview        # Preview production build
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
npm run test           # Run Jest in watch mode
npm run test:ci        # Run Jest once for CI
```

## How to Test (Examples)

### Step 1: Login

Login with one of these methods:

**Google OAuth:**

- Click "Login with Google" and follow the prompt.

**Test Credentials:**

- Email: `john.doe@example.com`
- Password: `SecurePass123!`

### Step 2: Try Sample Requests

Try these examples in the request composer:

**GET request:**

```
https://jsonplaceholder.typicode.com/posts
```

**POST request:**

```
https://jsonplaceholder.typicode.com/posts
```

Body: `{ "data": "test" }`

**PUT/PATCH request:**

```
https://jsonplaceholder.typicode.com/posts/1
```

Body: `{ "data": "test" }`

**DELETE request:**

```
https://jsonplaceholder.typicode.com/posts/1
```

**CORS test (expected to fail):**

```
https://www.linkedin.com/feed/
```

This demonstrates CORS limitations in browser environments.

## Project Description

API Playground is a React + TypeScript web app for composing and testing HTTP requests.

Main functionality:

- Login flow (credentials + Google OAuth).
- Protected routes for authenticated users.
- Request composer with URL, method, optional JSON body, and timeout control.
- Request execution pipeline and countdown.
- Request history with search, sorting, delete, pagination, and details page.
- Persisted request history in local storage.
- Request outcome stats (success/failed) visualized with a circular progress component.
- Theming support and reusable component library (buttons, inputs, dropdowns, textarea, widgets, notify, modal).

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- TanStack Query
- Jest + Testing Library
- ESLint + Prettier

## Notes

- If Google login does not work, verify `VITE_GOOGLE_CLIENT_ID`.
- For first access, open `/login` route.
