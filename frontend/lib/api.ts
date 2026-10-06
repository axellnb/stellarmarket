const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const token = () => { try { return JSON.parse(localStorage.getItem('sm-state') || '{}')?.user?.token || ''; } catch { return ''; } };

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const t = token();
  const res = await fetch(`${API}${path}`, {
    ...init, cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}), ...(init?.headers || {}) }
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && t) window.dispatchEvent(new Event('sm-unauthorized')); // sesión vencida
  if (!res.ok) throw new Error((data as any).error || 'Error de servidor');
  return data as T;
}
