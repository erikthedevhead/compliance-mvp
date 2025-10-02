# Compliance MVP Starter (PWA + API)

This repo contains:
- **frontend/** — Next.js PWA with offline capture (IndexedDB/Dexie), SHA-256 hashing, and a manual “Sync now” queue
- **server/** — Node/Express + Prisma API with S3 upload (optional Object Lock) and Postgres persistence

## Run it locally

### API
```bash
docker run -d --name compliance-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=compliance -p 5432:5432 postgres:16
cd server
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate --name init
npm run dev
# -> http://localhost:4000/health
```

### Frontend
```bash
cd ../frontend
cp .env.example .env.local
npm install
npm run dev
# -> http://localhost:3000
```

Open **http://localhost:3000/capture** to try offline capture. Toggle airplane mode, save, then click **Sync now** when back online.

## Next steps
- Add auth (OIDC/SAML later; start with email/password or Auth0)
- Expand schema (Facilities, Components, Leaks/Repairs with deadline timers)
- Add CSV importers for meters/OGI logs
- Implement CEDRI export and TX RRC PR export endpoints
