"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { Suspense, useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

useGLTF.preload("/models/money-bundle.glb");

function DraggableMoneyBundle({
  initialPosition,
  initialRotation,
  scale = 1,
}: {
  initialPosition: [number, number, number];
  initialRotation: [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF("/models/money-bundle.glb");
  const ref = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const offsetVec = useRef(new THREE.Vector3());
  const intersectVec = useRef(new THREE.Vector3());
  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());
  const { camera, gl } = useThree();

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  const getPointer = (e: any) => {
    const rect = gl.domElement.getBoundingClientRect();
    pointer.current.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
  };

  const onPointerDown = (e: any) => {
    e.stopPropagation();
    isDragging.current = true;
    gl.domElement.style.cursor = "grabbing";

    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    dragPlane.current.setFromNormalAndCoplanarPoint(camDir.negate(), ref.current!.position);

    getPointer(e);
    raycaster.current.setFromCamera(pointer.current, camera);
    raycaster.current.ray.intersectPlane(dragPlane.current, intersectVec.current);
    offsetVec.current.copy(ref.current!.position).sub(intersectVec.current);

    e.target?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: any) => {
    if (!isDragging.current) return;
    e.stopPropagation();

    getPointer(e);
    raycaster.current.setFromCamera(pointer.current, camera);
    raycaster.current.ray.intersectPlane(dragPlane.current, intersectVec.current);

    if (ref.current) {
      ref.current.position.copy(intersectVec.current.add(offsetVec.current));
    }
  };

  const onPointerUp = (e: any) => {
    e.stopPropagation();
    isDragging.current = false;
    gl.domElement.style.cursor = "grab";
  };

  useFrame((state) => {
    if (!ref.current || isDragging.current) return;
    ref.current.rotation.y += 0.003;
    ref.current.position.y =
      initialPosition[1] + Math.sin(state.clock.elapsedTime * 0.8 + initialPosition[0]) * 0.08;
  });

  return (
    <group
      ref={ref}
      position={initialPosition}
      rotation={initialRotation}
      scale={scale}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerOver={() => {
        if (!isDragging.current) gl.domElement.style.cursor = "grab";
      }}
      onPointerOut={() => {
        if (!isDragging.current) gl.domElement.style.cursor = "auto";
      }}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

const bundles = [
  { position: [-3.2, 0.8, -1] as [number, number, number], rotation: [0.1, 0.5, 0.1] as [number, number, number], scale: 2.5 },
  { position: [3.5, -0.3, -0.5] as [number, number, number], rotation: [-0.1, -0.8, 0.15] as [number, number, number], scale: 2 },
  { position: [0, 1.8, -2] as [number, number, number], rotation: [0.2, 1.2, -0.1] as [number, number, number], scale: 1.8 },
  { position: [-2, -1.5, -1.5] as [number, number, number], rotation: [0, 2.5, 0.2] as [number, number, number], scale: 2.2 },
  { position: [2.5, 1.5, -1.8] as [number, number, number], rotation: [-0.15, -0.3, 0.1] as [number, number, number], scale: 1.6 },
];

function ReadyNotifier({ onReady }: { onReady: () => void }) {
  const called = useRef(false);
  useEffect(() => {
    if (!called.current) {
      called.current = true;
      onReady();
    }
  }, [onReady]);
  return null;
}

function Scene({ onReady }: { onReady: () => void }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1} color="#f59e0b" />

      {bundles.map((b, i) => (
        <DraggableMoneyBundle
          key={i}
          initialPosition={b.position}
          initialRotation={b.rotation}
          scale={b.scale}
        />
      ))}

      <Environment preset="city" />
      <ReadyNotifier onReady={onReady} />
    </>
  );
}

export default function FloatingScene({ onReady }: { onReady?: () => void }) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <Scene onReady={onReady || (() => {})} />
        </Suspense>
      </Canvas>
    </div>
  );
}
