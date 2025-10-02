import { db, InspectionRec, EvidenceRec } from './dexie';

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export async function queueInspection(rec: Omit<InspectionRec, 'id'|'synced'>) {
  await db.inspections.add({ ...rec, synced:false });
}

export async function addEvidence(rec: Omit<EvidenceRec, 'id'|'synced'>) {
  await db.evidence.add({ ...rec, synced:false });
}

export async function getQueueCounts() {
  return {
    inspections: await db.inspections.where('synced').equals(false).count(),
    evidence: await db.evidence.where('synced').equals(false).count()
  };
}

export async function trySync() {
  // Sync inspections
  const unsyncedInspections = await db.inspections.where('synced').equals(false).toArray();
  for (const ins of unsyncedInspections) {
    const res = await fetch(API + '/api/inspections', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(ins)
    });
    if (res.ok) {
      await db.inspections.update(ins.id!, { synced:true });
    }
  }
  // Sync evidence
  const unsyncedEvidence = await db.evidence.where('synced').equals(false).toArray();
  for (const ev of unsyncedEvidence) {
    const form = new FormData();
    form.append('facility', ev.facility);
    form.append('componentId', ev.componentId);
    form.append('observedAt', ev.observedAt);
    form.append('sha256', ev.sha256);
    form.append('file', new Blob([ev.bytes], { type: ev.mimeType }), ev.fileName);
    const res = await fetch(API + '/api/evidence', { method: 'POST', body: form });
    if (res.ok) {
      await db.evidence.update(ev.id!, { synced:true });
    }
  }
}
