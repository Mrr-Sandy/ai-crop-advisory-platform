# AI Crop Advisory Platform

AI-powered crop advisory and farmer assistance platform for TBI GEU SIP 2026.

## Project Description

This project uses a Node.js and Express backend with a React, Vite, React Router, and Tailwind CSS frontend. The frontend fetches crop data from the backend API and displays crop details such as crop name, season, soil type, and water requirement.

## Backend Setup

```bash
cd backend
npm install
node server.js
```

Backend runs at:

```text
http://localhost:5000
```

Crop API endpoint:

```text
GET http://localhost:5000/api/crops
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at the URL shown by Vite, usually:

```text
http://localhost:5173
```
