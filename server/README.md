# Compliance API (server)

## Quick start
1) Start Postgres (Docker example):
```bash
docker run -d --name compliance-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=compliance -p 5432:5432 postgres:16
```
2) Configure env & migrate:
```bash
cd server
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate --name init
```
3) Run the API:
```bash
npm run dev
# API on http://localhost:4000
```

## Endpoints
- `GET /health` — sanity check
- `POST /api/inspections` — JSON: { facility, componentId, leakDetected, observedAt, note? }
- `POST /api/evidence` — multipart: file + { facility, componentId, observedAt, sha256 }

S3 uploads use your configured bucket; optionally enable Object Lock by setting `S3_OBJECT_LOCK_DAYS` and turning on Object Lock at the bucket.
