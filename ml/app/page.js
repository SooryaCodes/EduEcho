'use client';

import dynamic from 'next/dynamic';
import ErrorBoundary from '../components/ErrorBoundary';

const AudioProcessor = dynamic(() => import('../components/AudioProcessor'), {
  ssr: false,
  loading: () => <div className="text-center p-8">Loading...</div>
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <ErrorBoundary>
          <AudioProcessor />
        </ErrorBoundary>
      </div>
    </main>
  );
}
