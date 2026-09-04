import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE, STAGE_COLOR } from '@/lib/palette';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { fitPerspectiveToBox } from '@/lib/fitCamera';

/**
 * DAIRY VALUE CHAIN — homepage section 04 (§11) as a 3D diagram.
 *
 * The one thing a visitor must grasp at a glance is that GEO Dairy operates
 * across Upstream → Midstream → Downstream rather than at one point of it. So
 * the scene is a diagram, not a landscape: abstract massing, a single material
 * family, soft contact shadows to sit the objects on a surface, and milk moving
 * along the line between them. Every label lives in HTML beside it.
 *
 * Shadows do most of the work here. Unlit grey boxes on a flat plane read as
 * placeholder geometry; the same shapes with a soft key light and a real contact
 * shadow read as objects.
 */

export type ChainStage = 'upstream' | 'midstream' | 'downstream';

const STAGE_X: Record<ChainStage, number> = { upstream: -4.1, midstream: 0, downstream: 4.1 };

/** The whole scene is nudged down so it sits low in frame. Both the static fit
 *  and the travelling shot must account for it, or the camera aims above the
 *  buildings — which is exactly how the scroll shot ended up looking at sky. */
const WORLD_Y = -0.55;

/** Warm off-white body shared by every structure — one material family. */
const BODY = '#F2F0E9';
const BODY_SHADE = '#E4E1D6';

/* -------------------------------------------------------------------------- */
/* Building blocks                                                            */
/* -------------------------------------------------------------------------- */

function Box({ position, size, color = BODY }: {
  position: [number, number, number]; size: [number, number, number]; color?: string;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.78} metalness={0} />
    </mesh>
  );
}

/** A pitched roof: a triangle extruded along the building's depth. */
function Roof({ position, width, height, depth, color }: {
  position: [number, number, number]; width: number; height: number; depth: number; color: string;
}) {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-width / 2, 0);
    s.lineTo(width / 2, 0);
    s.lineTo(0, height);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false });
    g.translate(0, 0, -depth / 2);
    g.computeVertexNormals();
    return g;
  }, [width, height, depth]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo} position={position} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.04} />
    </mesh>
  );
}

/** Silo: cylinder with a domed cap, the one shape that reads as "dairy" instantly. */
function Silo({ position, radius, height, cap = STAGE_COLOR.upstream }: {
  position: [number, number, number]; radius: number; height: number; cap?: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 28]} />
        <meshStandardMaterial color={BODY} roughness={0.55} metalness={0.06} />
      </mesh>
      <mesh position={[0, height, 0]} castShadow>
        <sphereGeometry args={[radius, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={cap} roughness={0.5} metalness={0.06} />
      </mesh>
    </group>
  );
}

/**
 * Soft contact shadow.
 *
 * The key light is front-right-high because that models the massing well — but
 * it therefore throws its cast shadow backwards, away from the camera, where it
 * does nothing to sit the buildings on a surface. This is the grounding: a
 * radial falloff under each cluster, which reads from any angle.
 */
function useBlobTexture() {
  return useMemo(() => {
    const size = 256;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(11,26,20,0.42)');
    g.addColorStop(0.45, 'rgba(11,26,20,0.16)');
    g.addColorStop(1, 'rgba(11,26,20,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

function ContactShadow({ position, width, depth }: {
  position: [number, number, number]; width: number; depth: number;
}) {
  const tex = useBlobTexture();
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, depth]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/* Stages                                                                      */
/* -------------------------------------------------------------------------- */

function StageGroup({
  stage, active, onEnter, onLeave,
}: { stage: ChainStage; active: boolean; onEnter: () => void; onLeave: () => void }) {
  const group = useRef<THREE.Group>(null);
  const color = STAGE_COLOR[stage];

  useFrame((_, delta) => {
    if (!group.current) return;
    const lift = active ? 0.16 : 0;
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, lift, 8, delta);
  });

  return (
    <group
      ref={group}
      position={[STAGE_X[stage], 0, 0]}
      onPointerOver={(e) => { e.stopPropagation(); onEnter(); }}
      onPointerOut={() => onLeave()}
    >
      <ContactShadow position={[0, 0.004, 0.06]} width={3.6} depth={2.1} />

      {stage === 'upstream' && (
        <>
          {/* Barn with a pitched roof, plus feed silos */}
          <Box position={[-0.5, 0.3, 0]} size={[1.5, 0.6, 1]} />
          <Roof position={[-0.5, 0.6, 0]} width={1.56} height={0.4} depth={1.04} color={color} />
          <Silo position={[0.75, 0, 0.22]} radius={0.19} height={0.9} cap={color} />
          <Silo position={[1.15, 0, -0.18]} radius={0.15} height={0.66} cap={color} />
          <Box position={[0.3, 0.09, -0.42]} size={[0.5, 0.18, 0.34]} color={BODY_SHADE} />
        </>
      )}

      {stage === 'midstream' && (
        <>
          {/* Plant hall with a low monitor roof, process tanks and a stack */}
          <Box position={[0, 0.42, 0]} size={[1.9, 0.84, 1.15]} />
          <Box position={[0, 0.9, 0]} size={[1.96, 0.12, 1.2]} color={color} />
          <Box position={[0, 1.06, 0]} size={[0.9, 0.2, 0.7]} color={BODY} />
          <mesh position={[0.72, 1.32, -0.3]} castShadow>
            <cylinderGeometry args={[0.07, 0.09, 0.7, 16]} />
            <meshStandardMaterial color={BODY_SHADE} roughness={0.6} />
          </mesh>
          <Silo position={[-1.28, 0, 0.2]} radius={0.2} height={1.05} cap={color} />
          <Silo position={[1.28, 0, 0.25]} radius={0.2} height={0.85} cap={color} />
        </>
      )}

      {stage === 'downstream' && (
        <>
          {/* Distribution shed, palletised output and a trailer at the dock */}
          <Box position={[0.55, 0.34, 0]} size={[1.5, 0.68, 1.05]} />
          <Box position={[0.55, 0.72, 0]} size={[1.56, 0.08, 1.1]} color={color} />
          {[[-0.72, 0.14, 0.28], [-0.72, 0.14, -0.14], [-1.12, 0.14, 0.08]].map((p, i) => (
            <Box key={i} position={p as [number, number, number]} size={[0.34, 0.28, 0.34]}
              color={i % 2 ? BODY_SHADE : BODY} />
          ))}
          <Box position={[-0.72, 0.42, 0.28]} size={[0.34, 0.28, 0.34]} color={BODY} />
          {/* trailer */}
          <Box position={[-0.3, 0.3, -0.62]} size={[0.9, 0.42, 0.36]} color={BODY} />
          <Box position={[0.28, 0.24, -0.62]} size={[0.28, 0.3, 0.34]} color={BODY_SHADE} />
        </>
      )}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* The line between them                                                       */
/* -------------------------------------------------------------------------- */

const CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-5.6, 0.62, 0.05),
  new THREE.Vector3(STAGE_X.upstream, 0.78, 0.05),
  new THREE.Vector3(-2.05, 1.06, 0.05),
  new THREE.Vector3(STAGE_X.midstream, 1.24, 0.05),
  new THREE.Vector3(2.05, 1.06, 0.05),
  new THREE.Vector3(STAGE_X.downstream, 0.78, 0.05),
  new THREE.Vector3(5.6, 0.62, 0.05),
]);

function Pipeline() {
  const geo = useMemo(() => new THREE.TubeGeometry(CURVE, 180, 0.014, 10, false), []);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color={PALETTE.lineStrong} roughness={0.9} />
    </mesh>
  );
}

const FLOW_COUNT = 22;

/** Milk moving along the chain — a constant slow rate, never a performance. */
function Flow({ paused }: { paused: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const offsets = useMemo(() => Array.from({ length: FLOW_COUNT }, (_, i) => i / FLOW_COUNT), []);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const time = paused ? 0.15 : clock.getElapsedTime() * 0.04;
    for (let i = 0; i < FLOW_COUNT; i++) {
      const t = (offsets[i] + time) % 1;
      CURVE.getPointAt(t, dummy.position);
      dummy.scale.setScalar(0.75 + Math.sin(t * Math.PI) * 0.4);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined as never, undefined as never, FLOW_COUNT]} frustumCulled={false}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial
        color={PALETTE.brand}
        roughness={0.28}
        metalness={0.1}
        emissive={PALETTE.brand}
        emissiveIntensity={0.22}
      />
    </instancedMesh>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Camera.
 *
 * With no scroll progress it frames the whole chain — the diagram as a single
 * picture. When the page drives `progress`, it becomes a travelling shot that
 * moves along the chain from Upstream to Downstream, because the claim the brief
 * most wants landed is that GEO Dairy spans the whole of it. That is the one
 * technique worth borrowing from a cinematic WebGL site: the motion carries an
 * argument, rather than announcing that the site can do motion.
 */
function CameraRig({ progress }: { progress: number | null }) {
  const { camera, size } = useThree();
  const look = useRef(new THREE.Vector3(0, WORLD_Y + 0.45, 0));
  const scrolling = progress !== null;

  useEffect(() => {
    if (scrolling) return;
    fitPerspectiveToBox(
      camera as THREE.PerspectiveCamera,
      new THREE.Box3(
        new THREE.Vector3(-5.6, WORLD_Y, -0.8),
        new THREE.Vector3(5.6, WORLD_Y + 1.55, 0.8),
      ),
      new THREE.Vector3(0, 0.46, 1),
      1.0,
    );
  }, [camera, size.width, size.height, scrolling]);

  useFrame((_, delta) => {
    if (progress === null) return;
    const cam = camera as THREE.PerspectiveCamera;

    // Three stops, eased between, so each stage gets a beat rather than the
    // camera sliding past all of them at a constant rate.
    const stops = [STAGE_X.upstream, STAGE_X.midstream, STAGE_X.downstream];
    const t = THREE.MathUtils.clamp(progress, 0, 1) * (stops.length - 1);
    const i = Math.min(stops.length - 2, Math.floor(t));
    const f = t - i;
    const eased = f * f * (3 - 2 * f);
    const x = THREE.MathUtils.lerp(stops[i], stops[i + 1], eased);

    // Narrow containers need the camera further back or the buildings crop.
    const back = THREE.MathUtils.clamp(6.2 / cam.aspect, 4.4, 8.4);
    const target = new THREE.Vector3(x + 0.5, WORLD_Y + 1.55, back);
    const lookTarget = new THREE.Vector3(x, WORLD_Y + 0.45, 0);

    const k = 1 - Math.exp(-5 * delta);
    cam.position.lerp(target, k);
    look.current.lerp(lookTarget, k);
    cam.lookAt(look.current);
    cam.updateProjectionMatrix();
  });

  return null;
}

function Scene({ active, setActive, paused, progress }: {
  active: ChainStage | null; setActive: (s: ChainStage | null) => void;
  paused: boolean; progress: number | null;
}) {
  const world = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!world.current) return;
    // The scroll shot owns the camera; parallax on top of it fights the move.
    const idle = paused || progress !== null;
    const ry = idle ? 0 : pointer.x * 0.08;
    const rx = idle ? 0 : -pointer.y * 0.035;
    world.current.rotation.y = THREE.MathUtils.damp(world.current.rotation.y, ry, 3, delta);
    world.current.rotation.x = THREE.MathUtils.damp(world.current.rotation.x, rx, 3, delta);
  });

  return (
    <>
      <CameraRig progress={progress} />
      {/* Sky/ground fill keeps the shaded sides from going muddy, the key light
          casts the contact shadow that sits everything on the surface. */}
      <hemisphereLight args={['#FFFFFF', '#D8D6CC', 1.05]} />
      <directionalLight
        position={[4.5, 7, 5]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={0.5}
        shadow-camera-far={24}
      />
      <directionalLight position={[-6, 2.5, -3]} intensity={0.35} color="#DCE6E4" />

      <group ref={world} position={[0, WORLD_Y, 0]}>
        {/* Shadow-only ground: catches the contact shadow, shows nothing else,
            so the diagram sits on the page rather than on a grey slab. */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <shadowMaterial opacity={0.26} color={PALETTE.ink} />
        </mesh>

        <Pipeline />
        <Flow paused={paused} />

        {(['upstream', 'midstream', 'downstream'] as ChainStage[]).map((s) => (
          <StageGroup
            key={s}
            stage={s}
            active={active === s}
            onEnter={() => setActive(s)}
            onLeave={() => setActive(null)}
          />
        ))}
      </group>
    </>
  );
}

/* -------------------------------------------------------------------------- */

export default function ValueChainScene({
  active, onActiveChange, progress = null,
}: {
  active: ChainStage | null;
  onActiveChange: (s: ChainStage | null) => void;
  /** 0–1 along the chain when the page scroll drives the camera; null to frame it whole. */
  progress?: number | null;
}) {
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '120px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const paused = reduced || !inView;

  return (
    <div ref={hostRef} className="absolute inset-0">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        frameloop={paused ? 'demand' : 'always'}
        camera={{ position: [0, 4, 10], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={() => onActiveChange(null)}
      >
        <Scene active={active} setActive={onActiveChange} paused={paused} progress={progress} />
      </Canvas>
    </div>
  );
}
