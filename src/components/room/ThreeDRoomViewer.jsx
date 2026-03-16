import * as THREE from "three";
import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  useGLTF
} from "@react-three/drei";

function tintMaterial(material, colorValue) {
  if (!material) return material;

  const cloned = material.clone();

  if ("color" in cloned && cloned.color) {
    cloned.color = new THREE.Color(colorValue);
  }

  return cloned;
}

function FurnitureFallbackBox({ item, position, rotation }) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[item.width, item.height, item.depth]} />
      <meshStandardMaterial
        color={item.color || "#60a5fa"}
        roughness={0.55}
        metalness={0.08}
      />
    </mesh>
  );
}

function FurnitureModel({ item, position, rotation }) {
  const { scene } = useGLTF(item.model);

  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true);

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (Array.isArray(child.material)) {
          child.material = child.material.map((mat) =>
            tintMaterial(mat, item.color || "#ffffff")
          );
        } else {
          child.material = tintMaterial(child.material, item.color || "#ffffff");
        }
      }
    });

    return cloned;
  }, [scene, item.color]);

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={1}
    />
  );
}

function FurnitureItem3D({ item, roomWidth, roomLength }) {
  const x = -roomWidth / 2 + item.x + item.width / 2;
  const z = -roomLength / 2 + item.y + item.depth / 2;
  const rotation = [0, ((item.rotation || 0) * Math.PI) / 180, 0];

  if (item.model) {
    return (
      <Suspense fallback={null}>
        <FurnitureModel item={item} position={[x, 0, z]} rotation={rotation} />
      </Suspense>
    );
  }

  return (
    <FurnitureFallbackBox
      item={item}
      position={[x, item.height / 2, z]}
      rotation={rotation}
    />
  );
}

function WallSet({ roomWidth, roomLength, roomHeight, wallMode, wallColor }) {
  const wallThickness = 0.06;

  if (wallMode === "hidden") {
    return null;
  }

  const materialProps =
    wallMode === "transparent"
      ? {
          color: wallColor || "#dbeafe",
          transparent: true,
          opacity: 0.18,
          roughness: 0.18,
          transmission: 0.08
        }
      : {
          color: wallColor || "#dbeafe",
          transparent: false,
          opacity: 1,
          roughness: 0.9,
          transmission: 0
        };

  return (
    <>
      <mesh position={[0, roomHeight / 2, -roomLength / 2]} receiveShadow>
        <boxGeometry args={[roomWidth, roomHeight, wallThickness]} />
        <meshPhysicalMaterial {...materialProps} />
      </mesh>

      <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[wallThickness, roomHeight, roomLength]} />
        <meshPhysicalMaterial {...materialProps} />
      </mesh>

      <mesh position={[roomWidth / 2, roomHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[wallThickness, roomHeight, roomLength]} />
        <meshPhysicalMaterial {...materialProps} />
      </mesh>
    </>
  );
}

function RoomShell({ roomWidth, roomLength, roomHeight, wallMode, wallColor, floorColor }) {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial
          color={floorColor || "#efe7da"}
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>

      <lineSegments position={[0, roomHeight, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(roomWidth, 0.001, roomLength)]} />
        <lineBasicMaterial color="#cbd5e1" transparent opacity={0.25} />
      </lineSegments>

      <lineSegments position={[0, 0.01, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(roomWidth, 0.001, roomLength)]} />
        <lineBasicMaterial color="#94a3b8" transparent opacity={0.22} />
      </lineSegments>

      <WallSet
        roomWidth={roomWidth}
        roomLength={roomLength}
        roomHeight={roomHeight}
        wallMode={wallMode}
        wallColor={wallColor}
      />
    </>
  );
}

function RoomScene({ design, wallMode }) {
  const roomWidth = Number(design.width) || 6;
  const roomLength = Number(design.length) || 5;
  const roomHeight = Number(design.height) || 3;
  const wallColor = design.wallColor || "#dbeafe";
  const floorColor = design.floorColor || "#efe7da";

  return (
    <>
      <color attach="background" args={["#eef2f7"]} />

      <ambientLight intensity={1.0} />
      <directionalLight
        position={[6, 10, 5]}
        intensity={1.3}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-4, 5, -3]} intensity={0.35} />
      <hemisphereLight args={["#ffffff", "#cbd5e1", 0.6]} />

      <gridHelper args={[24, 24, "#dbe2ea", "#eef2f7"]} position={[0, 0.001, 0]} />
      <axesHelper args={[1.4]} position={[0, 0.01, 0]} />

      <RoomShell
        roomWidth={roomWidth}
        roomLength={roomLength}
        roomHeight={roomHeight}
        wallMode={wallMode}
        wallColor={wallColor}
        floorColor={floorColor}
      />

      {design.furniture?.map((item) => (
        <FurnitureItem3D
          key={item.id}
          item={item}
          roomWidth={roomWidth}
          roomLength={roomLength}
        />
      ))}

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.2}
        scale={20}
        blur={2}
        far={10}
      />

      <Environment preset="city" />
    </>
  );
}

export default function ThreeDRoomViewer({ design, wallMode = "transparent" }) {
  const roomWidth = Number(design?.width) || 6;
  const roomLength = Number(design?.length) || 5;
  const roomHeight = Number(design?.height) || 3;

  const camX = Math.max(roomWidth * 0.9, 5.5);
  const camY = Math.max(roomHeight * 1.7, 4.8);
  const camZ = Math.max(roomLength * 1.1, 6.5);

  return (
    <div
      style={{
        width: "100%",
        height: "760px",
        borderRadius: "22px",
        overflow: "hidden",
        border: "1px solid #dbe2ea",
        background: "#eef2f7"
      }}
    >
      <Canvas shadows camera={{ position: [camX, camY, camZ], fov: 42 }}>
        <RoomScene design={design} wallMode={wallMode} />
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          maxPolarAngle={Math.PI / 2.05}
          minDistance={3}
          maxDistance={20}
          target={[0, 0.8, 0]}
        />
      </Canvas>
    </div>
  );
}