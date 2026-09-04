import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE } from '@/lib/palette';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * DAIRY GRID NETWORK — the P09 page's diagram.
 *
 * Farms feed collection hubs; hubs feed one processing centre; milk moves along
 * the arcs. It is a picture of the programme's actual architecture (§9 "Program
 * purpose, architecture"), not an ambient graphic — which is the only reason a
 * canvas earns its place on a corporate page at all (§12.1).
 *
 * Deliberately not a map of Georgia: the real network geography is unverified,
 * and drawing it would be a claim (§11.1).
 */

const FARM_COUNT = 22;

type Node = { pos: THREE.Vector3; hub: number };

function useNetwork() {
  return useMemo(() => {
    // Deterministic pseudo-random layout: same picture on every render and every
    // machine, so design review is looking at one thing.
    let seed = 20260902;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    const hubs = [
      new THREE.Vector3(-2.6, 0, -0.7),
      new THREE.Vector3(0.4, 0, 1.1),
      new THREE.Vector3(2.9, 0, -0.4),
    ];
    const centre = new THREE.Vector3(0.2, 0, -2.4);

    const farms: Node[] = [];
    for (let i = 0; i < FARM_COUNT; i++) {
      const a = rand() * Math.PI * 2;
      const r = 1.4 + rand() * 3.4;
      const pos = new THREE.Vector3(Math.cos(a) * r * 1.5, 0, Math.sin(a) * r * 0.72 + 0.3);
      let hub = 0;
      let best = Infinity;
      hubs.forEach((h, hi) => {
        const d = h.distanceToSquared(pos);
        if (d < best) { best = d; hub = hi; }
      });
      farms.push({ pos, hub });
    }

    const arc = (from: THREE.Vector3, to: THREE.Vector3, lift: number) =>
      new THREE.QuadraticBezierCurve3(
        from,
        new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5).setY(lift),
        to,
      );

    const spokes = farms.map((f) => arc(f.pos, hubs[f.hub], 0.55 + f.pos.distanceTo(hubs[f.hub]) * 0.12));
    const trunks = hubs.map((h) => arc(h, centre, 1.15));

    return { farms, hubs, centre, spokes, trunks };
  }, []);
}

/** Thin tubes for every connection, merged into two draw calls. */
function Links({ curves, color, radius, opacity }: {
  curves: THREE.Curve<THREE.Vector3>[]; color: string; radius: number; opacity: number;
}) {
  const geo = useMemo(() => {
    const parts = curves.map((c) => new THREE.TubeGeometry(c, 26, radius, 6, false));
    const merged = parts[0].clone();
    // Manual concat keeps the dependency surface at three itself.
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    let offset = 0;
    for (const g of parts) {
      const pos = g.getAttribute('position');
      const nor = g.getAttribute('normal');
      for (let i = 0; i < pos.count; i++) {
        positions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
        normals.push(nor.getX(i), nor.getY(i), nor.getZ(i));
      }
      const idx = g.getIndex()!;
      for (let i = 0; i < idx.count; i++) indices.push(idx.getX(i) + offset);
      offset += pos.count;
      g.dispose();
    }
    merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    merged.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    merged.setIndex(indices);
    return merged;
  }, [curves, radius]);

  useEffect(() => () => geo.dispose(), [geo]);

  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color={color} roughness={0.9} transparent opacity={opacity} />
    </mesh>
  );
}

/** Milk moving farm → hub → centre. */
function Pulses({ curves, color, count, speed, size, paused }: {
  curves: THREE.Curve<THREE.Vector3>[]; color: string; count: number; speed: number; size: number; paused: boolean;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const offsets = useMemo(
    () => Array.from({ length: count }, (_, i) => ({ curve: i % curves.length, t: (i * 0.618) % 1 })),
    [count, curves.length],
  );

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const time = paused ? 0.2 : clock.getElapsedTime() * speed;
    for (let i = 0; i < count; i++) {
      const o = offsets[i];
      const t = (o.t + time) % 1;
      curves[o.curve].getPointAt(t, dummy.position);
      dummy.scale.setScalar(0.7 + Math.sin(t * Math.PI) * 0.55);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined as never, undefined as never, count]} frustumCulled={false}>
      <sphereGeometry args={[size, 10, 10]} />
      <meshStandardMaterial color={color} roughness={0.3} emissive={color} emissiveIntensity={0.35} />
    </instancedMesh>
  );
}

function Scene({ paused }: { paused: boolean }) {
  const { farms, hubs, centre, spokes, trunks } = useNetwork();
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!group.current) return;
    // Parallax, not orbit: the diagram leans toward the pointer and settles.
    const targetY = paused ? -0.35 : -0.35 + pointer.x * 0.22;
    const targetX = paused ? 0.42 : 0.42 - pointer.y * 0.1;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 3, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 3, delta);
  });

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 6, 4]} intensity={1.3} />
      <directionalLight position={[-5, 2, -3]} intensity={0.5} color={PALETTE.signal} />

      <group ref={group} position={[0, 0.1, 0]} scale={0.92}>
        <Links curves={spokes} color={PALETTE.mist} radius={0.012} opacity={0.3} />
        <Links curves={trunks} color={PALETTE.signal} radius={0.022} opacity={0.55} />

        {/* Farms */}
        {farms.map((f, i) => (
          <mesh key={i} position={f.pos}>
            <cylinderGeometry args={[0.055, 0.055, 0.1, 10]} />
            <meshStandardMaterial color={PALETTE.mist} roughness={0.7} />
          </mesh>
        ))}

        {/* Collection hubs */}
        {hubs.map((h, i) => (
          <group key={i} position={h}>
            <mesh>
              <cylinderGeometry args={[0.12, 0.14, 0.26, 14]} />
              <meshStandardMaterial color={PALETTE.signal} roughness={0.5} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
              <ringGeometry args={[0.24, 0.27, 32]} />
              <meshStandardMaterial color={PALETTE.signal} transparent opacity={0.4} />
            </mesh>
          </group>
        ))}

        {/* Processing centre */}
        <group position={centre}>
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.52, 0.32, 0.4]} />
            <meshStandardMaterial color={PALETTE.milk} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.34, 0]}>
            <boxGeometry args={[0.56, 0.04, 0.44]} />
            <meshStandardMaterial color={PALETTE.production} roughness={0.6} />
          </mesh>
        </group>

        <Pulses curves={spokes} color={PALETTE.milk} count={26} speed={0.07} size={0.032} paused={paused} />
        <Pulses curves={trunks} color={PALETTE.signal} count={9} speed={0.05} size={0.042} paused={paused} />
      </group>
    </>
  );
}

export default function GridNetworkScene() {
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

  return (
    <div ref={hostRef} className="absolute inset-0" aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        frameloop={paused ? 'demand' : 'always'}
        camera={{ position: [0, 5.6, 10.4], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene paused={paused} />
      </Canvas>
    </div>
  );
}
