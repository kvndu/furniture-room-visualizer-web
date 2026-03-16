import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, Environment, useGLTF } from "@react-three/drei";
import { supabase } from "../lib/supabase";
import { MODEL_PATHS } from "../data/modelMap";

const STORAGE_KEY = "draftDesign";

const LIBRARY_SECTIONS = [
  { key: "Kitchens", label: "Kitchens", icon: "🍽️" },
  { key: "Cabinets", label: "Cabinets", icon: "🗄️" },
  { key: "Tables", label: "Tables", icon: "🪵" },
  { key: "Beds", label: "Beds", icon: "🛏️" },
  { key: "Wardrobes", label: "Wardrobes", icon: "🚪" },
  { key: "HomeEquipment", label: "Home Equipment", icon: "🖥️" },
  { key: "Details", label: "Details", icon: "✨" },
  { key: "Other", label: "Other", icon: "◌" }
];

const LIBRARY_ITEMS = {
  Kitchens: [
    { id: "k-1", type: "L Kitchen", width: 2.2, depth: 1.6, height: 0.9, color: "#facc15" },
    { id: "k-2", type: "Straight Kitchen", width: 2.6, depth: 0.7, height: 0.9, color: "#fde68a" },
    { id: "k-3", type: "Island Kitchen", width: 2.4, depth: 1.8, height: 0.9, color: "#fbbf24" }
  ],
  Cabinets: [
    { id: "c-1", type: "Base Cabinet", width: 1.4, depth: 0.6, height: 0.9, color: "#eab308" },
    { id: "c-2", type: "Wall Cabinet", width: 1.2, depth: 0.4, height: 0.8, color: "#f59e0b" },
    { id: "c-3", type: "TV Unit", width: 1.8, depth: 0.45, height: 0.55, color: "#94a3b8" }
  ],
  Tables: [
    { id: "t-1", type: "Dining Table", width: 1.5, depth: 0.9, height: 0.75, color: "#c084fc" },
    { id: "t-2", type: "Coffee Table", width: 1.0, depth: 0.6, height: 0.45, color: "#a78bfa" },
    { id: "t-3", type: "Work Desk", width: 1.4, depth: 0.7, height: 0.75, color: "#818cf8" }
  ],
  Beds: [
    { id: "b-1", type: "Queen Bed", width: 1.8, depth: 2.0, height: 0.65, color: "#60a5fa" },
    { id: "b-2", type: "Single Bed", width: 1.0, depth: 2.0, height: 0.6, color: "#38bdf8" }
  ],
  Wardrobes: [
    { id: "w-1", type: "Wardrobe", width: 1.5, depth: 0.6, height: 2.1, color: "#64748b" },
    { id: "w-2", type: "Sliding Wardrobe", width: 1.9, depth: 0.65, height: 2.2, color: "#475569" }
  ],
  HomeEquipment: [
    { id: "h-1", type: "Office Chair", width: 0.7, depth: 0.7, height: 1.1, color: "#10b981" },
    { id: "h-2", type: "Bookshelf", width: 1.0, depth: 0.35, height: 1.8, color: "#34d399" },
    { id: "h-3", type: "Side Cabinet", width: 1.0, depth: 0.45, height: 0.8, color: "#6ee7b7" }
  ],
  Details: [
    { id: "d-1", type: "Lamp", width: 0.4, depth: 0.4, height: 1.4, color: "#fde047" },
    { id: "d-2", type: "Mirror", width: 0.8, depth: 0.1, height: 1.1, color: "#cbd5e1" },
    { id: "d-3", type: "Plant", width: 0.5, depth: 0.5, height: 0.9, color: "#86efac" }
  ],
  Other: [
    { id: "o-1", type: "Bench", width: 1.1, depth: 0.45, height: 0.5, color: "#8b5cf6" },
    { id: "o-2", type: "Storage Box", width: 0.8, depth: 0.8, height: 0.8, color: "#94a3b8" }
  ]
};

const QUICK_ITEMS = [
  { section: "Beds", type: "Queen Bed" },
  { section: "Beds", type: "Single Bed" },
  { section: "Wardrobes", type: "Wardrobe" },
  { section: "Tables", type: "Dining Table" },
  { section: "Tables", type: "Coffee Table" },
  { section: "HomeEquipment", type: "Office Chair" },
  { section: "Details", type: "Plant" }
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function uid(prefix = "item") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeItem(item) {
  return {
    ...item,
    width: Number(item.width) || 1,
    depth: Number(item.depth) || 1,
    height: Number(item.height) || 1,
    rotation: Number(item.rotation) || 0,
    x: Number(item.x) || 0.5,
    y: Number(item.y) || 0.5
  };
}

function withModelUrl(item) {
  const modelPath = MODEL_PATHS[item.type];
  if (!modelPath) return item;

  const { data } = supabase.storage
    .from("furniture-models")
    .getPublicUrl(modelPath);

  return {
    ...item,
    model_path: modelPath,
    model: data?.publicUrl || ""
  };
}

function MiniModel({ url }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(), [scene]);

  return (
    <Center>
      <primitive object={cloned} />
    </Center>
  );
}

function MiniFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#94a3b8" />
    </mesh>
  );
}

function MiniModelPreview({ modelUrl }) {
  if (!modelUrl) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          placeItems: "center",
          color: "#475569",
          fontSize: "22px",
          fontWeight: 700
        }}
      >
        ▦
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [3.2, 2.4, 3.2], fov: 38 }}>
      <color attach="background" args={["#f8fafc"]} />
      <ambientLight intensity={1.6} />
      <directionalLight position={[4, 5, 4]} intensity={1.8} />
      <directionalLight position={[-3, 4, -2]} intensity={0.9} />
      <Suspense fallback={<MiniFallback />}>
        <Bounds fit clip observe margin={1.35}>
          <MiniModel url={modelUrl} />
        </Bounds>
      </Suspense>
      <Environment preset="apartment" />
    </Canvas>
  );
}

function PreviewCard({ item, onClick, onDragStart, compact = false }) {
  const itemWithModel = withModelUrl(item);

  return (
    <button
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      style={{
        border: "1px solid #dbe2ea",
        background: "#ffffff",
        borderRadius: compact ? "16px" : "14px",
        padding: compact ? "12px" : "10px",
        textAlign: "left",
        cursor: "grab"
      }}
    >
      <div
        style={{
          height: compact ? "70px" : "96px",
          borderRadius: "12px",
          background: "linear-gradient(180deg, #ffffff 0%, #eef2f7 100%)",
          marginBottom: "8px",
          overflow: "hidden",
          border: "1px solid #e2e8f0"
        }}
      >
        <MiniModelPreview modelUrl={itemWithModel.model} />
      </div>

      <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "13px" }}>
        {item.type}
      </div>
    </button>
  );
}

export default function CreateDesign() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [leftTab, setLeftTab] = useState("Library");
  const [activeSection, setActiveSection] = useState("Kitchens");
  const [search, setSearch] = useState("");

  const [roomName, setRoomName] = useState("My Dream Room");
  const [roomWidth, setRoomWidth] = useState(6);
  const [roomLength, setRoomLength] = useState(5);
  const [roomHeight, setRoomHeight] = useState(3);

  const [wallColor, setWallColor] = useState("#dbeafe");
  const [floorColor, setFloorColor] = useState("#efe7da");

  const [placedItems, setPlacedItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isCanvasOver, setIsCanvasOver] = useState(false);

  const activeItems = LIBRARY_ITEMS[activeSection] || [];

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return activeItems;
    return activeItems.filter((item) => item.type.toLowerCase().includes(q));
  }, [activeItems, search]);

  const quickAddItems = useMemo(() => {
    return QUICK_ITEMS.map((entry) =>
      LIBRARY_ITEMS[entry.section]?.find((item) => item.type === entry.type)
    ).filter(Boolean);
  }, []);

  const selectedItem = placedItems.find((item) => item.id === selectedId) || null;

  function saveDraft(items = placedItems) {
    const draft = {
      name: roomName,
      roomType: "Custom",
      width: Number(roomWidth),
      length: Number(roomLength),
      height: Number(roomHeight),
      wallColor,
      floorColor,
      furniture: items.map((item) => ({
        ...item,
        width: Number(item.width),
        depth: Number(item.depth),
        height: Number(item.height),
        x: Number(item.x),
        y: Number(item.y),
        rotation: Number(item.rotation || 0)
      }))
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }

  function addItemAtPosition(item, x, y) {
    const newItem = normalizeItem({
      ...item,
      id: uid("placed"),
      x,
      y,
      rotation: 0
    });

    const next = [...placedItems, newItem];
    setPlacedItems(next);
    setSelectedId(newItem.id);
    saveDraft(next);
  }

  function handleAddItem(item) {
    const itemWithModel = withModelUrl(item);
    addItemAtPosition(itemWithModel, 0.6, 0.6);
  }

  function updatePlacedItem(id, updates) {
    const next = placedItems.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    setPlacedItems(next);
    saveDraft(next);
  }

  function handleDeleteSelected() {
    if (!selectedId) return;
    const next = placedItems.filter((item) => item.id !== selectedId);
    setPlacedItems(next);
    setSelectedId(null);
    saveDraft(next);
  }

  function handlePreview3D() {
    saveDraft();
    navigate("/preview-3d");
  }

  function handleLibraryDragStart(event, item) {
    event.dataTransfer.setData("application/json", JSON.stringify(item));
    event.dataTransfer.effectAllowed = "copy";
  }

  function handleCanvasDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsCanvasOver(true);
  }

  function handleCanvasDragLeave() {
    setIsCanvasOver(false);
  }

  function handleCanvasDrop(event) {
    event.preventDefault();
    setIsCanvasOver(false);

    if (!canvasRef.current) return;

    const raw = event.dataTransfer.getData("application/json");
    if (!raw) return;

    let item;
    try {
      item = JSON.parse(raw);
    } catch {
      return;
    }

    const itemWithModel = withModelUrl(item);

    const rect = canvasRef.current.getBoundingClientRect();
    const pxPerMeterX = rect.width / Number(roomWidth || 1);
    const pxPerMeterY = rect.height / Number(roomLength || 1);

    const x = (event.clientX - rect.left) / pxPerMeterX - Number(item.width || 1) / 2;
    const y = (event.clientY - rect.top) / pxPerMeterY - Number(item.depth || 1) / 2;

    addItemAtPosition(
      itemWithModel,
      Number(clamp(x, 0, Math.max(0, roomWidth - Number(item.width || 1))).toFixed(2)),
      Number(clamp(y, 0, Math.max(0, roomLength - Number(item.depth || 1))).toFixed(2))
    );
  }

  function onCanvasMouseMove(event) {
    if (!draggingId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const pxPerMeterX = rect.width / Number(roomWidth || 1);
    const pxPerMeterY = rect.height / Number(roomLength || 1);

    const rawX = (event.clientX - rect.left - dragOffset.x) / pxPerMeterX;
    const rawY = (event.clientY - rect.top - dragOffset.y) / pxPerMeterY;

    const target = placedItems.find((item) => item.id === draggingId);
    if (!target) return;

    updatePlacedItem(draggingId, {
      x: Number(clamp(rawX, 0, Math.max(0, roomWidth - target.width)).toFixed(2)),
      y: Number(clamp(rawY, 0, Math.max(0, roomLength - target.depth)).toFixed(2))
    });
  }

  function onCanvasMouseUp() {
    setDraggingId(null);
  }

  useEffect(() => {
    window.addEventListener("mouseup", onCanvasMouseUp);
    return () => window.removeEventListener("mouseup", onCanvasMouseUp);
  }, []);

  useEffect(() => {
    saveDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName, roomWidth, roomLength, roomHeight, wallColor, floorColor]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fbff 0%, #f1f5f9 100%)"
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 10px 24px rgba(15, 23, 42, 0.12)"
        }}
      >
        <div
          style={{
            width: "100%",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            boxSizing: "border-box"
          }}
        >
          <div>
            <div style={{ color: "#ffffff", fontSize: "17px", fontWeight: 800 }}>
              Furniture Room Visualizer
            </div>
            <div style={{ color: "rgba(255,255,255,0.78)", fontSize: "12px", marginTop: "2px" }}>
              2D Design Workspace
            </div>
          </div>

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap"
            }}
          >
            <TopNavItem to="/dashboard">Dashboard</TopNavItem>
            <TopNavItem to="/create-design" active>
              Create 2D
            </TopNavItem>
            <TopNavItem to="/portfolio">Portfolio</TopNavItem>
            <button
              onClick={() => navigate("/preview-3d")}
              style={{
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.1)",
                color: "#ffffff",
                padding: "10px 14px",
                borderRadius: "12px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Preview 3D
            </button>
          </nav>
        </div>
      </header>

      <div
        style={{
          padding: "10px",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "245px 1fr 255px",
            gap: "10px",
            alignItems: "start"
          }}
        >
          <aside
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(8px)",
              border: "1px solid #dbe2ea",
              borderRadius: "22px",
              overflow: "hidden",
              minHeight: "calc(100vh - 96px)",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)"
            }}
          >
            <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
              <button
                style={leftTab === "Library" ? sidebarTabActive : sidebarTab}
                onClick={() => setLeftTab("Library")}
              >
                Library
              </button>
              <button
                style={leftTab === "Elements" ? sidebarTabActive : sidebarTab}
                onClick={() => setLeftTab("Elements")}
              >
                Elements
              </button>
            </div>

            {leftTab === "Library" ? (
              <>
                <div style={{ padding: "12px 12px 8px" }}>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search library..."
                    style={inputStyle}
                  />
                </div>

                <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 190px)", paddingBottom: "10px" }}>
                  {LIBRARY_SECTIONS.map((section) => (
                    <button
                      key={section.key}
                      onClick={() => setActiveSection(section.key)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 14px",
                        border: "none",
                        borderBottom: "1px solid #f1f5f9",
                        background: activeSection === section.key ? "#eff6ff" : "transparent",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          display: "grid",
                          placeItems: "center",
                          border: activeSection === section.key ? "1px solid #93c5fd" : "1px solid #dbe2ea",
                          borderRadius: "12px",
                          fontSize: "19px",
                          background: "#ffffff",
                          flexShrink: 0
                        }}
                      >
                        {section.icon}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#0f172a",
                            fontWeight: 700,
                            lineHeight: 1.2
                          }}
                        >
                          {section.label}
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                          Browse items
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ padding: "12px" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", marginBottom: "10px" }}>
                  Placed Elements
                </div>

                {placedItems.length === 0 ? (
                  <div style={emptyCardStyle}>No items placed yet.</div>
                ) : (
                  <div style={{ display: "grid", gap: "8px" }}>
                    {placedItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        style={{
                          border: selectedId === item.id ? "2px solid #2563eb" : "1px solid #dbe2ea",
                          background: selectedId === item.id ? "#eff6ff" : "#ffffff",
                          borderRadius: "12px",
                          padding: "10px",
                          textAlign: "left",
                          cursor: "pointer"
                        }}
                      >
                        <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "13px" }}>{item.type}</div>
                        <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                          {item.width}m × {item.depth}m
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </aside>

          <main
            style={{
              display: "grid",
              gridTemplateRows: "auto auto 1fr",
              gap: "10px",
              minHeight: "calc(100vh - 96px)"
            }}
          >
            <section
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
                color: "#ffffff",
                borderRadius: "22px",
                padding: "16px 18px",
                display: "flex",
                justifyContent: "space-between",
                gap: "14px",
                alignItems: "center",
                boxShadow: "0 12px 30px rgba(37, 99, 235, 0.18)"
              }}
            >
              <div>
                <div style={{ fontSize: "12px", opacity: 0.85, marginBottom: "4px" }}>
                  Design Workspace
                </div>
                <div style={{ fontSize: "24px", fontWeight: 800 }}>{roomName}</div>
                <div style={{ fontSize: "13px", opacity: 0.9, marginTop: "5px" }}>
                  {roomWidth}m × {roomLength}m × {roomHeight}m
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Room name"
                  style={{ ...heroInputStyle, width: "170px" }}
                />
                <input
                  type="number"
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(Number(e.target.value) || 6)}
                  style={{ ...heroInputStyle, width: "68px" }}
                />
                <input
                  type="number"
                  value={roomLength}
                  onChange={(e) => setRoomLength(Number(e.target.value) || 5)}
                  style={{ ...heroInputStyle, width: "68px" }}
                />
                <input
                  type="number"
                  value={roomHeight}
                  onChange={(e) => setRoomHeight(Number(e.target.value) || 3)}
                  style={{ ...heroInputStyle, width: "68px" }}
                />
              </div>
            </section>

            <section
              style={{
                background: "rgba(255,255,255,0.92)",
                border: "1px solid #dbe2ea",
                borderRadius: "22px",
                padding: "14px",
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)"
              }}
            >
              <div style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>
                Quick Add
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, minmax(140px, 1fr))",
                  gap: "10px",
                  overflowX: "auto",
                  paddingBottom: "4px"
                }}
              >
                {quickAddItems.map((item) => (
                  <PreviewCard
                    key={item.id}
                    item={item}
                    compact
                    onClick={() => handleAddItem(item)}
                    onDragStart={(e) => handleLibraryDragStart(e, item)}
                  />
                ))}
              </div>
            </section>

            <section
              style={{
                display: "grid",
                gridTemplateColumns: "290px 1fr",
                gap: "10px",
                minHeight: 0
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.92)",
                  border: "1px solid #dbe2ea",
                  borderRadius: "22px",
                  padding: "14px",
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
                  minHeight: 0
                }}
              >
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a" }}>
                  {LIBRARY_SECTIONS.find((s) => s.key === activeSection)?.label}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", marginBottom: "12px" }}>
                  Drag an item into the room or click to add.
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    maxHeight: "420px",
                    overflowY: "auto",
                    paddingRight: "2px"
                  }}
                >
                  {filteredItems.map((item) => (
                    <PreviewCard
                      key={item.id}
                      item={item}
                      onClick={() => handleAddItem(item)}
                      onDragStart={(e) => handleLibraryDragStart(e, item)}
                    />
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.92)",
                  border: "1px solid #dbe2ea",
                  borderRadius: "22px",
                  padding: "14px",
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
                  display: "grid",
                  gridTemplateRows: "auto 1fr",
                  minHeight: 0
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "10px",
                    marginBottom: "10px"
                  }}
                >
                  <button style={secondaryButtonStyle} onClick={() => navigate("/dashboard")}>
                    Back
                  </button>
                  <button style={secondaryButtonStyle} onClick={() => saveDraft()}>
                    Save Design
                  </button>
                  <button style={primaryButtonStyle} onClick={handlePreview3D}>
                    Preview 3D
                  </button>
                </div>

                <div
                  style={{
                    border: "1px dashed #cbd5e1",
                    borderRadius: "18px",
                    padding: "10px",
                    background: "#f8fbff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 0
                  }}
                >
                  <div
                    ref={canvasRef}
                    onMouseMove={onCanvasMouseMove}
                    onDragOver={handleCanvasDragOver}
                    onDragLeave={handleCanvasDragLeave}
                    onDrop={handleCanvasDrop}
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "520px",
                      aspectRatio: `${roomWidth} / ${roomLength}`,
                      background:
                        "linear-gradient(to right, rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.12) 1px, transparent 1px), #dbeafe",
                      backgroundSize: "40px 40px",
                      border: isCanvasOver ? "3px solid #2563eb" : "3px solid #94a3b8",
                      borderRadius: "16px",
                      position: "relative",
                      overflow: "hidden",
                      transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                      boxShadow: isCanvasOver ? "0 0 0 4px rgba(37,99,235,0.12)" : "none"
                    }}
                  >
                    {placedItems.length === 0 && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "grid",
                          placeItems: "center",
                          color: "#475569",
                          fontWeight: 700,
                          fontSize: "20px",
                          textAlign: "center",
                          padding: "20px"
                        }}
                      >
                        Drag items here or click to add ✨
                      </div>
                    )}

                    {placedItems.map((item) => {
                      const left = `${(item.x / roomWidth) * 100}%`;
                      const top = `${(item.y / roomLength) * 100}%`;
                      const width = `${(item.width / roomWidth) * 100}%`;
                      const height = `${(item.depth / roomLength) * 100}%`;

                      return (
                        <div
                          key={item.id}
                          onMouseDown={(event) => {
                            if (!canvasRef.current) return;
                            const rect = canvasRef.current.getBoundingClientRect();
                            const pxPerMeterX = rect.width / roomWidth;
                            const pxPerMeterY = rect.height / roomLength;

                            setSelectedId(item.id);
                            setDraggingId(item.id);
                            setDragOffset({
                              x: (event.clientX - rect.left) - item.x * pxPerMeterX,
                              y: (event.clientY - rect.top) - item.y * pxPerMeterY
                            });
                          }}
                          style={{
                            position: "absolute",
                            left,
                            top,
                            width,
                            height,
                            border: selectedId === item.id ? "2px solid #1d4ed8" : "1px solid #475569",
                            background: item.color || "#60a5fa",
                            borderRadius: "12px",
                            transform: `rotate(${item.rotation || 0}deg)`,
                            transformOrigin: "center center",
                            boxShadow:
                              selectedId === item.id
                                ? "0 0 0 4px rgba(37,99,235,0.15)"
                                : "0 10px 18px rgba(15, 23, 42, 0.14)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#0f172a",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "move",
                            userSelect: "none",
                            textAlign: "center",
                            padding: "4px",
                            boxSizing: "border-box"
                          }}
                        >
                          {item.type}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </main>

          <aside
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(8px)",
              border: "1px solid #dbe2ea",
              borderRadius: "22px",
              minHeight: "calc(100vh - 96px)",
              padding: "14px",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)"
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>
              Inspector
            </div>

            <div style={{ display: "grid", gap: "10px", marginBottom: "14px" }}>
              <div>
                <label style={labelStyle}>Wall Color</label>
                <input
                  type="color"
                  value={wallColor}
                  onChange={(e) => setWallColor(e.target.value)}
                  style={colorInputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Floor Color</label>
                <input
                  type="color"
                  value={floorColor}
                  onChange={(e) => setFloorColor(e.target.value)}
                  style={colorInputStyle}
                />
              </div>
            </div>

            {!selectedItem ? (
              <div style={emptyCardStyle}>
                Select an item from the canvas to edit it.
              </div>
            ) : (
              <div style={{ display: "grid", gap: "10px" }}>
                <div
                  style={{
                    border: "1px solid #dbe2ea",
                    borderRadius: "16px",
                    padding: "12px",
                    background: "#f8fafc"
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>
                    Selected Item
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>
                    {selectedItem.type}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>X Position</label>
                  <input
                    type="number"
                    step="0.1"
                    value={selectedItem.x}
                    onChange={(e) =>
                      updatePlacedItem(selectedItem.id, {
                        x: Number(
                          clamp(
                            Number(e.target.value) || 0,
                            0,
                            Math.max(0, roomWidth - selectedItem.width)
                          ).toFixed(2)
                        )
                      })
                    }
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Y Position</label>
                  <input
                    type="number"
                    step="0.1"
                    value={selectedItem.y}
                    onChange={(e) =>
                      updatePlacedItem(selectedItem.id, {
                        y: Number(
                          clamp(
                            Number(e.target.value) || 0,
                            0,
                            Math.max(0, roomLength - selectedItem.depth)
                          ).toFixed(2)
                        )
                      })
                    }
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Width</label>
                  <input
                    type="number"
                    step="0.1"
                    value={selectedItem.width}
                    onChange={(e) =>
                      updatePlacedItem(selectedItem.id, {
                        width: Number(clamp(Number(e.target.value) || 0.4, 0.4, 4).toFixed(2))
                      })
                    }
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Depth</label>
                  <input
                    type="number"
                    step="0.1"
                    value={selectedItem.depth}
                    onChange={(e) =>
                      updatePlacedItem(selectedItem.id, {
                        depth: Number(clamp(Number(e.target.value) || 0.4, 0.4, 4).toFixed(2))
                      })
                    }
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Rotation</label>
                  <input
                    type="number"
                    step="90"
                    value={selectedItem.rotation}
                    onChange={(e) =>
                      updatePlacedItem(selectedItem.id, {
                        rotation: Number(e.target.value) || 0
                      })
                    }
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Item Color</label>
                  <input
                    type="color"
                    value={selectedItem.color || "#60a5fa"}
                    onChange={(e) =>
                      updatePlacedItem(selectedItem.id, {
                        color: e.target.value
                      })
                    }
                    style={colorInputStyle}
                  />
                </div>

                <button style={dangerButtonStyle} onClick={handleDeleteSelected}>
                  Remove Selected
                </button>

                <button
                  style={secondaryButtonStyle}
                  onClick={() => {
                    setPlacedItems([]);
                    setSelectedId(null);
                    saveDraft([]);
                  }}
                >
                  Clear Room
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

function TopNavItem({ to, children, active = false }) {
  return (
    <NavLink
      to={to}
      style={{
        textDecoration: "none",
        padding: "10px 14px",
        borderRadius: "12px",
        fontWeight: 700,
        fontSize: "14px",
        color: "#ffffff",
        background: active ? "rgba(255,255,255,0.16)" : "transparent",
        border: active ? "1px solid rgba(255,255,255,0.16)" : "1px solid transparent"
      }}
    >
      {children}
    </NavLink>
  );
}

const inputStyle = {
  width: "100%",
  padding: "11px 13px",
  borderRadius: "13px",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  outline: "none",
  boxSizing: "border-box"
};

const heroInputStyle = {
  padding: "11px 13px",
  borderRadius: "13px",
  border: "1px solid rgba(255,255,255,0.22)",
  background: "rgba(255,255,255,0.12)",
  color: "#ffffff",
  outline: "none",
  boxSizing: "border-box"
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: 700,
  color: "#475569",
  marginBottom: "6px"
};

const colorInputStyle = {
  width: "100%",
  height: "44px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  cursor: "pointer",
  padding: "4px",
  boxSizing: "border-box"
};

const primaryButtonStyle = {
  border: "none",
  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
  color: "#ffffff",
  padding: "12px 16px",
  borderRadius: "14px",
  fontWeight: 800,
  cursor: "pointer"
};

const secondaryButtonStyle = {
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  padding: "12px 16px",
  borderRadius: "14px",
  fontWeight: 800,
  cursor: "pointer"
};

const dangerButtonStyle = {
  border: "1px solid #fecaca",
  background: "#fef2f2",
  color: "#b91c1c",
  padding: "11px 13px",
  borderRadius: "14px",
  fontWeight: 800,
  cursor: "pointer"
};

const sidebarTab = {
  flex: 1,
  border: "none",
  background: "#ffffff",
  color: "#64748b",
  padding: "13px",
  fontWeight: 800,
  cursor: "pointer"
};

const sidebarTabActive = {
  ...sidebarTab,
  color: "#0f172a",
  background: "#f8fafc"
};

const emptyCardStyle = {
  border: "1px dashed #cbd5e1",
  borderRadius: "16px",
  padding: "14px",
  color: "#64748b",
  background: "#f8fafc"
};