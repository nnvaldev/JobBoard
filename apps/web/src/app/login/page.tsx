'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useState } from 'react';
import { BriefcaseBusiness, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { FieldHint, Input, Label } from '@/components/ui/field';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      if (next !== '/dashboard') {
        router.push(next);
      } else if (user.role === 'EMPLOYER') {
        router.push('/dashboard/jobs');
      } else {
        router.push('/dashboard/applications');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <aside className="rounded-2xl border border-teal-800/20 bg-gradient-to-br from-teal-900 to-teal-800 p-7 text-white shadow-sm">
        <BriefcaseBusiness className="h-8 w-8 text-teal-100" />
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold">
          Bienvenido de nuevo
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-teal-50/90">
          Accede a tu panel para postularte, publicar vacantes o revisar el estado
          de tus procesos activos.
        </p>
        <ul className="mt-6 space-y-3 text-sm text-teal-50/95">
          <li className="flex gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            Sesión segura con JWT access + refresh
          </li>
          <li className="flex gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            Paneles separados para candidato y empresa
          </li>
          <li className="flex gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            Datos demo listos para explorar el flujo completo
          </li>
        </ul>
        <div className="mt-8 rounded-xl border border-white/15 bg-white/10 p-4 text-sm">
          <p className="font-semibold">Cuentas demo</p>
          <p className="mt-2 text-teal-50/90">candidato@demo.com · demo1234</p>
          <p className="text-teal-50/90">empresa@demo.com · demo1234</p>
        </div>
      </aside>

      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold md:text-3xl">
          Iniciar sesión
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Usa tu email y contraseña para entrar. Si aún no tienes cuenta, puedes
          registrarte en menos de un minuto.
        </p>
        <form onSubmit={onSubmit} className="mt-7 space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FieldHint>El mismo correo con el que te registraste.</FieldHint>
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              required
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar a mi cuenta'}
          </Button>
        </form>
        <p className="mt-5 text-sm text-slate-600">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="font-semibold text-teal-800 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <LoginForm />
    </Suspense>
  );
}
