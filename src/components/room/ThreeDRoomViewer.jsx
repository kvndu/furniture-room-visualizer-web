import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function RoomScene({ design }) {
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

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>

      <mesh position={[0, roomHeight / 2, -roomLength / 2]} castShadow receiveShadow>
        <boxGeometry args={[roomWidth, roomHeight, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      <mesh position={[0, roomHeight / 2, roomLength / 2]} castShadow receiveShadow>
        <boxGeometry args={[roomWidth, roomHeight, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThickness, roomHeight, roomLength]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      <mesh position={[roomWidth / 2, roomHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThickness, roomHeight, roomLength]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {design.furniture?.map((item) => {
        const x = -roomWidth / 2 + item.x + item.width / 2;
        const z = -roomLength / 2 + item.y + item.depth / 2;
        const y = item.height / 2;

        return (
          <mesh
            key={item.id}
            position={[x, y, z]}
            rotation={[0, ((item.rotation || 0) * Math.PI) / 180, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[item.width, item.height, item.depth]} />
            <meshStandardMaterial color={item.color || "#60a5fa"} />
          </mesh>
        );
      })}
    </>
  );
}

export default function ThreeDRoomViewer({ design }) {
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
        <RoomScene design={design} />
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
}