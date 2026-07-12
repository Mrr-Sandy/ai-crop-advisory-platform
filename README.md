# AI Crop Advisory Platform

AI Crop Advisory Platform is a React and Express application for managing crop information such as crop name, season, soil type, and water requirement. The frontend presents the data as a professional SaaS interface while preserving the completed backend contract.

## Screenshots

Screenshots should be captured from the running product after deployment or local verification:
- Landing page crop directory
- Dashboard crop management
- Mobile dashboard layout
- Dark mode dashboard

## Folder Structure

```text
ai-crop-advisory-platform/
  backend/
    models/
    routes/
    server.js
  frontend/
    src/
      api/
      components/
      pages/
  docs/
    README.md
    design/
  schema-diagram.png
  vercel.json
```

## Tech Stack

- Frontend: React, Vite, React Router, Tailwind CSS, Lucide React
- Backend: Node.js, Express, Mongoose, JWT, bcrypt, Passport.js
- Database: MongoDB Atlas
- Deployment config: Vercel rewrites for `/api`

## Backend Contract

The backend exposes crop management APIs and authentication APIs. Frontend code uses the existing crop API without changing routes, methods, response structure, schema, controllers, models, or database integration.

```text
GET    /api/crops
GET    /api/crops/search?name=value
GET    /api/crops/:id
POST   /api/crops
PUT    /api/crops/:id
DELETE /api/crops/:id
```

Crop fields:
- `_id`
- `name`
- `season`
- `soil`
- `water`

## Authentication

Week 6 authentication is implemented across the MERN stack.

Backend features:
- User registration with `bcrypt` password hashing
- Login with JWT generation
- Protected profile API with `verifyToken`
- Login input validation with `express-validator`
- Login rate limiting with `express-rate-limit`
- Google OAuth with `passport`, `passport-google-oauth20`, and `express-session`
- Proper HTTP status codes and JSON error messages

Authentication routes:

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
GET    /api/auth/google
GET    /api/auth/google/callback
```

Frontend features:
- Working Register and Login pages
- JWT storage in `localStorage`
- Protected Dashboard route
- Logout with token removal and redirect to Login
- Navbar updates after login/logout
- Loading states and user-friendly error messages
- Google login button that opens the backend OAuth route

Google OAuth flow:

1. User clicks `Continue with Google`.
2. Frontend opens `http://localhost:5000/api/auth/google`.
3. Passport redirects the user to Google.
4. Google redirects back to `/api/auth/google/callback`.
5. Backend finds or creates the user in MongoDB.
6. Backend generates a JWT and redirects to the frontend Login page with the token.
7. Frontend stores the JWT and redirects to Dashboard.

## Design System

The design system lives in `docs/design/` and is the single source of truth for UI decisions. It defines brand guidelines, colors, typography, spacing, components, page layouts, responsive behavior, animation, iconography, accessibility, UI patterns, design decisions, and roadmap.

Read first:

```text
docs/design/00_DESIGN_VISION.md
```

## UI Features

- Premium SaaS landing page
- Real API-backed crop directory
- Dashboard with crop statistics derived from backend responses
- Crop search through the existing search endpoint
- Create crop through the existing POST endpoint
- Update crop through the existing PUT endpoint
- Delete crop through the existing DELETE endpoint
- Loading, empty, success, and error states
- Dark mode
- Responsive layouts
- Accessible forms, buttons, dialogs, and status messaging

## Setup Instructions

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

Start the backend:

```bash
node server.js
```

Backend runs at:

```text
http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at the URL shown by Vite, usually:

```text
http://localhost:5173
```

The Vite development server proxies `/api` to `http://localhost:5000`, so frontend code continues using the same relative API URLs used in production.

## Development Workflow

1. Update the relevant design document before changing UI behavior.
2. Identify the backend API, React consumer, state store, and UI elements.
3. Implement frontend-only changes.
4. Verify loading, error, search, create, update, delete, and empty states.
5. Verify register, login, protected routes, logout, and Google OAuth after auth changes.
6. Run lint and build checks.

## Documentation Guide

- `docs/README.md`: documentation overview and workflow
- `docs/design/README.md`: design document map
- `docs/design/00_DESIGN_VISION.md`: product experience direction
- `docs/design/05_COMPONENT_LIBRARY.md`: reusable component rules
- `docs/design/12_UI_PATTERNS.md`: API-backed UI workflows
- `docs/design/14_UI_ROADMAP.md`: future UI that needs backend support

## Future Scope

- Real weather insights after a backend weather endpoint exists
- Analytics charts after analytics APIs exist
- Crop images after image fields or media endpoints exist
- Role-based workflows for farmers, officers, students, and researchers

## Contributing Guidelines

- Do not modify backend routes, models, controllers, schema, response shapes, or MongoDB integration unless the project owner explicitly asks.
- Do not use mock data or fake JSON in production UI.
- Keep visible data bound to real API responses.
- Update documentation before design system changes.
- Run frontend lint and build checks before submitting changes.

## License

This project is maintained for educational and demonstration use. Add an explicit license file before public redistribution.

## Database Schema

![Schema Diagram](schema-diagram.png)
