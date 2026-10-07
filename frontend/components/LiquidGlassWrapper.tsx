'use client';
import React, { useEffect, useRef } from 'react';
import { LiquidGlass, GlassConfig } from '@/lib/liquidglass';

interface LiquidGlassWrapperProps {
  children: React.ReactNode;
  className?: string;
  glassSelector?: string;
  defaults?: Partial<GlassConfig>;
}

export default function LiquidGlassWrapper({
  children,
  className = '',
  glassSelector = '.liquid-glass',
  defaults = {
    cornerRadius: 24,
    blurAmount: 0.2,
    refraction: 0.6,
    chromAberration: 0.04,
    edgeHighlight: 0.1,
    fresnel: 0.8,
  },
}: LiquidGlassWrapperProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<LiquidGlass | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    let isMounted = true;

    const initGlass = async () => {
      try {
        const root = rootRef.current;
        if (!root) return;

        const elements = root.querySelectorAll<HTMLElement>(glassSelector);
        if (!elements || elements.length === 0) return;

        // Cleanup previous instance if any
        if (instanceRef.current) {
          instanceRef.current.destroy();
          instanceRef.current = null;
        }

        const instance = await LiquidGlass.init({
          root,
          glassElements: elements,
          defaults,
        });

        if (isMounted) {
          instanceRef.current = instance;
        } else {
          instance.destroy();
        }
      } catch (err) {
        console.warn('LiquidGlass WebGL init notice:', err);
      }
    };

    // Delay slightly to let initial DOM paint complete
    const timer = setTimeout(initGlass, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [glassSelector, defaults]);

  return (
    <div ref={rootRef} className={`relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
