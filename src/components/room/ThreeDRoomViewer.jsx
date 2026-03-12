import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

function normalizeFurnitureType(type = "") {
  return String(type).toLowerCase().replace(/\s+/g, "");
}

function FittedModel({ modelPath, item, roomWidth, roomLength }) {
  const gltf = useGLTF(modelPath);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  const itemWidth = Number(item.width) || 1;
  const itemDepth = Number(item.depth) || Number(item.length) || 1;
  const itemHeight = Number(item.height) || 1;

  const box = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3();
  box.getSize(size);

  const scaleFactor = Math.min(
    itemWidth / size.x,
    itemHeight / size.y,
    itemDepth / size.z
  );

  const x = -roomWidth / 2 + (Number(item.x) || 0) + itemWidth / 2;
  const z = -roomLength / 2 + (Number(item.y) || 0) + itemDepth / 2;

  return (
    <group
      position={[x, 0.25, z]}
      rotation={[0, ((item.rotation || 0) * Math.PI) / 180, 0]}
    >
      <Center bottom>
        <primitive object={scene} scale={scaleFactor} />
      </Center>
    </group>
  );
}

function FurnitureFallback({ item, roomWidth, roomLength }) {
  const itemWidth = Number(item.width) || 1;
  const itemDepth = Number(item.depth) || Number(item.length) || 1;
  const itemHeight = Number(item.height) || 1;

  const x = -roomWidth / 2 + (Number(item.x) || 0) + itemWidth / 2;
  const z = -roomLength / 2 + (Number(item.y) || 0) + itemDepth / 2;
  const y = itemHeight / 2;

  return (
    <mesh
      position={[x, y, z]}
      rotation={[0, ((item.rotation || 0) * Math.PI) / 180, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[itemWidth, itemHeight, itemDepth]} />
      <meshStandardMaterial color={item.color || "#60a5fa"} />
    </mesh>
  );
}

function RoomScene({ design, furnitureModelMap = {} }) {
  const roomWidth = Number(design.width) || 6;
  const roomLength = Number(design.length) || 5;
  const roomHeight = Number(design.height) || 3;
  const wallColor = design.wallColor || "#dbeafe";
  const floorColor = design.floorColor || "#d6c3a5";

  const wallThickness = 0.08;

  return (
    <>
      <ambientLight intensity={1.0} />
      <directionalLight position={[6, 8, 4]} intensity={1.6} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.5} />

      <gridHelper args={[20, 20, "#b0b0b0", "#d0d0d0"]} position={[0, 0.001, 0]} />
      <axesHelper args={[2]} position={[0, 0.01, 0]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>

      <mesh position={[0, roomHeight / 2, -roomLength / 2]}>
        <boxGeometry args={[roomWidth, roomHeight, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      <mesh position={[0, roomHeight / 2, roomLength / 2]}>
        <boxGeometry args={[roomWidth, roomHeight, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      <mesh position={[-roomWidth / 2, roomHeight / 2, 0]}>
        <boxGeometry args={[wallThickness, roomHeight, roomLength]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      <mesh position={[roomWidth / 2, roomHeight / 2, 0]}>
        <boxGeometry args={[wallThickness, roomHeight, roomLength]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {design.furniture?.map((item) => {
        const normalizedType = normalizeFurnitureType(item.type);
        const modelPath = furnitureModelMap[normalizedType];

        if (modelPath) {
          return (
            <Suspense
              key={item.id}
              fallback={
                <FurnitureFallback
                  item={item}
                  roomWidth={roomWidth}
                  roomLength={roomLength}
                />
              }
            >
              <FittedModel
                modelPath={modelPath}
                item={item}
                roomWidth={roomWidth}
                roomLength={roomLength}
              />
            </Suspense>
          );
        }

        return (
          <FurnitureFallback
            key={item.id}
            item={item}
            roomWidth={roomWidth}
            roomLength={roomLength}
          />
        );
      })}
    </>
  );
}

export default function ThreeDRoomViewer({ design, furnitureModelMap = {} }) {
  return (
    <div
      style={{
        width: "100%",
        height: "600px",
        borderRadius: "18px",
        overflow: "hidden",
        border: "1px solid #cbd5e1",
        background: "#d9d9d9"
      }}
    >
      <Canvas camera={{ position: [6, 5, 7], fov: 50 }} shadows>
        <RoomScene design={design} furnitureModelMap={furnitureModelMap} />
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
}