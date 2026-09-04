import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import GEOMETRY from '@/data/georgia-regions.json';
import { type RegionStatus } from '@/data/regions';
import { PALETTE } from '@/lib/palette';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { fitPerspectiveToBox } from '@/lib/fitCamera';

/**
 * GEORGIA — the coverage map, extruded from real administrative boundaries.
 *
 * Geometry: geoBoundaries ADM1 for Georgia (gbOpen licence), simplified and
 * projected to a local equirectangular plane at build time. It is the actual
 * shape of the country and its twelve administrative regions, not an
 * impression of them — the brief allows a map only where location materially
 * matters (§6), and a decorative approximation of a real country would be the
 * worst of both.
 *
 * Status colouring is driven by the coverage data, which is still placeholder
 * (§11.1) — the geography is real, the operational claim is not yet.
 */

interface RegionGeometry {
  id: string;
  en: string;
  ka: string;
  centroid: [number, number];
  /** Flat [x, y, x, y, …] ring, projected and simplified at build time. */
  ring: number[];
}

const DATA = GEOMETRY as RegionGeometry[];

/**
 * Four steps that all still read as land. `planned` was previously near-white,
 * which made the whole western half of the country look unrendered rather than
 * simply not yet operating.
 */
const STATUS_COLOR: Record<RegionStatus, string> = {
  operating: PALETTE.brand,
  development: PALETTE.supply,
  planned: '#C6CDBE',
  none: '#DCDDD4',
};

/**
 * One landmass, lightly stepped. A wide spread of extrusion depths made the
 * country look shattered into separate tiles instead of emphasised in places,
 * so the range is deliberately narrow — all regions share a base and only the
 * operating ones rise meaningfully above it.
 */
const STATUS_HEIGHT: Record<RegionStatus, number> = {
  operating: 0.34,
  development: 0.26,
  planned: 0.22,
  none: 0.2,
};

/* -------------------------------------------------------------------------- */

function useRegionGeometries(statuses: Record<string, RegionStatus>) {
  return useMemo(
    () =>
      DATA.map((r) => {
        const shape = new THREE.Shape();
        for (let i = 0; i < r.ring.length; i += 2) {
          const x = r.ring[i];
          const y = r.ring[i + 1];
          if (i === 0) shape.moveTo(x, y);
          else shape.lineTo(x, y);
        }
        const status = statuses[r.id] ?? 'none';
        const depth = STATUS_HEIGHT[status];
        const geo = new THREE.ExtrudeGeometry(shape, {
          depth,
          bevelEnabled: true,
          bevelSize: 0.012,
          bevelThickness: 0.012,
          bevelSegments: 2,
        });
        // Extrusion builds on XY; lay it flat so +Y is up in the scene.
        geo.rotateX(-Math.PI / 2);
        geo.computeVertexNormals();

        // rotateX(-90°) maps the shape's (x, y) to world (x, 0, -y). The outline
        // has to use -y too: built with +y it was a mirror image of its own
        // region, which is what put ghost borders across the wrong provinces.
        const pts = shape.getPoints(0);
        const outline = new THREE.BufferGeometry().setFromPoints(
          pts.map((p) => new THREE.Vector3(p.x, depth + 0.006, -p.y)),
        );

        return { region: r, geo, outline, status, depth };
      }),
    [statuses],
  );
}

function Region({
  entry, hovered, onHover, onSelect,
}: {
  entry: ReturnType<typeof useRegionGeometries>[number];
  hovered: string | null;
  onHover: (id: string | null) => void;
  onSelect?: (id: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const isHot = hovered === entry.region.id;

  useFrame((_, delta) => {
    if (!group.current) return;
    const lift = isHot ? 0.22 : 0;
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, lift, 9, delta);
  });

  const base = STATUS_COLOR[entry.status];

  return (
    <group
      ref={group}
      onPointerOver={(e) => { e.stopPropagation(); onHover(entry.region.id); }}
      onPointerOut={() => onHover(null)}
      // The canvas is not the accessible route to a region — the list beside it
      // is, and every item there is a real link. This is the pointer shortcut
      // for people who are already looking at the map.
      onClick={(e) => { e.stopPropagation(); onSelect?.(entry.region.id); }}
      onPointerEnter={() => { if (onSelect) document.body.style.cursor = 'pointer'; }}
      onPointerLeave={() => { if (onSelect) document.body.style.cursor = ''; }}
    >
      <mesh geometry={entry.geo} castShadow receiveShadow>
        {/* Opaque on purpose: dimming the other eleven regions with opacity
            washed the whole country out on hover and set twelve overlapping
            transparent meshes fighting over draw order. The lift and the
            brightened face are signal enough. */}
        <meshStandardMaterial
          color={isHot ? PALETTE.brand : base}
          roughness={entry.status === 'operating' ? 0.42 : 0.72}
          metalness={0.05}
          emissive={isHot ? PALETTE.brand : '#000000'}
          emissiveIntensity={isHot ? 0.28 : 0}
        />
      </mesh>
      <lineLoop geometry={entry.outline}>
        <lineBasicMaterial
          color={isHot ? PALETTE.ink : PALETTE.graphite}
          transparent
          opacity={isHot ? 0.7 : 0.22}
        />
      </lineLoop>
    </group>
  );
}

/** A marker standing on each operating region — presence, at a glance. */
function Pins({ entries, hovered }: {
  entries: ReturnType<typeof useRegionGeometries>; hovered: string | null;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.children.forEach((c, i) => {
      c.position.y = (c.userData.base as number) + Math.sin(t * 1.1 + i) * 0.03;
    });
  });

  const operating = entries.filter((e) => e.status === 'operating');
  return (
    <group ref={ref}>
      {operating.map((e) => (
        <group
          key={e.region.id}
          position={[e.region.centroid[0], e.depth + 0.3, -e.region.centroid[1]]}
          userData={{ base: e.depth + 0.3 }}
        >
          <mesh>
            <sphereGeometry args={[0.075, 14, 14]} />
            <meshStandardMaterial
              color={PALETTE.signal}
              emissive={PALETTE.signal}
              emissiveIntensity={hovered === e.region.id ? 0.9 : 0.45}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, -0.16, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.32, 6]} />
            <meshStandardMaterial color={PALETTE.signal} transparent opacity={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Frames the country to whatever container it is given, on mount and on resize. */
function FitCamera({ entries }: { entries: ReturnType<typeof useRegionGeometries> }) {
  const { camera, size } = useThree();

  const box = useMemo(() => {
    const b = new THREE.Box3();
    entries.forEach((e) => {
      e.geo.computeBoundingBox();
      if (e.geo.boundingBox) b.union(e.geo.boundingBox);
    });
    return b;
  }, [entries]);

  useEffect(() => {
    fitPerspectiveToBox(
      camera as THREE.PerspectiveCamera,
      box,
      new THREE.Vector3(0, 0.95, 0.34),
      1.04,
    );
  }, [camera, size.width, size.height, box]);

  return null;
}

function Scene({
  statuses, hovered, onHover, onSelect, paused,
}: {
  statuses: Record<string, RegionStatus>;
  hovered: string | null;
  onHover: (id: string | null) => void;
  onSelect?: (id: string) => void;
  paused: boolean;
}) {
  const entries = useRegionGeometries(statuses);
  const world = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useEffect(() => () => {
    entries.forEach((e) => { e.geo.dispose(); e.outline.dispose(); });
  }, [entries]);

  useFrame((_, delta) => {
    if (!world.current) return;
    const ry = paused ? 0 : pointer.x * 0.07;
    const rx = paused ? 0 : -pointer.y * 0.03;
    world.current.rotation.y = THREE.MathUtils.damp(world.current.rotation.y, ry, 3, delta);
    world.current.rotation.x = THREE.MathUtils.damp(world.current.rotation.x, rx, 3, delta);
  });

  return (
    <>
      <ambientLight intensity={1.05} />
      <directionalLight position={[4, 9, 5]} intensity={1.7} castShadow />
      <directionalLight position={[-6, 4, -4]} intensity={0.45} color={PALETTE.ecosystem} />

      <FitCamera entries={entries} />
      {/* A plate just under the regions: any sliver left where two simplified
          borders do not perfectly meet shows this rather than the page behind,
          so the seams read as shadow lines instead of holes. */}
      <mesh position={[0, -0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 20]} />
        <meshBasicMaterial color={PALETTE.line} transparent opacity={0.5} />
      </mesh>
      <group ref={world}>
        {entries.map((e) => (
          <Region key={e.region.id} entry={e} hovered={hovered} onHover={onHover} onSelect={onSelect} />
        ))}
        <Pins entries={entries} hovered={hovered} />
      </group>
    </>
  );
}

/* -------------------------------------------------------------------------- */

export default function GeorgiaMapScene({
  statuses, hovered, onHover, onSelect,
}: {
  statuses: Record<string, RegionStatus>;
  hovered: string | null;
  onHover: (id: string | null) => void;
  onSelect?: (id: string) => void;
}) {
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '140px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const paused = reduced || !inView;

  // The cursor is set on document.body from inside the scene, so it has to be
  // cleared when this component goes away — an unmount mid-hover would otherwise
  // leave the whole page showing a pointer.
  useEffect(() => () => { document.body.style.cursor = ''; }, []);

  return (
    <div ref={hostRef} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={paused ? 'demand' : 'always'}
        camera={{ position: [0, 9.6, 8.4], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={() => onHover(null)}
      >
        <Scene statuses={statuses} hovered={hovered} onHover={onHover} onSelect={onSelect} paused={paused} />
      </Canvas>
    </div>
  );
}
