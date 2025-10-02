# Compliance PWA (frontend)

## Quick start
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
# open http://localhost:3000
```
Set `NEXT_PUBLIC_API_BASE_URL` to your API server (default `http://localhost:4000`).

## What’s included
- Minimal PWA: manifest + service worker
- Offline queue using IndexedDB (Dexie)
- Field capture screen with photo attach, local hashing (SHA-256), and manual "Sync now"
- Simple styles (no Tailwind to keep it thin — add later if you want)
