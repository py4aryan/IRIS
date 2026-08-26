# IRIS

A JARVIS-style AI assistant dashboard — voice-commanded, single-page HUD interface, with a landing page, real login, and an onboarding survey in front of it.

## Features

- Landing page → login/signup → 3-step onboarding survey → dashboard
- Real authentication backed by a small local Express server (see `server/`) — bcrypt-hashed passwords, JWT session in an httpOnly cookie. No third-party auth provider, no API keys.
- Voice commands via the browser's built-in Speech Recognition API, with a "Hey IRIS" wake word — no mic button to click
- Typed command fallback with the same command handling
- Live camera preview using `getUserMedia` (local only, nothing is uploaded)
- Simulated system telemetry, weather, and uptime widgets
- Conversation log with clear/export-to-file support

## Stack

- Frontend: React + TypeScript + Vite, styled with Tailwind CSS v4, routed with React Router
- Backend: Express + TypeScript, `lowdb` (local JSON file, no external database), `bcryptjs`, `jsonwebtoken` — all pure JS, no native build step

## Getting started

Install both the frontend and backend dependencies:

```bash
npm install
npm --prefix server install
```

Copy the server env file and it's ready to go (a random `JWT_SECRET` is generated automatically the first time you set up `.env` — see `server/.env.example`):

```bash
cp server/.env.example server/.env
```

Then edit `server/.env` and replace `JWT_SECRET` with your own random string (any long random value works — this only has to be unique to your machine).

Run both servers together:

```bash
npm run dev:all
```

Or separately, in two terminals:

```bash
npm run dev          # frontend, http://localhost:5173
npm run dev:server   # backend, http://localhost:4000
```

## Notes

System stats and weather are simulated client-side for demo purposes. Voice recognition requires a Chromium-based browser (Chrome, Edge) and microphone permission. User accounts live in `server/data/db.json` (gitignored) — delete it to reset.
