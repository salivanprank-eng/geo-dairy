import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';
import type { RegionStatus } from '@/data/regions';

/**
 * The WebGL layer loads only after the page is interactive, only on devices that
 * will enjoy it, and only once its section is approaching the viewport. Content
 * never depends on it (§12.5) — every section reads correctly with the canvas
 * absent, which is also what a crawler and a reduced-capability device get.
 *
 * Gating on visibility is not only a performance win. Mounting a canvas that is
 * torn down moments later (a fast route change, a scroll straight past) leaves
 * three mid-initialisation and it throws on a null `domElement`. A canvas that
 * never mounts cannot lose that race.
 */

const HeroGridImpl = lazy(() => import('@/components/three/HeroGrid'));
const ValueChainImpl = lazy(() => import('@/components/three/ValueChainScene'));
const GridNetworkImpl = lazy(() => import('@/components/three/GridNetworkScene'));
const GeorgiaMapImpl = lazy(() => import('@/components/three/GeorgiaMapScene'));

function useDeferred3D(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Coarse capability gate: skip WebGL on very narrow viewports and on
    // devices that report a low core count or a data-saving connection.
    const narrow = window.matchMedia('(max-width: 640px)').matches;
    const lowCore = (navigator.hardwareConcurrency ?? 8) < 4;
    const saveData = (navigator as { connection?: { saveData?: boolean } }).connection?.saveData === true;
    if (narrow || lowCore || saveData) return;

    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const handle = idle ? idle(() => setReady(true)) : window.setTimeout(() => setReady(true), 400);
    return () => {
      const cancel = (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (idle && cancel) cancel(handle as number);
      else window.clearTimeout(handle as number);
    };
  }, []);

  return ready;
}

/** Mounts its child only once the host has come within 220px of the viewport. */
function Mount({ children }: { children: ReactNode }) {
  const ready = useDeferred3D();
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } },
      { rootMargin: '220px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {ready && near ? <Suspense fallback={null}>{children}</Suspense> : null}
    </div>
  );
}

export function LazyHeroGrid() {
  return <Mount><HeroGridImpl /></Mount>;
}

export function LazyValueChain(props: {
  active: 'upstream' | 'midstream' | 'downstream' | null;
  onActiveChange: (s: 'upstream' | 'midstream' | 'downstream' | null) => void;
  /** 0–1 when the page scroll drives the camera along the chain. */
  progress?: number | null;
}) {
  return <Mount><ValueChainImpl {...props} /></Mount>;
}

export function LazyGridNetwork() {
  return <Mount><GridNetworkImpl /></Mount>;
}

export function LazyGeorgiaMap(props: {
  statuses: Record<string, RegionStatus>;
  hovered: string | null;
  onHover: (id: string | null) => void;
  onSelect?: (id: string) => void;
}) {
  return <Mount><GeorgiaMapImpl {...props} /></Mount>;
}
