'use client';
import { usePathname } from 'next/navigation';

// La portada y el acceso ocupan todo el ancho; el resto vive en un contenedor.
export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path === '/' || path === '/register') return <main>{children}</main>;
  return <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>;
}
