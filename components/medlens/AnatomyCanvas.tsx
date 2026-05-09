"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { BODY_REGION_META, REGION_MESH_DEFS, type BodyLayer, type BodyRegionId, type BodyView } from "@/lib/body/regions";
import { ANATOMY_CANVAS_HEIGHT_CLASS } from "@/lib/ui/anatomyCanvasHeight";
import { cn } from "@/lib/utils";

type Props = {
  view: BodyView;
  layer: BodyLayer;
  selected: BodyRegionId[];
  hovered: BodyRegionId | null;
  onPick: (id: BodyRegionId) => void;
  onHover: (id: BodyRegionId | null) => void;
};

function RegionBox({
  id,
  position,
  args,
  rotation,
  selected,
  hovered,
  opacity,
  onPick,
  onHover,
}: {
  id: BodyRegionId;
  position: [number, number, number];
  args: [number, number, number];
  rotation?: [number, number, number];
  selected: boolean;
  hovered: boolean;
  opacity: number;
  onPick: (id: BodyRegionId) => void;
  onHover: (id: BodyRegionId | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const target = hovered || selected ? 0.45 : 0.12;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity ?? 0, target, delta * 6);
  });
  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      userData={{ regionId: id }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onPick(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(id);
        if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
          document.body.style.cursor = "pointer";
        }
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = "auto";
      }}
    >
      <boxGeometry args={args} />
      <meshStandardMaterial
        color={selected ? "#22d3ee" : "#94a3b8"}
        metalness={0.2}
        roughness={0.45}
        transparent
        opacity={opacity}
        emissive={new THREE.Color("#06b6d4")}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

function AnatomyModel({ view, layer, selected, hovered, onPick, onHover }: Props) {
  const meshes = useMemo(() => {
    return REGION_MESH_DEFS.filter((def) => {
      const meta = BODY_REGION_META[def.id];
      if (!meta.views.includes(view)) return false;
      return meta.layer === layer;
    });
  }, [view, layer]);

  return (
    <group rotation={view === "back" ? [0, Math.PI, 0] : [0, 0, 0]}>
      {meshes.map((def) => (
        <RegionBox
          key={def.id}
          id={def.id}
          position={def.position}
          args={def.args}
          rotation={def.rotation}
          selected={selected.includes(def.id)}
          hovered={hovered === def.id}
          opacity={layer === "internal" ? 0.85 : 1}
          onPick={onPick}
          onHover={onHover}
        />
      ))}
      <ContactShadows opacity={0.35} scale={12} blur={2.5} far={6} position={[0, -0.55, 0]} />
    </group>
  );
}

export function AnatomyCanvas(props: Props) {
  return (
    <div
      className={cn(
        ANATOMY_CANVAS_HEIGHT_CLASS,
        "relative w-full overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-b from-slate-950 via-[#030712] to-black shadow-card touch-none overscroll-contain ring-1 ring-cyan-500/10",
      )}
    >
      <Canvas
        camera={{ position: [0, 0.9, 2.6], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[2.5, 4, 3]} intensity={1.1} />
        <directionalLight position={[-3, 2, -2]} intensity={0.35} />
        <Suspense fallback={null}>
          <AnatomyModel {...props} />
          <OrbitControls
            enablePan={false}
            minDistance={1.6}
            maxDistance={4}
            target={[0, 0.85, 0]}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.85}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
