'use client';
import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Role, useApp } from '@/lib/AppContext';

// Puerta de acceso: sin sesión envía a /register a menos que se permita invitado.
export default function RequireAuth({ children, role, allowGuest, wrongRole }: { children: ReactNode; role?: Role; allowGuest?: boolean; wrongRole?: ReactNode }) {
  const { ready, user } = useApp();
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    if (ready && !user && !allowGuest) {
      const next = path + (typeof window !== 'undefined' ? window.location.search : '');
      router.replace(`/register?next=${encodeURIComponent(next)}`);
    }
  }, [ready, user, allowGuest, path, router]);

  if (!ready) return <p className="py-24 text-center text-muted">Verificando tu sesión…</p>;
  if (!user && !allowGuest) return <p className="py-24 text-center text-muted">Redirigiendo a registro…</p>;
  if (user && role && user.role !== role && !user.isGuest) return <>{wrongRole ?? <p className="py-24 text-center text-muted">Esta sección es solo para {role === 'client' ? 'clientes' : 'freelancers'}.</p>}</>;
  return <>{children}</>;
}
