import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

function ChestBody() {
  const woodMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#5a3a1a", roughness: 0.65, metalness: 0.15, envMapIntensity: 0.4 }),
    []
  );
  const darkWoodMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#3d2510", roughness: 0.7, metalness: 0.08 }),
    []
  );
  const goldMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#d4a030", roughness: 0.2, metalness: 0.9,
      emissive: "#5a4010", emissiveIntensity: 0.25,
    }),
    []
  );
  const ironMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#9a8550", roughness: 0.3, metalness: 0.85 }),
    []
  );

  return (
    <group>
      {/* Main body with bevel for quality */}
      <mesh position={[0, 0, 0]} material={woodMat} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.7, 0.9]} />
      </mesh>
      {/* Inset panels front/back/sides */}
      <mesh position={[0, 0, 0.451]} material={darkWoodMat}>
        <boxGeometry args={[1.3, 0.55, 0.01]} />
      </mesh>
      <mesh position={[0, 0, -0.451]} material={darkWoodMat}>
        <boxGeometry args={[1.3, 0.55, 0.01]} />
      </mesh>
      <mesh position={[0.751, 0, 0]} material={darkWoodMat}>
        <boxGeometry args={[0.01, 0.55, 0.72]} />
      </mesh>
      <mesh position={[-0.751, 0, 0]} material={darkWoodMat}>
        <boxGeometry args={[0.01, 0.55, 0.72]} />
      </mesh>

      {/* Horizontal iron bands - 3 rows */}
      {[-0.22, 0, 0.22].map((y, i) => (
        <group key={`hband-${i}`}>
          <mesh position={[0, y, 0.456]} material={ironMat}>
            <boxGeometry args={[1.52, 0.035, 0.014]} />
          </mesh>
          <mesh position={[0, y, -0.456]} material={ironMat}>
            <boxGeometry args={[1.52, 0.035, 0.014]} />
          </mesh>
        </group>
      ))}

      {/* Vertical side straps */}
      {[-0.76, 0.76].map((x, i) => (
        <mesh key={`vstrap-${i}`} position={[x, 0, 0]} material={ironMat}>
          <boxGeometry args={[0.04, 0.72, 0.92]} />
        </mesh>
      ))}
      {/* Center vertical strap front & back */}
      <mesh position={[0, 0, 0.456]} material={ironMat}>
        <boxGeometry args={[0.055, 0.72, 0.014]} />
      </mesh>
      <mesh position={[0, 0, -0.456]} material={ironMat}>
        <boxGeometry args={[0.055, 0.72, 0.014]} />
      </mesh>

      {/* Corner studs - higher poly */}
      {[
        [0.74, 0.33, 0.44], [-0.74, 0.33, 0.44],
        [0.74, -0.33, 0.44], [-0.74, -0.33, 0.44],
        [0.74, 0.33, -0.44], [-0.74, 0.33, -0.44],
        [0.74, -0.33, -0.44], [-0.74, -0.33, -0.44],
      ].map((pos, i) => (
        <mesh key={`stud-${i}`} position={pos as [number, number, number]} material={goldMat} castShadow>
          <sphereGeometry args={[0.045, 16, 16]} />
        </mesh>
      ))}

      {/* Mid-panel decorative studs front */}
      {[-0.45, 0.45].map((x, i) => (
        <mesh key={`midstud-${i}`} position={[x, 0, 0.458]} material={goldMat}>
          <sphereGeometry args={[0.025, 12, 12]} />
        </mesh>
      ))}

      {/* Lock plate */}
      <mesh position={[0, 0.12, 0.462]} material={goldMat}>
        <boxGeometry args={[0.2, 0.24, 0.025]} />
      </mesh>
      {/* Lock plate border */}
      <mesh position={[0, 0.12, 0.476]} material={ironMat}>
        <boxGeometry args={[0.22, 0.26, 0.003]} />
      </mesh>
      {/* Keyhole circle */}
      <mesh position={[0, 0.13, 0.477]}>
        <cylinderGeometry args={[0.028, 0.028, 0.012, 16]} />
        <meshStandardMaterial color="#120a02" />
      </mesh>
      {/* Keyhole slot */}
      <mesh position={[0, 0.095, 0.477]}>
        <boxGeometry args={[0.014, 0.045, 0.012]} />
        <meshStandardMaterial color="#120a02" />
      </mesh>

      {/* Bottom feet - claw style */}
      {[
        [0.58, -0.4, 0.34], [-0.58, -0.4, 0.34],
        [0.58, -0.4, -0.34], [-0.58, -0.4, -0.34],
      ].map((pos, i) => (
        <group key={`foot-${i}`} position={pos as [number, number, number]}>
          <mesh material={goldMat} castShadow>
            <sphereGeometry args={[0.055, 12, 12]} />
          </mesh>
          <mesh position={[0, -0.03, 0]} material={goldMat}>
            <cylinderGeometry args={[0.04, 0.055, 0.03, 12]} />
          </mesh>
        </group>
      ))}

      {/* Bottom rim */}
      <mesh position={[0, -0.35, 0]} material={ironMat}>
        <boxGeometry args={[1.52, 0.02, 0.92]} />
      </mesh>
    </group>
  );
}

function ChestLid({ opened }: { opened: boolean }) {
  const lidRef = useRef<THREE.Group>(null);
  const currentAngle = useRef(0);

  useFrame(() => {
    if (!lidRef.current) return;
    const target = opened ? -0.55 : 0;
    currentAngle.current += (target - currentAngle.current) * 0.025;
    lidRef.current.rotation.x = currentAngle.current;
  });

  const woodMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#5a3a1a", roughness: 0.65, metalness: 0.15 }),
    []
  );
  const ironMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#9a8550", roughness: 0.3, metalness: 0.85 }),
    []
  );
  const goldMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#d4a030", roughness: 0.2, metalness: 0.9,
      emissive: "#5a4010", emissiveIntensity: 0.2,
    }),
    []
  );

  const lidShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.75, 0);
    s.quadraticCurveTo(-0.75, 0.42, 0, 0.5);
    s.quadraticCurveTo(0.75, 0.42, 0.75, 0);
    s.lineTo(-0.75, 0);
    return s;
  }, []);

  return (
    <group ref={lidRef} position={[0, 0.35, -0.45]}>
      <mesh material={woodMat} castShadow>
        <extrudeGeometry args={[lidShape, { steps: 2, depth: 0.9, bevelEnabled: false }]} />
      </mesh>
      {/* Lid bands front & back */}
      {[0.005, 0.895].map((z, i) => (
        <mesh key={`lidband-${i}`} position={[0, 0.16, z]} material={ironMat}>
          <boxGeometry args={[1.52, 0.04, 0.015]} />
        </mesh>
      ))}
      {/* Mid lid band */}
      <mesh position={[0, 0.16, 0.45]} material={ironMat}>
        <boxGeometry args={[1.52, 0.04, 0.015]} />
      </mesh>
      {/* Top ridge */}
      <mesh position={[0, 0.37, 0.45]} material={ironMat}>
        <boxGeometry args={[0.05, 0.05, 0.92]} />
      </mesh>
      {/* Lid studs */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={`lidstudf-${i}`} position={[x, 0.16, 0.9]} material={goldMat}>
          <sphereGeometry args={[0.03, 12, 12]} />
        </mesh>
      ))}
      {/* Hinges */}
      {[-0.4, 0, 0.4].map((x, i) => (
        <group key={`hinge-${i}`} position={[x, 0, 0.0]}>
          <mesh material={ironMat}>
            <boxGeometry args={[0.14, 0.07, 0.035]} />
          </mesh>
          <mesh position={[0, 0, -0.02]} material={goldMat}>
            <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function GoldCoins({ visible }: { visible: boolean }) {
  const coinMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#e8b830", roughness: 0.12, metalness: 0.95,
      emissive: "#7a5a15", emissiveIntensity: 0.5,
    }),
    []
  );
  const coinDarkMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#c99520", roughness: 0.18, metalness: 0.92,
      emissive: "#5a4010", emissiveIntensity: 0.4,
    }),
    []
  );

  // Stacked layers of coins
  const coins = useMemo(() => {
    const result: { pos: [number, number, number]; rot: [number, number, number]; s: number; dark: boolean }[] = [];
    // Base fill — wide spread touching chest walls
    for (let i = 0; i < 30; i++) {
      result.push({
        pos: [(Math.random() - 0.5) * 1.3, 0.18 + Math.random() * 0.1, (Math.random() - 0.5) * 0.7],
        rot: [Math.random() * 0.3 - 0.15, Math.random() * Math.PI, Math.random() * 0.3 - 0.15],
        s: 1.0 + Math.random() * 0.3,
        dark: Math.random() > 0.6,
      });
    }
    // Mid heap — slightly narrower
    for (let i = 0; i < 24; i++) {
      result.push({
        pos: [(Math.random() - 0.5) * 1.1, 0.32 + Math.random() * 0.1, (Math.random() - 0.5) * 0.55],
        rot: [Math.random() * 0.5 - 0.25, Math.random() * Math.PI, Math.random() * 0.5 - 0.25],
        s: 0.95 + Math.random() * 0.3,
        dark: Math.random() > 0.5,
      });
    }
    // Crown mound
    for (let i = 0; i < 14; i++) {
      result.push({
        pos: [(Math.random() - 0.5) * 0.8, 0.45 + Math.random() * 0.1, (Math.random() - 0.5) * 0.4],
        rot: [Math.random() * 0.6 - 0.3, Math.random() * Math.PI, Math.random() * 0.6 - 0.3],
        s: 0.9 + Math.random() * 0.3,
        dark: Math.random() > 0.4,
      });
    }
    return result;
  }, []);

  return (
    <group>
      {coins.map((c, i) => (
        <mesh key={i} position={c.pos} rotation={c.rot} scale={visible ? c.s : 0} material={c.dark ? coinDarkMat : coinMat} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 20]} />
        </mesh>
      ))}
    </group>
  );
}

function Sparkles({ active }: { active: boolean }) {
  const count = 30;
  const ref = useRef<THREE.Points>(null);

  const { positions, velocities, lifetimes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 0.012,
      y: 0.006 + Math.random() * 0.014,
      z: (Math.random() - 0.5) * 0.012,
    }));
    const lifetimes = Array.from({ length: count }, () => Math.random());
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.7;
      positions[i * 3 + 1] = 0.35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.45;
    }
    return { positions, velocities, lifetimes };
  }, []);

  useFrame(() => {
    if (!ref.current || !active) return;
    const posArr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      lifetimes[i] += 0.007;
      if (lifetimes[i] > 1) {
        lifetimes[i] = 0;
        posArr[i * 3] = (Math.random() - 0.5) * 0.7;
        posArr[i * 3 + 1] = 0.3 + Math.random() * 0.15;
        posArr[i * 3 + 2] = (Math.random() - 0.5) * 0.45;
      }
      posArr[i * 3] += velocities[i].x;
      posArr[i * 3 + 1] += velocities[i].y;
      posArr[i * 3 + 2] += velocities[i].z;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  const sparkMat = useMemo(
    () => new THREE.PointsMaterial({
      color: "#ffd700",
      size: 0.045,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    }),
    []
  );

  return (
    <points ref={ref} material={sparkMat}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
    </points>
  );
}

function InnerGlow({ opened }: { opened: boolean }) {
  const ref = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.intensity = opened ? 3.5 + Math.sin(t * 1.8) * 1.5 : 0;
  });
  return <pointLight ref={ref} position={[0, 0.55, 0]} color="#e8b830" distance={3.5} decay={2} />;
}

/* Soft shadow beneath the chest using a radial gradient texture */
function GroundShadow() {
  const texture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(0,0,0,0.45)");
    gradient.addColorStop(0.4, "rgba(0,0,0,0.2)");
    gradient.addColorStop(0.7, "rgba(0,0,0,0.06)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.46, 0.05]}>
      <planeGeometry args={[2.4, 1.4]} />
      <meshBasicMaterial map={texture} transparent opacity={1} depthWrite={false} />
    </mesh>
  );
}

function Scene({ onOpen }: { onOpen?: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setOpened(true);
      onOpen?.();
    }, 1400);
    return () => clearTimeout(t);
  }, [onOpen]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.35) * 0.3 + 0.15;
  });

  return (
    <>
      <ambientLight intensity={0.45} color="#f5e6c8" />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.6}
        color="#fff5e0"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.001}
      />
      <directionalLight position={[-3, 3, -2]} intensity={0.4} color="#c9952a" />
      <pointLight position={[0, -1, 2.5]} intensity={0.35} color="#a08040" />
      {/* Rim light from behind */}
      <pointLight position={[0, 1, -2]} intensity={0.5} color="#f0d080" />

      <group ref={groupRef} position={[0, -0.25, 0]} scale={0.78}>
        <ChestBody />
        <ChestLid opened={opened} />
        <GoldCoins visible={opened} />
        <InnerGlow opened={opened} />
        <Sparkles active={opened} />
        <GroundShadow />
      </group>
    </>
  );
}

export function TreasureChest3D({ onOpen, size = "md" }: { onOpen?: () => void; size?: "sm" | "md" }) {
  const dims = size === "sm"
    ? { w: 130, h: 145, scale: 0.56 }
    : { w: 180, h: 200, scale: 0.78 };

  return (
    <div
      className="relative"
      style={{ width: dims.w, height: dims.h, overflow: "visible" }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 -m-4 rounded-full blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsla(43, 70%, 50%, 0.18) 0%, transparent 70%)",
        }}
      />
      <Canvas
        camera={{ position: [0, 1.0, 4.5], fov: 22 }}
        style={{ pointerEvents: "none", overflow: "visible" }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
        dpr={[1, 2]}
        shadows
      >
        <Scene onOpen={onOpen} />
      </Canvas>
    </div>
  );
}
