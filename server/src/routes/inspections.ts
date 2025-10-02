import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.post('/', async (req, res) => {
  try {
    const { facility, componentId, leakDetected, observedAt, note } = req.body || {};
    if (!facility || !componentId || !observedAt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const created = await prisma.inspection.create({
      data: {
        facility,
        componentId,
        leakDetected: !!leakDetected,
        observedAt: new Date(observedAt),
        note: note || null
      }
    });
    res.json({ id: created.id });
  } catch (e:any) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
