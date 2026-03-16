import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, Environment, useGLTF } from "@react-three/drei";

function Model({ url }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(), [scene]);

  return (
    <Center>
      <primitive object={cloned} />
    </Center>
  );
}

function FallbackBox() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#cbd5e1" />
    </mesh>
  );
}

export default function MiniModelPreview({ modelUrl }) {
  if (!modelUrl) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          placeItems: "center",
          color: "#64748b",
          fontSize: "22px"
        }}
      >
        ▦
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [2.5, 2, 2.5], fov: 45 }}>
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 3]} intensity={1.2} />
      <Suspense fallback={<FallbackBox />}>
        <Bounds fit clip observe margin={1.2}>
          <Model url={modelUrl} />
        </Bounds>
      </Suspense>
      <Environment preset="city" />
    </Canvas>
  );
}