"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float, Environment } from "@react-three/drei";
import { Suspense, useRef, useState, useCallback } from "react";
import * as THREE from "three";

// Preload the model
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
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const offset = useRef(new THREE.Vector3());
  const { camera, gl } = useThree();

  // Clone the scene so each instance is independent
  const clonedScene = scene.clone(true);

  const handlePointerDown = useCallback(
    (e: any) => {
      e.stopPropagation();
      setIsDragging(true);
      gl.domElement.style.cursor = "grabbing";

      // Set up drag plane perpendicular to camera
      const cameraDir = new THREE.Vector3();
      camera.getWorldDirection(cameraDir);
      dragPlane.current.setFromNormalAndCoplanarPoint(
        cameraDir.negate(),
        ref.current!.position
      );

      // Calculate offset
      const intersection = new THREE.Vector3();
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2(
        ((e as unknown as PointerEvent).clientX / gl.domElement.clientWidth) * 2 - 1,
        -((e as unknown as PointerEvent).clientY / gl.domElement.clientHeight) * 2 + 1
      );
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(dragPlane.current, intersection);
      offset.current.copy(ref.current!.position).sub(intersection);

      // Capture pointer
      (e.target as Element)?.setPointerCapture?.((e as unknown as PointerEvent).pointerId);
    },
    [camera, gl]
  );

  const handlePointerMove = useCallback(
    (e: any) => {
      if (!isDragging) return;
      e.stopPropagation();

      const intersection = new THREE.Vector3();
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2(
        ((e as unknown as PointerEvent).clientX / gl.domElement.clientWidth) * 2 - 1,
        -((e as unknown as PointerEvent).clientY / gl.domElement.clientHeight) * 2 + 1
      );
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(dragPlane.current, intersection);

      if (ref.current) {
        ref.current.position.copy(intersection.add(offset.current));
      }
    },
    [isDragging, camera, gl]
  );

  const handlePointerUp = useCallback(
    (e: any) => {
      e.stopPropagation();
      setIsDragging(false);
      gl.domElement.style.cursor = hovered ? "grab" : "auto";
    },
    [gl, hovered]
  );

  useFrame((state) => {
    if (!ref.current || isDragging) return;
    // Gentle idle rotation
    ref.current.rotation.y += 0.003;
    ref.current.position.y =
      initialPosition[1] + Math.sin(state.clock.elapsedTime * 0.8 + initialPosition[0]) * 0.1;
  });

  return (
    <group
      ref={ref}
      position={initialPosition}
      rotation={initialRotation}
      scale={scale}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerOver={() => {
        setHovered(true);
        if (!isDragging) gl.domElement.style.cursor = "grab";
      }}
      onPointerOut={() => {
        setHovered(false);
        if (!isDragging) gl.domElement.style.cursor = "auto";
      }}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

const bundles: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}[] = [
  { position: [-3.2, 0.8, -1], rotation: [0.1, 0.5, 0.1], scale: 2.5 },
  { position: [3.5, -0.3, -0.5], rotation: [-0.1, -0.8, 0.15], scale: 2 },
  { position: [0, 1.8, -2], rotation: [0.2, 1.2, -0.1], scale: 1.8 },
  { position: [-2, -1.5, -1.5], rotation: [0, 2.5, 0.2], scale: 2.2 },
  { position: [2.5, 1.5, -1.8], rotation: [-0.15, -0.3, 0.1], scale: 1.6 },
];

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#f59e0b" />
      <pointLight position={[-10, -5, 5]} intensity={0.6} color="#8b5cf6" />
      <spotLight
        position={[0, 10, 5]}
        intensity={1}
        angle={0.5}
        penumbra={1}
        color="#fbbf24"
      />

      {bundles.map((b, i) => (
        <DraggableMoneyBundle
          key={i}
          initialPosition={b.position}
          initialRotation={b.rotation}
          scale={b.scale}
        />
      ))}

      <Environment preset="city" />
    </>
  );
}

export default function FloatingScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
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
