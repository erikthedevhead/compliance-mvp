'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    setInstalled(window.matchMedia('(display-mode: standalone)').matches);
  }, []);
  return (
    <div className="grid">
      <div className="card">
        <h1 className="text-2xl font-bold mb-2">Compliance PWA</h1>
        <p className="mb-4">Capture LDAR inspections/leaks offline, attach evidence, and sync when online.</p>
        <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
          <Link href="/capture" className="text-center"><button>Open Field Capture</button></Link>
          <a href={process.env.NEXT_PUBLIC_API_BASE_URL + '/health'} className="text-center"><button>API Health</button></a>
        </div>
        {!installed && (
          <p className="mt-4 text-sm text-slate-600">
            Tip: use your browser’s “Add to Home Screen” to install this as an app.
          </p>
        )}
      </div>
    </div>
  );
}
