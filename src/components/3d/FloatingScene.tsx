"use client";

import { Canvas } from "@react-three/fiber";
import { Float, Environment, MeshTransmissionMaterial } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

function MoneyStack({ position, rotation, scale = 1 }: { position: [number, number, number]; rotation?: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3 + (rotation?.[1] || 0);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.5}>
      <group ref={ref} position={position} scale={scale}>
        {[0, 0.06, 0.12, 0.18, 0.24].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[0, i * 0.05, 0]}>
            <boxGeometry args={[1.2, 0.05, 0.6]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#22c55e" : "#16a34a"}
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>
        ))}
        {/* Money band */}
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.3, 0.28, 0.62]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.6} />
        </mesh>
      </group>
    </Float>
  );
}

function GoldCoin({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.8;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
      <mesh ref={ref} position={position} scale={scale}>
        <cylinderGeometry args={[0.4, 0.4, 0.08, 32]} />
        <meshStandardMaterial
          color="#f59e0b"
          roughness={0.15}
          metalness={0.9}
          emissive="#d97706"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

function Ticket({ position, rotation, scale = 1 }: { position: [number, number, number]; rotation?: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7 + (position[0] || 0)) * 0.1;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1.8}>
      <group ref={ref} position={position} rotation={rotation} scale={scale}>
        <mesh>
          <boxGeometry args={[1, 0.5, 0.02]} />
          <meshStandardMaterial
            color="#8b5cf6"
            roughness={0.2}
            metalness={0.4}
            emissive="#7c3aed"
            emissiveIntensity={0.15}
          />
        </mesh>
        {/* Ticket notch */}
        <mesh position={[0.35, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
          <meshStandardMaterial color="#0a0a0f" />
        </mesh>
        <mesh position={[-0.35, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
          <meshStandardMaterial color="#0a0a0f" />
        </mesh>
      </group>
    </Float>
  );
}

function Diamond({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.6;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.5}>
      <mesh ref={ref} position={position} scale={scale}>
        <octahedronGeometry args={[0.4, 0]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.5}
          chromaticAberration={0.3}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
          color="#60a5fa"
          roughness={0}
          transmission={1}
          ior={1.5}
        />
      </mesh>
    </Float>
  );
}

function GlowSphere({ position, color, scale = 0.15 }: { position: [number, number, number]; color: string; scale?: number }) {
  return (
    <Float speed={3} rotationIntensity={0} floatIntensity={3}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#f59e0b" />
      <pointLight position={[-10, -5, 5]} intensity={0.5} color="#8b5cf6" />
      <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.5} penumbra={1} color="#fbbf24" />

      {/* Money stacks */}
      <MoneyStack position={[-3.5, 1, -2]} rotation={[0, 0.5, 0.1]} scale={0.8} />
      <MoneyStack position={[3.8, -0.5, -1]} rotation={[0, -0.3, -0.1]} scale={0.6} />
      <MoneyStack position={[2, 2.5, -3]} rotation={[0.1, 0.8, 0]} scale={0.5} />

      {/* Gold coins */}
      <GoldCoin position={[-2, -1.5, -1]} scale={0.9} />
      <GoldCoin position={[1.5, 1.8, -2]} scale={0.7} />
      <GoldCoin position={[-4, 0.5, -2.5]} scale={0.5} />
      <GoldCoin position={[4.5, 1, -1.5]} scale={0.6} />

      {/* Tickets */}
      <Ticket position={[-1.5, 2, -1.5]} rotation={[0.2, 0.5, 0.1]} scale={0.7} />
      <Ticket position={[2.5, -1, -2]} rotation={[-0.1, -0.3, 0.15]} scale={0.6} />
      <Ticket position={[-3, -2, -1]} rotation={[0, 0.8, -0.1]} scale={0.5} />

      {/* Diamond */}
      <Diamond position={[0, 0.5, -1]} scale={1.2} />
      <Diamond position={[-4.5, -1, -3]} scale={0.6} />

      {/* Glow particles */}
      <GlowSphere position={[2, 3, -2]} color="#f59e0b" scale={0.08} />
      <GlowSphere position={[-3, 2.5, -1]} color="#8b5cf6" scale={0.06} />
      <GlowSphere position={[4, -2, -1.5]} color="#f59e0b" scale={0.1} />
      <GlowSphere position={[-1, -2.5, -2]} color="#8b5cf6" scale={0.07} />
      <GlowSphere position={[0, 3.5, -3]} color="#fbbf24" scale={0.05} />

      <Environment preset="night" />
    </>
  );
}

export default function FloatingScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
