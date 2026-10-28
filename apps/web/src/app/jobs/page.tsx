import { Suspense } from 'react';
import JobsPage from './jobs-client';

export default function Page() {
  return (
    <Suspense fallback={<p className="text-slate-600">Cargando ofertas...</p>}>
      <JobsPage />
    </Suspense>
  );
}
