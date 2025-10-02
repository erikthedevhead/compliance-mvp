import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import inspectionsRouter from './routes/inspections.js';
import evidenceRouter from './routes/evidence.js';

const app = express();
app.use(cors());
app.use(express.json({limit:'2mb'}));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/inspections', inspectionsRouter);
app.use('/api/evidence', evidenceRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on :${port}`));
