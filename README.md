# IRIS

A JARVIS-style AI assistant dashboard — voice-commanded, single-page HUD interface. Frontend only, no backend or API keys required.

## Features

- Voice commands via the browser's built-in Speech Recognition API
- Typed command fallback with the same command handling
- Live camera preview using `getUserMedia` (local only, nothing is uploaded)
- Simulated system telemetry, weather, and uptime widgets
- Conversation log with clear/export-to-file support

## Stack

React + TypeScript + Vite, styled with Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

## Notes

All data shown (system stats, weather) is simulated client-side for demo purposes — there's no backend. Voice recognition requires a Chromium-based browser (Chrome, Edge) and microphone permission.
