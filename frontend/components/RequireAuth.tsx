'use client';
import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Role, useApp } from '@/lib/AppContext';

// Puerta de acceso: sin sesión envía a /register y recuerda a dónde iba la persona.
export default function RequireAuth({ children, role, wrongRole }: { children: ReactNode; role?: Role; wrongRole?: ReactNode }) {
  const { ready, user } = useApp();
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    if (ready && !user) {
      const next = path + (typeof window !== 'undefined' ? window.location.search : '');
      router.replace(`/register?next=${encodeURIComponent(next)}`);
    }
  }, [ready, user, path, router]);

  if (!ready || !user) return <p className="py-24 text-center text-muted">Verificando tu sesión…</p>;
  if (role && user.role !== role) return <>{wrongRole ?? <p className="py-24 text-center text-muted">Esta sección es solo para {role === 'client' ? 'clientes' : 'freelancers'}.</p>}</>;
  return <>{children}</>;
}
