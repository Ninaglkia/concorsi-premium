"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, Environment, MeshTransmissionMaterial } from "@react-three/drei";
import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

// Shuffled ball inside the urna
function Ball({
  number,
  position,
  isEliminated,
  isWinner,
  isUserTicket,
  delay,
}: {
  number: number;
  position: [number, number, number];
  isEliminated: boolean;
  isWinner: boolean;
  isUserTicket: boolean;
  delay: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const [visible, setVisible] = useState(true);
  const startTime = useRef(0);

  useEffect(() => {
    if (isEliminated && !isWinner) {
      startTime.current = Date.now();
      const timer = setTimeout(() => setVisible(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isEliminated, isWinner]);

  useFrame((state) => {
    if (!ref.current) return;

    if (isEliminated && !isWinner && visible) {
      const elapsed = (Date.now() - startTime.current) / 1000;
      ref.current.position.y += elapsed * 0.05;
      ref.current.scale.setScalar(Math.max(0, 1 - elapsed * 1.3));
    } else if (isWinner) {
      ref.current.rotation.y = state.clock.elapsedTime * 2;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.15;
      ref.current.scale.setScalar(pulse * 1.5);
    } else if (!isEliminated) {
      // Gentle bobbing
      ref.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 1.5 + delay) * 0.15;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8 + delay) * 0.3;
      ref.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.6 + delay) * 0.2;
    }
  });

  if (!visible) return null;

  const color = isWinner
    ? "#fbbf24"
    : isUserTicket
    ? "#8b5cf6"
    : isEliminated
    ? "#ef4444"
    : "#ffffff";

  const emissiveColor = isWinner ? "#f59e0b" : isUserTicket ? "#7c3aed" : "#000000";
  const emissiveIntensity = isWinner ? 2 : isUserTicket ? 0.5 : 0;

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.3}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          transparent={isEliminated && !isWinner}
          opacity={isEliminated && !isWinner ? 0.5 : 1}
        />
      </mesh>
      <Text
        position={[0, 0, 0.21]}
        fontSize={0.12}
        color={isWinner ? "#000" : isUserTicket ? "#fff" : "#333"}
        font="/fonts/SpaceGrotesk-Bold.ttf"
        anchorX="center"
        anchorY="middle"
      >
        {number.toString()}
      </Text>
    </group>
  );
}

// Glass urna sphere
function Urna() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[2.2, 64, 64]} />
      <MeshTransmissionMaterial
        backside
        samples={8}
        thickness={0.3}
        chromaticAberration={0.1}
        anisotropy={0.1}
        distortion={0.05}
        distortionScale={0.1}
        temporalDistortion={0.05}
        color="#e0e7ff"
        roughness={0.05}
        transmission={0.98}
        ior={1.2}
      />
    </mesh>
  );
}

// Confetti particle after winner
function Confetti({ active }: { active: boolean }) {
  const count = 200;
  const ref = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const confettiColors = [
      [1, 0.84, 0], // gold
      [0.54, 0.36, 0.96], // purple
      [0.06, 0.82, 0.49], // green
      [0.96, 0.26, 0.21], // red
      [0.25, 0.56, 1], // blue
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      velocities[i * 3] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 1] = Math.random() * 0.15 + 0.05;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
      const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      colors[i * 3] = color[0];
      colors[i * 3 + 1] = color[1];
      colors[i * 3 + 2] = color[2];
    }
    return { positions, colors, velocities };
  }, []);

  useFrame(() => {
    if (!ref.current || !active) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const px = pos.getX(i) + particles.velocities[i * 3];
      const py = pos.getY(i) + particles.velocities[i * 3 + 1];
      const pz = pos.getZ(i) + particles.velocities[i * 3 + 2];
      pos.setXYZ(i, px, py, pz);
      particles.velocities[i * 3 + 1] -= 0.002; // gravity
    }
    pos.needsUpdate = true;
  });

  if (!active) return null;

  const posAttr = useMemo(
    () => new THREE.BufferAttribute(particles.positions, 3),
    [particles.positions]
  );
  const colAttr = useMemo(
    () => new THREE.BufferAttribute(particles.colors, 3),
    [particles.colors]
  );

  return (
    <points ref={ref}>
      <bufferGeometry>
        <primitive attach="attributes-position" object={posAttr} />
        <primitive attach="attributes-color" object={colAttr} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.9} toneMapped={false} />
    </points>
  );
}

interface ExtractionSceneProps {
  totalTickets: number;
  drawnNumbers: number[];
  userTickets: number[];
  winnerNumber: number | null;
  showConfetti: boolean;
}

function Scene({ totalTickets, drawnNumbers, userTickets, winnerNumber, showConfetti }: ExtractionSceneProps) {
  // Arrange balls in a sphere-packing-like layout
  const ballPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const phi = (1 + Math.sqrt(5)) / 2; // golden ratio
    for (let i = 0; i < totalTickets; i++) {
      const theta = 2 * Math.PI * i / phi;
      const r = 1.5 * Math.sqrt(i / totalTickets);
      const y = -1.5 + (3 * i) / totalTickets;
      positions.push([
        r * Math.cos(theta),
        y,
        r * Math.sin(theta),
      ]);
    }
    return positions;
  }, [totalTickets]);

  const drawnSet = useMemo(() => new Set(drawnNumbers), [drawnNumbers]);
  const userSet = useMemo(() => new Set(userTickets), [userTickets]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 8, 5]} intensity={1.5} color="#f59e0b" />
      <pointLight position={[-5, -3, 5]} intensity={0.7} color="#8b5cf6" />
      <spotLight position={[0, 10, 0]} intensity={1} angle={0.4} penumbra={1} color="#fbbf24" />

      <Urna />

      {Array.from({ length: totalTickets }, (_, i) => i + 1).map((num, i) => (
        <Ball
          key={num}
          number={num}
          position={ballPositions[i]}
          isEliminated={drawnSet.has(num)}
          isWinner={winnerNumber === num}
          isUserTicket={userSet.has(num)}
          delay={i * 0.3}
        />
      ))}

      <Confetti active={showConfetti} />

      <Environment preset="night" />
    </>
  );
}

export default function ExtractionScene(props: ExtractionSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
