import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE } from '@/lib/palette';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * HERO BACKDROP — a field of nodes on a lattice, breathing very slowly.
 *
 * The reading is deliberate: a national network of production points, not a
 * decorative particle effect. It carries no information, sits behind the H1 at
 * low contrast, and is entirely skippable — the hero is fully legible with the
 * canvas absent (§12.5), and it holds still under reduced motion (§12.4).
 */

// Few, legible nodes rather than a fine mist of them: at hero scale a dense
// grid renders as sub-pixel noise, and reads as texture instead of a network.
const COLS = 24;
const ROWS = 13;
const COUNT = COLS * ROWS;
const SPACING = 0.78;

function Field({ paused }: { paused: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  const cells = useMemo(() => {
    const out: { x: number; z: number; phase: number; weight: number }[] = [];
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        const x = (c - (COLS - 1) / 2) * SPACING + (r % 2 ? SPACING / 2 : 0);
        const z = (r - (ROWS - 1) / 2) * SPACING;
        const d = Math.hypot(x * 0.30, z * 0.55);
        out.push({ x, z, phase: d * 0.8, weight: Math.max(0, 1 - d / 4.6) });
      }
    }
    return out;
  }, []);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = paused ? 0 : clock.getElapsedTime() * 0.32;
    for (let i = 0; i < COUNT; i++) {
      const cell = cells[i];
      const lift = (Math.sin(t - cell.phase) * 0.5 + 0.5) * cell.weight;
      const h = 0.1 + lift * 0.95 * cell.weight;
      dummy.position.set(cell.x, h / 2, cell.z);
      dummy.scale.set(1, Math.max(h, 0.06), 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      // Nodes that are "producing" pick up the brand green; the rest stay mist.
      color.set(lift > 0.68 ? PALETTE.brand : lift > 0.34 ? PALETTE.supply : PALETTE.line);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined as never, undefined as never, COUNT]} frustumCulled={false}>
      <cylinderGeometry args={[0.062, 0.062, 1, 12]} />
      <meshStandardMaterial roughness={0.75} metalness={0.05} />
    </instancedMesh>
  );
}

/** The field leans very slightly toward the pointer, so the hero feels lit rather than printed. */
function ParallaxGroup({ paused, children }: { paused: boolean; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame((_, delta) => {
    if (!ref.current) return;
    const ry = -0.28 + (paused ? 0 : pointer.x * 0.07);
    const rx = paused ? 0 : -pointer.y * 0.03;
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, ry, 2.5, delta);
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, rx, 2.5, delta);
  });
  return <group ref={ref} position={[0, -1.35, 0]}>{children}</group>;
}

export default function HeroGrid() {
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const paused = reduced || !inView;

  return (
    <div ref={hostRef} className="absolute inset-0" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={paused ? 'demand' : 'always'}
        camera={{ position: [0, 5.4, 13.5], fov: 26 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.3} />
        <directionalLight position={[3, 8, 4]} intensity={1.1} />
        <directionalLight position={[-5, 2, -3]} intensity={0.35} color={PALETTE.ecosystem} />
        <ParallaxGroup paused={paused}>
          <Field paused={paused} />
        </ParallaxGroup>
      </Canvas>
    </div>
  );
}
