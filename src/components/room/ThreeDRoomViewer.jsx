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

function FurnitureFallbackBox({ item, position, rotation, themeMode }) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[item.width, item.height, item.depth]} />
      <meshStandardMaterial
        color={item.color || "#60a5fa"}
        roughness={themeMode === "dark" ? 0.65 : 0.55}
        metalness={themeMode === "dark" ? 0.12 : 0.08}
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

function FurnitureItem3D({ item, roomWidth, roomLength, themeMode }) {
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
      themeMode={themeMode}
    />
  );
}

function WallSet({ roomWidth, roomLength, roomHeight, wallMode, wallColor, themeMode }) {
  const wallThickness = 0.06;

  if (wallMode === "hidden") {
    return null;
  }

  const resolvedWallColor =
    themeMode === "dark" ? "#334155" : wallColor || "#dbeafe";

  const materialProps =
    wallMode === "transparent"
      ? {
          color: resolvedWallColor,
          transparent: true,
          opacity: themeMode === "dark" ? 0.22 : 0.18,
          roughness: 0.2,
          transmission: 0.06
        }
      : {
          color: resolvedWallColor,
          transparent: false,
          opacity: 1,
          roughness: themeMode === "dark" ? 0.95 : 0.9,
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

function RoomShell({
  roomWidth,
  roomLength,
  roomHeight,
  wallMode,
  wallColor,
  floorColor,
  themeMode
}) {
  const resolvedFloorColor =
    themeMode === "dark" ? "#1e1b18" : floorColor || "#efe7da";

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial
          color={resolvedFloorColor}
          roughness={themeMode === "dark" ? 1 : 0.95}
          metalness={0.02}
        />
      </mesh>

      <lineSegments position={[0, roomHeight, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(roomWidth, 0.001, roomLength)]} />
        <lineBasicMaterial
          color={themeMode === "dark" ? "#475569" : "#cbd5e1"}
          transparent
          opacity={themeMode === "dark" ? 0.3 : 0.25}
        />
      </lineSegments>

      <lineSegments position={[0, 0.01, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(roomWidth, 0.001, roomLength)]} />
        <lineBasicMaterial
          color={themeMode === "dark" ? "#334155" : "#94a3b8"}
          transparent
          opacity={themeMode === "dark" ? 0.28 : 0.22}
        />
      </lineSegments>

      <WallSet
        roomWidth={roomWidth}
        roomLength={roomLength}
        roomHeight={roomHeight}
        wallMode={wallMode}
        wallColor={wallColor}
        themeMode={themeMode}
      />
    </>
  );
}

function RoomScene({ design, wallMode, themeMode }) {
  const roomWidth = Number(design.width) || 6;
  const roomLength = Number(design.length) || 5;
  const roomHeight = Number(design.height) || 3;
  const wallColor = design.wallColor || "#dbeafe";
  const floorColor = design.floorColor || "#efe7da";
  const isDark = themeMode === "dark";

  const sceneBg = isDark ? "#0f172a" : "#eef2f7";
  const gridPrimary = isDark ? "#334155" : "#dbe2ea";
  const gridSecondary = isDark ? "#1e293b" : "#eef2f7";

  return (
    <>
      <color attach="background" args={[sceneBg]} />

      <ambientLight intensity={isDark ? 0.75 : 1.0} />
      <directionalLight
        position={[6, 10, 5]}
        intensity={isDark ? 1.6 : 1.3}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-4, 5, -3]} intensity={isDark ? 0.55 : 0.35} />
      <hemisphereLight args={["#ffffff", isDark ? "#0f172a" : "#cbd5e1", isDark ? 0.75 : 0.6]} />

      <gridHelper args={[24, 24, gridPrimary, gridSecondary]} position={[0, 0.001, 0]} />
      <axesHelper args={[1.4]} position={[0, 0.01, 0]} />

      <RoomShell
        roomWidth={roomWidth}
        roomLength={roomLength}
        roomHeight={roomHeight}
        wallMode={wallMode}
        wallColor={wallColor}
        floorColor={floorColor}
        themeMode={themeMode}
      />

      {design.furniture?.map((item) => (
        <FurnitureItem3D
          key={item.id}
          item={item}
          roomWidth={roomWidth}
          roomLength={roomLength}
          themeMode={themeMode}
        />
      ))}

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={isDark ? 0.28 : 0.2}
        scale={20}
        blur={2}
        far={10}
      />

      <Environment preset={isDark ? "night" : "city"} />
    </>
  );
}

export default function ThreeDRoomViewer({
  design,
  wallMode = "transparent",
  themeMode = "light"
}) {
  const roomWidth = Number(design?.width) || 6;
  const roomLength = Number(design?.length) || 5;
  const roomHeight = Number(design?.height) || 3;
  const isDark = themeMode === "dark";

  const camX = Math.max(roomWidth * 0.9, 5.5);
  const camY = Math.max(roomHeight * 1.7, 4.8);
  const camZ = Math.max(roomLength * 1.1, 6.5);

  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 48px)",
        minHeight: "760px",
        borderRadius: "22px",
        overflow: "hidden",
        border: `1px solid ${isDark ? "#1e293b" : "#dbe2ea"}`,
        background: isDark ? "#0b1120" : "#eef2f7"
      }}
    >
      <Canvas shadows camera={{ position: [camX, camY, camZ], fov: 42 }}>
        <RoomScene design={design} wallMode={wallMode} themeMode={themeMode} />
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