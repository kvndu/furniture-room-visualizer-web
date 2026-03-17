import * as THREE from "three";
import { Suspense, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { getFloorPresetById } from "../../data/floorPresets";
import { supabase } from "../../lib/supabase";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getModelUrl(path) {
  if (!path) return null;
  const { data } = supabase.storage.from("furniture-models").getPublicUrl(path);
  return data?.publicUrl || null;
}

function FurnitureFallbackBox({ item, position, rotation, themeMode }) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[item.width, item.height, item.depth]} />
      <meshStandardMaterial
        color={item.color || "#60a5fa"}
        roughness={themeMode === "dark" ? 0.68 : 0.56}
        metalness={0.08}
      />
    </mesh>
  );
}

function FurnitureModel({ item, position, rotation }) {
  const modelUrl = useMemo(() => getModelUrl(item.model), [item.model]);
  const { scene } = useGLTF(modelUrl || "/dummy.glb", true);

  const preparedScene = useMemo(() => {
    if (!scene) return null;

    const cloned = scene.clone(true);

    const originalBox = new THREE.Box3().setFromObject(cloned);
    const originalSize = new THREE.Vector3();
    const originalCenter = new THREE.Vector3();

    originalBox.getSize(originalSize);
    originalBox.getCenter(originalCenter);

    cloned.position.sub(originalCenter);

    const maxX = Math.max(originalSize.x || 1, 0.001);
    const maxY = Math.max(originalSize.y || 1, 0.001);
    const maxZ = Math.max(originalSize.z || 1, 0.001);

    const targetX = Math.max(item.width || 1, 0.001);
    const targetY = Math.max(item.height || 1, 0.001);
    const targetZ = Math.max(item.depth || 1, 0.001);

    const scaleX = targetX / maxX;
    const scaleY = targetY / maxY;
    const scaleZ = targetZ / maxZ;
    const uniformScale = Math.min(scaleX, scaleY, scaleZ);

    cloned.scale.setScalar(uniformScale);

    const finalBox = new THREE.Box3().setFromObject(cloned);
    const finalCenter = new THREE.Vector3();
    finalBox.getCenter(finalCenter);

    cloned.position.x -= finalCenter.x;
    cloned.position.z -= finalCenter.z;
    cloned.position.y -= finalBox.min.y;

    cloned.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material) {
        child.material = child.material.clone();
        child.material.needsUpdate = true;
      }
    });

    return cloned;
  }, [scene, item.width, item.height, item.depth]);

  if (!modelUrl || !preparedScene) {
    return null;
  }

  return <primitive object={preparedScene} position={position} rotation={rotation} />;
}

function FurnitureItem3D({ item, roomWidth, roomLength, themeMode }) {
  const safeWidth = Number(item.width) || 1;
  const safeDepth = Number(item.depth) || 1;
  const safeHeight = Number(item.height) || 1;

  const clampedX = clamp(Number(item.x) || 0, 0, Math.max(0, roomWidth - safeWidth));
  const clampedY = clamp(Number(item.y) || 0, 0, Math.max(0, roomLength - safeDepth));

  const x = -roomWidth / 2 + clampedX + safeWidth / 2;
  const z = -roomLength / 2 + clampedY + safeDepth / 2;

  const rotation = [0, ((item.rotation || 0) * Math.PI) / 180, 0];

  if (item.model) {
    return (
      <Suspense
        fallback={
          <FurnitureFallbackBox
            item={item}
            position={[x, safeHeight / 2, z]}
            rotation={rotation}
            themeMode={themeMode}
          />
        }
      >
        <FurnitureModel item={item} position={[x, 0, z]} rotation={rotation} />
      </Suspense>
    );
  }

  return (
    <FurnitureFallbackBox
      item={item}
      position={[x, safeHeight / 2, z]}
      rotation={rotation}
      themeMode={themeMode}
    />
  );
}

function TileFloor({ roomWidth, roomLength, floorTextureId, themeMode }) {
  const preset = getFloorPresetById(floorTextureId);
  const texture = useTexture(preset.texture);
  const { gl } = useThree();

  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(roomWidth / preset.repeatX, roomLength / preset.repeatY);
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture, roomWidth, roomLength, gl, preset]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[roomWidth, roomLength]} />
      <meshStandardMaterial
        map={texture}
        color={themeMode === "dark" ? "#d7d1c8" : "#ffffff"}
        roughness={0.92}
        metalness={0.02}
      />
    </mesh>
  );
}

function WallSet({ roomWidth, roomLength, roomHeight, wallMode, wallColor, themeMode }) {
  const wallThickness = 0.06;

  if (wallMode === "hidden") return null;

  const resolvedWallColor = themeMode === "dark" ? "#2a3446" : wallColor || "#eef2f7";

  const materialProps =
    wallMode === "transparent"
      ? {
          color: resolvedWallColor,
          transparent: true,
          opacity: themeMode === "dark" ? 0.18 : 0.14,
          roughness: 0.35,
          metalness: 0.02
        }
      : {
          color: resolvedWallColor,
          transparent: false,
          opacity: 1,
          roughness: 0.96,
          metalness: 0.01
        };

  return (
    <>
      <mesh position={[0, roomHeight / 2, -roomLength / 2]} receiveShadow castShadow>
        <boxGeometry args={[roomWidth, roomHeight, wallThickness]} />
        <meshPhysicalMaterial {...materialProps} />
      </mesh>

      <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[wallThickness, roomHeight, roomLength]} />
        <meshPhysicalMaterial {...materialProps} />
      </mesh>

      <mesh position={[roomWidth / 2, roomHeight / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[wallThickness, roomHeight, roomLength]} />
        <meshPhysicalMaterial {...materialProps} />
      </mesh>
    </>
  );
}

function RoomScene({ design, wallMode, themeMode }) {
  const roomWidth = Number(design?.width) || 6;
  const roomLength = Number(design?.length) || 5;
  const roomHeight = Number(design?.height) || 3;
  const wallColor = design?.wallColor || "#dbeafe";
  const floorTextureId = design?.floorTexture || "tiles-beige";
  const furniture = Array.isArray(design?.furniture) ? design.furniture : [];
  const isDark = themeMode === "dark";

  const sceneBg = isDark ? "#182235" : "#edf2f7";

  return (
    <>
      <color attach="background" args={[sceneBg]} />

      <ambientLight intensity={0.9} />
      <hemisphereLight args={["#ffffff", "#a8b3c2", 1.05]} />
      <directionalLight
        position={[10, 14, 10]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-5, 4, -5]} intensity={0.35} />

      <TileFloor
        roomWidth={roomWidth}
        roomLength={roomLength}
        floorTextureId={floorTextureId}
        themeMode={themeMode}
      />

      <WallSet
        roomWidth={roomWidth}
        roomLength={roomLength}
        roomHeight={roomHeight}
        wallMode={wallMode}
        wallColor={wallColor}
        themeMode={themeMode}
      />

      {furniture.map((item) => (
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
        opacity={isDark ? 0.34 : 0.24}
        scale={26}
        blur={2.8}
        far={12}
      />

      <Environment preset={isDark ? "night" : "apartment"} />
    </>
  );
}

export default function ThreeDRoomViewer({
  design,
  wallMode = "solid",
  themeMode = "light"
}) {
  const roomWidth = Number(design?.width) || 6;
  const roomLength = Number(design?.length) || 5;
  const roomHeight = Number(design?.height) || 3;
  const isDark = themeMode === "dark";

  const camX = Math.max(roomWidth * 1.05, 7.5);
  const camY = Math.max(roomHeight * 1.85, 5.8);
  const camZ = Math.max(roomLength * 1.25, 7.8);

  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 48px)",
        minHeight: "760px",
        borderRadius: "22px",
        overflow: "hidden",
        border: `1px solid ${isDark ? "#1e293b" : "#dbe2ea"}`,
        background: isDark ? "#141d2c" : "#edf2f7"
      }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [camX, camY, camZ], fov: 32 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <RoomScene design={design} wallMode={wallMode} themeMode={themeMode} />
        <OrbitControls
        enablePan={false}
        enableZoom
        enableRotate
        enableDamping
        dampingFactor={0.05}
        minDistance={7}
        maxDistance={20}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        minAzimuthAngle={-Infinity}
        maxAzimuthAngle={Infinity}
        target={[0, 0.9, 0]}
      />
      </Canvas>
    </div>
  );
}