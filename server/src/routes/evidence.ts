import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { s3PutEvidence } from '../lib/s3.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 }}); // 10MB

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { facility, componentId, observedAt, sha256 } = req.body as any;
    if (!file || !facility || !componentId || !observedAt || !sha256) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    // server-side hash verification
    const serverHash = crypto.createHash('sha256').update(file.buffer).digest('hex');
    if (serverHash !== sha256) {
      return res.status(400).json({ error: 'Hash mismatch' });
    }
    const key = `evidence/${facility}/${new Date(observedAt).toISOString()}-${componentId}-${file.originalname}`;
    await s3PutEvidence(key, file.mimetype, file.buffer);

    const created = await prisma.evidence.create({
      data: {
        facility,
        componentId,
        observedAt: new Date(observedAt),
        sha256: serverHash,
        objectKey: key,
        mimeType: file.mimetype
      }
    });
    res.json({ id: created.id });
  } catch (e:any) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
