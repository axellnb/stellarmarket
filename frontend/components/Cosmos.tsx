'use client';
import { useEffect, useRef } from 'react';

export type Side = 'client' | 'freelancer' | null;
const C = [125, 196, 255]; // cliente
const F = [62, 230, 160];  // freelancer
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

// Escena viva: una red de estrellas que reacciona a la mitad que enfocas.
// Cliente: las estrellas buscan tu cursor y se conectan a él. Freelancer: orbitan formando un anillo.
// `locked` = ya elegiste rol (toda la escena toma su color). `warp` = salto de hiperespacio al entrar.
export default function Cosmos({ focus, locked, warp }: { focus: Side; locked: boolean; warp: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const live = useRef({ focus, locked, warp });
  live.current = { focus, locked, warp };

  useEffect(() => {
    const cv = ref.current!; const ctx = cv.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0;
    const m = { x: 0, y: 0, sx: 0, sy: 0 };
    const st = { fc: 0, ff: 0, lock: 0, lockSide: 0, warp: 0 };
    type P = { x: number; y: number; z: number; vx: number; vy: number };
    let ps: P[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(60, Math.min(170, Math.floor((w * h) / 9000)));
      ps = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, z: 0.3 + Math.random() * 0.7, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25 }));
      m.x = m.sx = w / 2; m.y = m.sy = h / 2;
      if (reduce) frame();
    };
    const onMove = (e: PointerEvent) => { m.x = e.clientX; m.y = e.clientY; };

    function frame() {
      const L = live.current;
      const k = reduce ? 1 : 0.07;
      st.fc += ((L.focus === 'client' ? 1 : 0) - st.fc) * k;
      st.ff += ((L.focus === 'freelancer' ? 1 : 0) - st.ff) * k;
      st.lock += ((L.locked ? 1 : 0) - st.lock) * k;
      if (L.locked) st.lockSide += ((L.focus === 'freelancer' ? 1 : 0) - st.lockSide) * k;
      st.warp += ((L.warp ? 1 : 0) - st.warp) * 0.06;
      m.sx += (m.x - m.sx) * 0.12; m.sy += (m.y - m.sy) * 0.12;

      ctx.fillStyle = `rgba(11,15,20,${st.warp > 0.05 ? 0.12 : 0.28})`; ctx.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const ox = (m.sx / w - 0.5), oy = (m.sy / h - 0.5);
      const ringC = st.lock > 0.5 ? [cx, cy] : [w * 0.75, cy];
      const R = Math.min(w, h) * 0.32;

      for (const p of ps) {
        const tint = st.lock > 0.01 ? st.lockSide * st.lock + (p.x / w) * (1 - st.lock) : p.x / w;
        const wl = (1 - tint), wr = tint;
        // Cliente: atracción al cursor
        if (st.fc * wl > 0.01) {
          const dx = m.sx - p.x, dy = m.sy - p.y, d = Math.hypot(dx, dy) || 1;
          if (d < 380) { const f = (1 - d / 380) * 0.06 * st.fc * wl; p.vx += (dx / d) * f * 10; p.vy += (dy / d) * f * 10; }
        }
        // Freelancer: órbita en anillo
        if (st.ff * wr > 0.01) {
          const dx = p.x - ringC[0], dy = p.y - ringC[1], d = Math.hypot(dx, dy) || 1;
          const g = st.ff * wr;
          p.vx += (-dy / d) * 0.05 * g - (dx / d) * (d - R) * 0.0012 * g;
          p.vy += (dx / d) * 0.05 * g - (dy / d) * (d - R) * 0.0012 * g;
        }
        p.vx *= 0.975; p.vy *= 0.975;
        if (Math.abs(p.vx) + Math.abs(p.vy) < 0.12) { p.vx += (Math.random() - 0.5) * 0.04; p.vy += (Math.random() - 0.5) * 0.04; }
        if (st.warp > 0.02) { const dx = p.x - cx, dy = p.y - cy; p.vx += dx * 0.0035 * st.warp * p.z; p.vy += dy * 0.0035 * st.warp * p.z; }
        const px = p.x, py = p.y;
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) { p.x = Math.random() * w; p.y = Math.random() * h; p.vx = p.vy = 0; }
        (p as any).col = mix(C, F, tint); (p as any).px = px; (p as any).py = py;
      }

      // Conexiones
      for (let i = 0; i < ps.length; i++) {
        const a = ps[i] as any;
        for (let j = i + 1; j < ps.length; j++) {
          const b = ps[j] as any; const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 110) { ctx.strokeStyle = `rgba(${a.col[0]},${a.col[1]},${a.col[2]},${(1 - d / 110) * 0.28})`; ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.moveTo(a.x + ox * 40 * a.z, a.y + oy * 40 * a.z); ctx.lineTo(b.x + ox * 40 * b.z, b.y + oy * 40 * b.z); ctx.stroke(); }
        }
        // Hilos hacia el cursor (cliente)
        const dm = Math.hypot(a.x - m.sx, a.y - m.sy), wl = 1 - (st.lock > 0.01 ? st.lockSide : a.x / w);
        if (dm < 200 && st.fc * wl > 0.05) { ctx.strokeStyle = `rgba(125,196,255,${(1 - dm / 200) * 0.6 * st.fc * wl})`; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(m.sx, m.sy); ctx.stroke(); }
      }

      // Estrellas
      for (const p of ps as any[]) {
        const x = p.x + ox * 40 * p.z, y = p.y + oy * 40 * p.z;
        if (st.warp > 0.05) { ctx.strokeStyle = `rgba(${p.col.join(',')},.8)`; ctx.lineWidth = p.z * 1.4; ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(x, y); ctx.stroke(); }
        ctx.fillStyle = `rgba(${p.col.join(',')},${0.45 + p.z * 0.5})`;
        ctx.beginPath(); ctx.arc(x, y, p.z * 1.8, 0, 6.283); ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(frame);
    }

    resize(); window.addEventListener('resize', resize); window.addEventListener('pointermove', onMove);
    if (!reduce) raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', onMove); };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 h-full w-full" />;
}
