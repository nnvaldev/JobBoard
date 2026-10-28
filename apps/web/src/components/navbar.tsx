'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BriefcaseBusiness, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/jobs', label: 'Ofertas' },
    ...(user?.role === 'CANDIDATE'
      ? [{ href: '/dashboard/applications', label: 'Mis postulaciones' }]
      : []),
    ...(user?.role === 'EMPLOYER'
      ? [
          { href: '/dashboard/jobs', label: 'Mis ofertas' },
          { href: '/dashboard/company', label: 'Compañía' },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#f7f4ef]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white">
            <BriefcaseBusiness className="h-5 w-5" />
          </span>
          <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
            JobBoard Pro
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:text-slate-900',
                pathname.startsWith(link.href) && 'bg-white text-slate-900 shadow-sm',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {!loading && !user && (
            <>
              <Button variant="ghost" onClick={() => router.push('/login')}>
                Entrar
              </Button>
              <Button onClick={() => router.push('/register')}>Registrarse</Button>
            </>
          )}
          {!loading && user && (
            <>
              <span className="text-sm text-slate-600">{user.name}</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  logout();
                  router.push('/');
                }}
              >
                <LogOut className="h-4 w-4" />
                Salir
              </Button>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menú"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-[#f7f4ef] px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white"
              >
                {link.label}
              </Link>
            ))}
            {!user ? (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="px-3 py-2 text-sm">
                  Entrar
                </Link>
                <Link href="/register" onClick={() => setOpen(false)} className="px-3 py-2 text-sm">
                  Registrarse
                </Link>
              </>
            ) : (
              <button
                className="px-3 py-2 text-left text-sm text-red-700"
                onClick={() => {
                  logout();
                  setOpen(false);
                  router.push('/');
                }}
              >
                Salir
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
