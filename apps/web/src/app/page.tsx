import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Search,
  Users,
} from 'lucide-react';
import { JobCard } from '@/components/job-card';
import { Button } from '@/components/ui/button';
import { serverFetch } from '@/lib/api';
import type { PaginatedJobs } from '@/lib/types';

export default async function HomePage() {
  let jobs: PaginatedJobs | null = null;
  try {
    jobs = await serverFetch<PaginatedJobs>('/jobs', { limit: '6' });
  } catch {
    jobs = null;
  }

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 px-6 py-12 text-white shadow-xl md:px-12 md:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.18),transparent_40%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-100/80">
              JobBoard Pro
            </p>
            <h1 className="mt-3 max-w-xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight md:text-5xl">
              Encuentra tu próximo rol o el talento que tu equipo necesita
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-teal-50/90 md:text-lg">
              Publica ofertas, postúlate con una carta de presentación y gestiona
              el proceso desde un panel claro para candidatos y empresas.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/jobs">
                <Button size="lg" className="bg-white text-teal-900 hover:bg-teal-50">
                  <Search className="h-4 w-4" />
                  Explorar ofertas
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  Crear cuenta
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <form
            action="/jobs"
            className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"
          >
            <p className="font-[family-name:var(--font-display)] text-lg font-semibold">
              Búsqueda rápida
            </p>
            <p className="mt-1 text-sm text-teal-50/80">
              Empieza por rol, stack o ciudad y afina después con filtros.
            </p>
            <label className="mt-4 block text-sm font-medium text-teal-50">
              ¿Qué estás buscando?
            </label>
            <input
              name="q"
              placeholder="Ej. Full Stack, React, NestJS..."
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/95 px-3.5 py-3 text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
            />
            <label className="mt-3 block text-sm font-medium text-teal-50">
              Ubicación
            </label>
            <input
              name="location"
              placeholder="Buenos Aires, Remoto, Ciudad de México..."
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/95 px-3.5 py-3 text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
            />
            <Button type="submit" className="mt-4 w-full bg-white text-teal-900 hover:bg-teal-50">
              <Search className="h-4 w-4" />
              Buscar ofertas
            </Button>
          </form>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: Search,
            title: 'Descubre',
            text: 'Filtra por tipo, seniority, remoto y ubicación hasta dar con el rol ideal.',
          },
          {
            icon: ClipboardList,
            title: 'Postúlate',
            text: 'Envía una carta de presentación y deja constancia de tu interés en segundos.',
          },
          {
            icon: CheckCircle2,
            title: 'Haz seguimiento',
            text: 'Revisa estados: pendiente, en revisión, aceptada o rechazada desde tu panel.',
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm"
          >
            <item.icon className="h-6 w-6 text-teal-700" />
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-lg font-semibold">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-7 shadow-sm">
          <Users className="h-6 w-6 text-teal-700" />
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold">
            Para candidatos
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Encuentra oportunidades alineadas a tu nivel y modalidad, y concentra
            todas tus postulaciones en un solo lugar.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
              Búsqueda y filtros por rol, ciudad y seniority
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
              Postulación con carta de presentación
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
              Historial con estado de cada aplicación
            </li>
          </ul>
          <Link href="/register" className="mt-5 inline-block">
            <Button variant="secondary">Crear cuenta candidato</Button>
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-7 shadow-sm">
          <Building2 className="h-6 w-6 text-teal-700" />
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold">
            Para empresas
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Publica vacantes, controla borradores y revisa postulantes sin salir
            del panel de administración.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
              Perfil de compañía y ofertas ilimitadas en el MVP
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
              Estados: borrador, publicada o cerrada
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
              Gestión de postulantes y cambio de estado
            </li>
          </ul>
          <Link href="/register" className="mt-5 inline-block">
            <Button>Crear cuenta empresa</Button>
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold md:text-3xl">
              Ofertas recientes
            </h2>
            <p className="mt-1 text-sm text-slate-600 md:text-base">
              Roles publicados y listos para postular. Abre una tarjeta para ver el detalle completo.
            </p>
          </div>
          <Link href="/jobs" className="text-sm font-semibold text-teal-800 hover:underline">
            Ver todas
          </Link>
        </div>
        {!jobs ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-10 text-center text-slate-600">
            No se pudo conectar con la API. Arranca Postgres y el backend.
          </div>
        ) : jobs.items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-10 text-center text-slate-600">
            Todavía no hay ofertas publicadas.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.items.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
