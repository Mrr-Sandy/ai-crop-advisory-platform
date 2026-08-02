# Deployment Checklist

## GitHub Push

- [ ] Commit Week 9 deployment preparation changes.
- [ ] Push the latest code to GitHub.
- [ ] Confirm the repository has separate `frontend` and `backend` folders.

## Render Deployment

- [ ] Create a Render Web Service for the `backend` folder.
- [ ] Set the build command to `npm install`.
- [ ] Set the start command to `npm start`.
- [ ] Add all backend environment variables in Render.
- [ ] Confirm the Render service starts successfully.

## Vercel Deployment

- [ ] Create a Vercel project for the `frontend` folder.
- [ ] Set the framework preset to Vite.
- [ ] Add `VITE_API_URL` with the deployed Render backend URL.
- [ ] Confirm the Vercel build completes successfully.

## Environment Variables

- [ ] `VITE_API_URL` is configured in Vercel.
- [ ] `PORT` is configured or provided by Render.
- [ ] `MONGO_URI` is configured in Render.
- [ ] `JWT_SECRET` is configured in Render.
- [ ] `GEMINI_API_KEY` is configured in Render.
- [ ] `CLIENT_URL` is configured in Render with the deployed Vercel URL.
- [ ] `GOOGLE_CLIENT_ID` is configured in Render if Google OAuth is enabled.
- [ ] `GOOGLE_CLIENT_SECRET` is configured in Render if Google OAuth is enabled.
- [ ] `SESSION_SECRET` is configured in Render.
- [ ] `GOOGLE_CALLBACK_URL` is configured in Render if Google OAuth is enabled.

## MongoDB Connection

- [ ] MongoDB Atlas connection string is valid.
- [ ] Render outbound access is allowed by MongoDB Atlas network settings.
- [ ] Backend logs confirm MongoDB connects successfully.

## JWT

- [ ] User registration returns the expected response.
- [ ] User login returns a token.
- [ ] Protected profile and crop routes accept the token.
- [ ] Invalid or missing tokens are rejected.

## Gemini API

- [ ] `GEMINI_API_KEY` is present in Render.
- [ ] AI Assistant returns a valid advisory response.
- [ ] Missing or invalid API key errors are handled correctly.

## CRUD Testing

- [ ] Create crop works.
- [ ] Read crop list works.
- [ ] Search crop works.
- [ ] Update crop works.
- [ ] Delete crop works.

## Login Testing

- [ ] Register works.
- [ ] Email/password login works.
- [ ] Logout works.
- [ ] Protected routes redirect unauthenticated users.
- [ ] Google OAuth works if enabled.

## AI Testing

- [ ] Authenticated users can open the AI Assistant.
- [ ] AI questions submit successfully.
- [ ] Loading and error states display correctly.

## Final Submission Checklist

- [ ] Frontend URL is added to `README.md`.
- [ ] Backend URL is added to `README.md`.
- [ ] Render environment variables are complete.
- [ ] Vercel environment variables are complete.
- [ ] Local build checks pass.
- [ ] Final deployed app is tested end to end.
