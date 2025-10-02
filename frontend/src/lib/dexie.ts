import Dexie, { Table } from 'dexie';

export interface InspectionRec {
  id?: number;
  facility: string;
  componentId: string;
  leakDetected: boolean;
  observedAt: string;
  note?: string;
  synced?: boolean;
}

export interface EvidenceRec {
  id?: number;
  fileName: string;
  mimeType: string;
  bytes: Uint8Array; // stored locally until sync
  sha256: string;
  facility: string;
  componentId: string;
  observedAt: string;
  synced?: boolean;
}

class ComplianceDB extends Dexie {
  inspections!: Table<InspectionRec, number>;
  evidence!: Table<EvidenceRec, number>;

  constructor() {
    super('compliance-db');
    this.version(1).stores({
      inspections: '++id, facility, componentId, observedAt, synced',
      evidence: '++id, facility, componentId, observedAt, sha256, synced'
    });
  }
}

export const db = new ComplianceDB();
