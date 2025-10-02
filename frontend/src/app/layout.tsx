export const metadata = {
  title: 'Compliance PWA',
  description: 'Offline-capable field capture for LDAR & emissions evidence'
};

import './globals.css';
import { useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="max-w-4xl mx-auto p-4">{children}</div>
      </body>
    </html>
  );
}
