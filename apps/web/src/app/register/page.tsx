'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Building2, UserRound } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { FieldHint, Input, Label, Select } from '@/components/ui/field';
import type { UserRole } from '@/lib/types';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CANDIDATE');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await register({ name, email, password, role });
      router.push(user.role === 'EMPLOYER' ? '/dashboard/company' : '/dashboard/applications');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <aside className="rounded-2xl border border-slate-200 bg-white/90 p-7 shadow-sm">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
          Elige cómo quieres usar JobBoard Pro
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Una sola plataforma, dos experiencias. Puedes cambiar de rol creando otra
          cuenta si lo necesitas para demo.
        </p>
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <UserRound className="h-5 w-5 text-teal-700" />
              Candidato
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Explora vacantes, postúlate y sigue el estado de cada proceso desde
              tu historial de aplicaciones.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <Building2 className="h-5 w-5 text-teal-700" />
              Empresa
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Crea el perfil de tu compañía, publica ofertas y gestiona postulantes
              con estados claros.
            </p>
          </div>
        </div>
      </aside>

      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold md:text-3xl">
          Crear cuenta
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Completa tus datos para empezar. Luego te llevamos al panel según el tipo
          de cuenta que elijas.
        </p>
        <form onSubmit={onSubmit} className="mt-7 space-y-5">
          <div>
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              required
              placeholder="Ej. Ana Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FieldHint>Así te verán empresas o candidatos en el panel.</FieldHint>
          </div>
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
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              placeholder="Crea una contraseña segura"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FieldHint>Mínimo 6 caracteres. En producción usarías políticas más estrictas.</FieldHint>
          </div>
          <div>
            <Label htmlFor="role">Tipo de cuenta</Label>
            <Select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value="CANDIDATE">Candidato — busco empleo</option>
              <option value="EMPLOYER">Empresa — publico ofertas</option>
            </Select>
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Creando...' : 'Crear mi cuenta'}
          </Button>
        </form>
        <p className="mt-5 text-sm text-slate-600">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-semibold text-teal-800 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
