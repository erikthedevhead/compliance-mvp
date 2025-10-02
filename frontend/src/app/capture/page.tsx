'use client';

import { useEffect, useState } from 'react';
import { addEvidence, queueInspection, getQueueCounts, trySync } from '@/src/lib/syncQueue';
import { sha256Hex } from '@/src/lib/hash';

type QueueCounts = { inspections:number; evidence:number };

export default function CapturePage() {
  const [counts, setCounts] = useState<QueueCounts>({inspections:0, evidence:0});
  const [photo, setPhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState('');
  const [componentId, setComponentId] = useState('');
  const [facility, setFacility] = useState('FAC-001');

  async function refresh() {
    setCounts(await getQueueCounts());
  }

  useEffect(() => { refresh(); }, []);

  async function onSave() {
    setSaving(true);
    try {
      const inspection = {
        facility,
        componentId,
        leakDetected: true,
        observedAt: new Date().toISOString(),
        note
      };
      await queueInspection(inspection);
      if (photo) {
        const buf = await photo.arrayBuffer();
        const hash = await sha256Hex(new Uint8Array(buf));
        await addEvidence({
          fileName: photo.name,
          mimeType: photo.type || 'image/jpeg',
          bytes: new Uint8Array(buf),
          sha256: hash,
          facility,
          componentId,
          observedAt: inspection.observedAt
        });
      }
      setNote('');
      setComponentId('');
      setPhoto(null);
      await refresh();
      alert('Saved locally. You can sync when online.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <h2 className="text-xl font-bold mb-2">Field Capture</h2>
        <div className="grid">
          <label>Facility</label>
          <select value={facility} onChange={e=>setFacility(e.target.value)}>
            <option value="FAC-001">FAC-001</option>
            <option value="FAC-002">FAC-002</option>
          </select>

          <label className="mt-2">Component ID</label>
          <input value={componentId} onChange={e=>setComponentId(e.target.value)} placeholder="e.g., VLV-12" />

          <label className="mt-2">Notes</label>
          <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Short observation" />

          <label className="mt-2">Photo / OGI frame</label>
          <input type="file" accept="image/*" capture="environment" onChange={e=>setPhoto(e.target.files?.[0]||null)} />
          <div className="grid" style={{gridTemplateColumns:'1fr 1fr', marginTop:'.75rem'}}>
            <button onClick={onSave} disabled={saving}>{saving?'Saving...':'Save offline'}</button>
            <button onClick={async ()=>{ await trySync(); await refresh(); }}>Sync now</button>
          </div>
          <p className="text-sm text-slate-600 mt-2">Offline queue — inspections: {counts.inspections}, evidence: {counts.evidence}</p>
        </div>
      </div>
    </div>
  );
}
