import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { FLOOR_PRESETS } from "../data/floorPresets";
import { withModel } from "../data/modelMap";
import { supabase } from "../lib/supabase";

const STORAGE_KEY = "draftDesign";
const SAVED_DESIGNS_KEY = "savedDesigns";

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
    withModel("L Kitchen", {
      id: "k-1",
      type: "L Kitchen",
      width: 2.2,
      depth: 1.6,
      height: 0.9,
      color: "#facc15"
    }),
    withModel("Straight Kitchen", {
      id: "k-2",
      type: "Straight Kitchen",
      width: 2.6,
      depth: 0.7,
      height: 0.9,
      color: "#fde68a"
    }),
    withModel("Island Kitchen", {
      id: "k-3",
      type: "Island Kitchen",
      width: 2.4,
      depth: 1.8,
      height: 0.9,
      color: "#fbbf24"
    })
  ],
  Cabinets: [
    withModel("Base Cabinet", {
      id: "c-1",
      type: "Base Cabinet",
      width: 1.4,
      depth: 0.6,
      height: 0.9,
      color: "#eab308"
    }),
    withModel("Wall Cabinet", {
      id: "c-2",
      type: "Wall Cabinet",
      width: 1.2,
      depth: 0.4,
      height: 0.8,
      color: "#f59e0b"
    }),
    withModel("TV Unit", {
      id: "c-3",
      type: "TV Unit",
      width: 1.8,
      depth: 0.45,
      height: 0.55,
      color: "#94a3b8"
    })
  ],
  Tables: [
    withModel("Dining Table", {
      id: "t-1",
      type: "Dining Table",
      width: 1.5,
      depth: 0.9,
      height: 0.75,
      color: "#c084fc"
    }),
    withModel("Coffee Table", {
      id: "t-2",
      type: "Coffee Table",
      width: 1.0,
      depth: 0.6,
      height: 0.45,
      color: "#a78bfa"
    }),
    withModel("Work Desk", {
      id: "t-3",
      type: "Work Desk",
      width: 1.4,
      depth: 0.7,
      height: 0.75,
      color: "#818cf8"
    })
  ],
  Beds: [
    withModel("Queen Bed", {
      id: "b-1",
      type: "Queen Bed",
      width: 1.8,
      depth: 2.0,
      height: 0.65,
      color: "#60a5fa"
    }),
    withModel("Single Bed", {
      id: "b-2",
      type: "Single Bed",
      width: 1.0,
      depth: 2.0,
      height: 0.6,
      color: "#38bdf8"
    })
  ],
  Wardrobes: [
    withModel("Wardrobe", {
      id: "w-1",
      type: "Wardrobe",
      width: 1.5,
      depth: 0.6,
      height: 2.1,
      color: "#64748b"
    }),
    withModel("Sliding Wardrobe", {
      id: "w-2",
      type: "Sliding Wardrobe",
      width: 1.9,
      depth: 0.65,
      height: 2.2,
      color: "#475569"
    })
  ],
  HomeEquipment: [
    withModel("Office Chair", {
      id: "h-1",
      type: "Office Chair",
      width: 0.7,
      depth: 0.7,
      height: 1.1,
      color: "#10b981"
    }),
    withModel("Bookshelf", {
      id: "h-2",
      type: "Bookshelf",
      width: 1.0,
      depth: 0.35,
      height: 1.8,
      color: "#34d399"
    }),
    withModel("Side Cabinet", {
      id: "h-3",
      type: "Side Cabinet",
      width: 1.0,
      depth: 0.45,
      height: 0.8,
      color: "#6ee7b7"
    })
  ],
  Details: [
    withModel("Lamp", {
      id: "d-1",
      type: "Lamp",
      width: 0.4,
      depth: 0.4,
      height: 1.4,
      color: "#fde047"
    }),
    withModel("Mirror", {
      id: "d-2",
      type: "Mirror",
      width: 0.8,
      depth: 0.1,
      height: 1.1,
      color: "#cbd5e1"
    }),
    withModel("Plant", {
      id: "d-3",
      type: "Plant",
      width: 0.5,
      depth: 0.5,
      height: 0.9,
      color: "#86efac"
    })
  ],
  Other: [
    withModel("Bench", {
      id: "o-1",
      type: "Bench",
      width: 1.1,
      depth: 0.45,
      height: 0.5,
      color: "#8b5cf6"
    }),
    withModel("Storage Box", {
      id: "o-2",
      type: "Storage Box",
      width: 0.8,
      depth: 0.8,
      height: 0.8,
      color: "#94a3b8"
    })
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

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return v ?? fallback;
  } catch {
    return fallback;
  }
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

function getModelUrl(path) {
  if (!path) return null;
  const { data } = supabase.storage.from("furniture-models").getPublicUrl(path);
  return data?.publicUrl || null;
}

function MiniPreviewFallback() {
  return (
    <mesh rotation={[0.18, 0.65, 0]}>
      <boxGeometry args={[1.1, 1.1, 1.1]} />
      <meshStandardMaterial color="#dbe2ea" roughness={0.85} />
    </mesh>
  );
}

function MiniPreviewModel({ modelPath }) {
  const modelUrl = useMemo(() => getModelUrl(modelPath), [modelPath]);
  const { scene } = useGLTF(modelUrl || "/dummy.glb", true);

  const prepared = useMemo(() => {
    if (!scene || !modelUrl) return null;

    const cloned = scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    cloned.position.sub(center);

    const maxAxis = Math.max(size.x || 1, size.y || 1, size.z || 1);
    const scale = 1.5 / maxAxis;
    cloned.scale.setScalar(scale);

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
      }
    });

    return cloned;
  }, [scene, modelUrl]);

  if (!prepared) return <MiniPreviewFallback />;
  return <primitive object={prepared} />;
}

function MiniPreviewScene({ item }) {
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 5]} intensity={1.8} />
      <directionalLight position={[-3, 2, -3]} intensity={0.6} />

      <Suspense fallback={<MiniPreviewFallback />}>
        {item.model ? <MiniPreviewModel modelPath={item.model} /> : <MiniPreviewFallback />}
      </Suspense>

      <Environment preset="studio" />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1.2}
        minPolarAngle={Math.PI / 2.32}
        maxPolarAngle={Math.PI / 2.32}
      />
    </>
  );
}

function MiniModelCard({ item, height = 56 }) {
  return (
    <div
      style={{
        height,
        borderRadius: "12px",
        background: "#ffffff",
        overflow: "hidden"
      }}
    >
      <Canvas
        dpr={[1, 1.4]}
        camera={{ position: [2.2, 1.7, 2.3], fov: 28 }}
        gl={{ antialias: true, alpha: true }}
      >
        <MiniPreviewScene item={item} />
      </Canvas>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: "86px",
        right: "18px",
        zIndex: 100,
        padding: "12px 14px",
        borderRadius: "14px",
        border: `1px solid ${toast.type === "error" ? "#fecaca" : "#bfdbfe"}`,
        background: toast.type === "error" ? "#fef2f2" : "#eff6ff",
        color: toast.type === "error" ? "#991b1b" : "#1d4ed8",
        fontWeight: 800,
        boxShadow: "0 18px 32px rgba(15,23,42,0.12)"
      }}
    >
      {toast.message}
    </div>
  );
}

export default function CreateDesign() {
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef(null);
  const hydratedRef = useRef(false);
  const saveTimerRef = useRef(null);

  const [editingMeta, setEditingMeta] = useState({ id: null, createdAt: null });
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [toast, setToast] = useState(null);
  const [pendingRestoreDraft, setPendingRestoreDraft] = useState(null);

  const [leftTab, setLeftTab] = useState("Library");
  const [activeSection, setActiveSection] = useState("Kitchens");
  const [search, setSearch] = useState("");

  const [roomName, setRoomName] = useState("My Dream Room");
  const [roomWidth, setRoomWidth] = useState(6);
  const [roomLength, setRoomLength] = useState(5);
  const [roomHeight, setRoomHeight] = useState(3);

  const [wallColor, setWallColor] = useState("#dbeafe");
  const [floorColor, setFloorColor] = useState("#efe7da");
  const [floorPresetId, setFloorPresetId] = useState("tiles-beige");

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
  const selectedFloor = FLOOR_PRESETS.find((floor) => floor.id === floorPresetId) || FLOOR_PRESETS[0];

  const isEditMode = Boolean(editingMeta.id);

  function showToast(message, type = "success") {
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    setToast({ message, type });
    saveTimerRef.current = window.setTimeout(() => setToast(null), 2200);
  }

  function captureEditorState(items = placedItems) {
    return {
      name: roomName,
      width: roomWidth,
      length: roomLength,
      height: roomHeight,
      wallColor,
      floorColor,
      floorTexture: floorPresetId,
      furniture: items.map((item) => ({ ...item }))
    };
  }

  function restoreEditorState(snapshot) {
    if (!snapshot) return;
    setRoomName(snapshot.name || "My Dream Room");
    setRoomWidth(Number(snapshot.width) || 6);
    setRoomLength(Number(snapshot.length) || 5);
    setRoomHeight(Number(snapshot.height) || 3);
    setWallColor(snapshot.wallColor || "#dbeafe");
    setFloorColor(snapshot.floorColor || "#efe7da");
    setFloorPresetId(snapshot.floorTexture || "tiles-beige");
    setPlacedItems(Array.isArray(snapshot.furniture) ? snapshot.furniture.map(normalizeItem) : []);
    setSelectedId(null);
  }

  function pushHistory(snapshot = captureEditorState()) {
    setHistory((prev) => [...prev.slice(-19), JSON.parse(JSON.stringify(snapshot))]);
    setFuture([]);
  }

  function buildDraft(items = placedItems, overrides = {}) {
    return {
      id: overrides.id ?? editingMeta.id ?? null,
      name: overrides.name ?? roomName,
      roomType: overrides.roomType ?? "Custom",
      width: Number(overrides.width ?? roomWidth),
      length: Number(overrides.length ?? roomLength),
      height: Number(overrides.height ?? roomHeight),
      wallColor: overrides.wallColor ?? wallColor,
      floorColor: overrides.floorColor ?? floorColor,
      floorTexture: overrides.floorTexture ?? floorPresetId,
      createdAt: overrides.createdAt ?? editingMeta.createdAt ?? null,
      updatedAt: overrides.updatedAt ?? null,
      savedAt: overrides.savedAt ?? null,
      furniture: items.map((item) => ({
        ...item,
        width: Number(item.width),
        depth: Number(item.depth),
        height: Number(item.height),
        x: Number(item.x),
        y: Number(item.y),
        rotation: Number(item.rotation || 0),
        model: item.model || null
      }))
    };
  }

  function saveDraft(items = placedItems, overrides = {}) {
    if (!hydratedRef.current) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        buildDraft(items, {
          id: editingMeta.id,
          createdAt: editingMeta.createdAt,
          updatedAt: new Date().toISOString(),
          ...overrides
        })
      )
    );
  }

  function handleSaveDesign() {
    const existing = safeParse(localStorage.getItem(SAVED_DESIGNS_KEY), []);
    const list = Array.isArray(existing) ? existing : [];
    const now = new Date().toISOString();

    const designToSave = buildDraft(placedItems, {
      id: editingMeta.id || uid("design"),
      createdAt: editingMeta.createdAt || now,
      updatedAt: now,
      savedAt: now
    });

    const alreadyExists = list.some((item) => String(item?.id) === String(designToSave.id));
    const nextList = alreadyExists
      ? list.map((item) => (String(item?.id) === String(designToSave.id) ? { ...item, ...designToSave } : item))
      : [designToSave, ...list];

    localStorage.setItem(SAVED_DESIGNS_KEY, JSON.stringify(nextList));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designToSave));
    setEditingMeta({ id: designToSave.id, createdAt: designToSave.createdAt });
    showToast(alreadyExists ? `Design updated: ${designToSave.name}` : `Design saved: ${designToSave.name}`);
  }

  function addItemAtPosition(item, x, y) {
    pushHistory();
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
    addItemAtPosition(item, 0.6, 0.6);
  }

  function updatePlacedItem(id, updates, trackHistory = false) {
    if (trackHistory) pushHistory();
    const next = placedItems.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    setPlacedItems(next);
    saveDraft(next);
  }

  function handleDeleteSelected() {
    if (!selectedId) {
      showToast("Please select an item first", "error");
      return;
    }
    pushHistory();
    const next = placedItems.filter((item) => item.id !== selectedId);
    setPlacedItems(next);
    setSelectedId(null);
    saveDraft(next);
  }

  function handlePreview3D() {
    const draft = buildDraft(placedItems, {
      id: editingMeta.id,
      createdAt: editingMeta.createdAt,
      updatedAt: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    navigate("/preview-3d", { state: { design: draft } });
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

    const rect = canvasRef.current.getBoundingClientRect();
    const pxPerMeterX = rect.width / Number(roomWidth || 1);
    const pxPerMeterY = rect.height / Number(roomLength || 1);

    const x = (event.clientX - rect.left) / pxPerMeterX - Number(item.width || 1) / 2;
    const y = (event.clientY - rect.top) / pxPerMeterY - Number(item.depth || 1) / 2;

    addItemAtPosition(
      item,
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

    updatePlacedItem(
      draggingId,
      {
        x: Number(clamp(rawX, 0, Math.max(0, roomWidth - target.width)).toFixed(2)),
        y: Number(clamp(rawY, 0, Math.max(0, roomLength - target.depth)).toFixed(2))
      },
      false
    );
  }

  function onCanvasMouseUp() {
    setDraggingId(null);
  }

  function handleUndo() {
    if (!history.length) return;
    const previous = history[history.length - 1];
    setFuture((prev) => [captureEditorState(), ...prev]);
    restoreEditorState(previous);
    setHistory((prev) => prev.slice(0, -1));
    showToast("Change undone");
  }

  function handleRedo() {
    if (!future.length) return;
    const nextSnapshot = future[0];
    setHistory((prev) => [...prev.slice(-19), captureEditorState()]);
    restoreEditorState(nextSnapshot);
    setFuture((prev) => prev.slice(1));
    showToast("Change restored");
  }

  function hydrateFromDraft(draft) {
    setRoomName(draft.name || "My Dream Room");
    setRoomWidth(Number(draft.width) || 6);
    setRoomLength(Number(draft.length) || 5);
    setRoomHeight(Number(draft.height) || 3);
    setWallColor(draft.wallColor || "#dbeafe");
    setFloorColor(draft.floorColor || "#efe7da");
    setFloorPresetId(draft.floorTexture || "tiles-beige");
    setPlacedItems(Array.isArray(draft.furniture) ? draft.furniture.map(normalizeItem) : []);
    setSelectedId(null);
    setEditingMeta({ id: draft.id || null, createdAt: draft.createdAt || null });
    setHistory([]);
    setFuture([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }

  function handleRestoreDraft() {
    if (!pendingRestoreDraft) return;
    hydrateFromDraft(pendingRestoreDraft);
    setPendingRestoreDraft(null);
    showToast("Previous draft restored");
  }

  function handleDiscardDraft() {
    localStorage.removeItem(STORAGE_KEY);
    setPendingRestoreDraft(null);
    setEditingMeta({ id: null, createdAt: null });
    setPlacedItems([]);
    setSelectedId(null);
    showToast("Draft cleared");
  }

  useEffect(() => {
    window.addEventListener("mouseup", onCanvasMouseUp);
    return () => window.removeEventListener("mouseup", onCanvasMouseUp);
  }, []);

  useEffect(() => {
    const draftFromState = location.state?.design;
    const raw = localStorage.getItem(STORAGE_KEY);
    const storedDraft = raw ? safeParse(raw, null) : null;

    if (draftFromState && typeof draftFromState === "object") {
      hydrateFromDraft(draftFromState);
      setPendingRestoreDraft(null);
      hydratedRef.current = true;
      return;
    }

    if (storedDraft && typeof storedDraft === "object") {
      setPendingRestoreDraft(storedDraft);
      hydratedRef.current = true;
      return;
    }

    hydratedRef.current = true;
  }, [location.state]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    saveDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName, roomWidth, roomLength, roomHeight, wallColor, floorColor, floorPresetId]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    saveDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placedItems]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fbff 0%, #f1f5f9 100%)",
        overflowX: "hidden"
      }}
    >
      <Navbar subtitle={isEditMode ? "Edit Saved Design" : "2D Design Workspace"} onPreview={handlePreview3D} />

      <Toast toast={toast} />

      <div style={{ padding: "10px", width: "100%", boxSizing: "border-box" }}>
        {pendingRestoreDraft && !location.state?.design ? (
          <div
            style={{
              marginBottom: "10px",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "18px",
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              flexWrap: "wrap"
            }}
          >
            <div style={{ color: "#1e3a8a", fontWeight: 700 }}>A previous draft was found. Restore it?</div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={secondaryButtonStyle} onClick={handleDiscardDraft}>Start Fresh</button>
              <button style={primaryButtonStyle} onClick={handleRestoreDraft}>Restore Draft</button>
            </div>
          </div>
        ) : null}
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "220px minmax(0, 1fr) 230px",
            gap: "10px",
            alignItems: "start"
          }}
        >
          <aside
            style={{
              background: "rgba(255,255,255,0.92)",
              border: "1px solid #dbe2ea",
              borderRadius: "22px",
              overflow: "hidden",
              minHeight: "calc(100vh - 96px)"
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
                          width: "34px",
                          height: "34px",
                          display: "grid",
                          placeItems: "center",
                          border: activeSection === section.key ? "1px solid #93c5fd" : "1px solid #dbe2ea",
                          borderRadius: "11px",
                          fontSize: "16px",
                          background: "#ffffff",
                          flexShrink: 0
                        }}
                      >
                        {section.icon}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "14px", color: "#0f172a", fontWeight: 700 }}>
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
              gridTemplateRows: "auto auto auto 1fr",
              gap: "10px",
              minWidth: 0
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
                alignItems: "center"
              }}
            >
              <div>
                <div style={{ fontSize: "12px", opacity: 0.85, marginBottom: "4px" }}>
                  Design Workspace
                </div>
                <div style={{ fontSize: "20px", fontWeight: 800 }}>{roomName}</div>
                <div style={{ fontSize: "12px", opacity: 0.9, marginTop: "4px" }}>
                  {roomWidth}m × {roomLength}m × {roomHeight}m
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  style={{ ...heroInputStyle, width: "150px" }}
                />
                <input
                  type="number"
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(Number(e.target.value) || 6)}
                  style={{ ...heroInputStyle, width: "58px" }}
                />
                <input
                  type="number"
                  value={roomLength}
                  onChange={(e) => setRoomLength(Number(e.target.value) || 5)}
                  style={{ ...heroInputStyle, width: "58px" }}
                />
                <input
                  type="number"
                  value={roomHeight}
                  onChange={(e) => setRoomHeight(Number(e.target.value) || 3)}
                  style={{ ...heroInputStyle, width: "58px" }}
                />
              </div>
            </section>

            <section
              style={{
                background: "rgba(255,255,255,0.92)",
                border: "1px solid #dbe2ea",
                borderRadius: "22px",
                padding: "14px"
              }}
            >
              <div style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>
                Quick Add
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                  gap: "10px"
                }}
              >
                {quickAddItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleAddItem(item)}
                    draggable
                    onDragStart={(e) => handleLibraryDragStart(e, item)}
                    style={{
                      border: "1px solid #dbe2ea",
                      background: "#ffffff",
                      borderRadius: "16px",
                      padding: "10px",
                      textAlign: "left",
                      cursor: "grab",
                      minWidth: 0
                    }}
                  >
                    <MiniModelCard item={item} height={54} />
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#0f172a",
                        fontSize: "13px",
                        marginTop: "8px",
                        lineHeight: 1.2
                      }}
                    >
                      {item.type}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section
              style={{
                background: "rgba(255,255,255,0.92)",
                border: "1px solid #dbe2ea",
                borderRadius: "22px",
                padding: "12px 14px"
              }}
            >
              <div style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>
                Floor Styles
              </div>

              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "10px" }}>
                Choose a floor finish for this room.
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: "10px"
                }}
              >
                {FLOOR_PRESETS.map((floor) => (
                  <button
                    key={floor.id}
                    type="button"
                    onClick={() => {
                      pushHistory();
                      setFloorPresetId(floor.id);
                      saveDraft(placedItems, { floorTexture: floor.id });
                    }}
                    style={{
                      border: floorPresetId === floor.id ? "2px solid #2563eb" : "1px solid #dbe2ea",
                      background: floorPresetId === floor.id ? "#eff6ff" : "#ffffff",
                      borderRadius: "14px",
                      padding: "8px",
                      textAlign: "left",
                      cursor: "pointer",
                      minWidth: 0
                    }}
                  >
                    <div
                      style={{
                        height: "50px",
                        borderRadius: "10px",
                        backgroundImage: `url(${floor.preview})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        border: "1px solid #e5e7eb",
                        marginBottom: "6px"
                      }}
                    />

                    <div
                      style={{
                        fontWeight: 700,
                        color: "#0f172a",
                        fontSize: "12px",
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {floor.name}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section
              style={{
                display: "grid",
                gridTemplateColumns: "250px minmax(0, 1fr)",
                gap: "10px",
                minWidth: 0
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.92)",
                  border: "1px solid #dbe2ea",
                  borderRadius: "22px",
                  padding: "14px"
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
                    gridTemplateColumns: "1fr",
                    gap: "10px",
                    maxHeight: "360px",
                    overflowY: "auto",
                    paddingRight: "2px"
                  }}
                >
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleAddItem(item)}
                      draggable
                      onDragStart={(e) => handleLibraryDragStart(e, item)}
                      style={{
                        border: "1px solid #dbe2ea",
                        background: "#ffffff",
                        borderRadius: "14px",
                        padding: "10px",
                        textAlign: "left",
                        cursor: "grab"
                      }}
                    >
                      <MiniModelCard item={item} height={68} />
                      <div
                        style={{
                          fontWeight: 700,
                          color: "#0f172a",
                          fontSize: "13px",
                          marginTop: "8px"
                        }}
                      >
                        {item.type}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.92)",
                  border: "1px solid #dbe2ea",
                  borderRadius: "22px",
                  padding: "14px",
                  display: "grid",
                  gridTemplateRows: "auto 1fr",
                  minWidth: 0
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
                    gap: "10px",
                    marginBottom: "10px"
                  }}
                >
                  <button style={secondaryButtonStyle} onClick={handleUndo} disabled={!history.length}>
                    Undo
                  </button>
                  <button style={secondaryButtonStyle} onClick={handleRedo} disabled={!future.length}>
                    Redo
                  </button>
                  <button style={secondaryButtonStyle} onClick={() => navigate("/dashboard")}>
                    Back
                  </button>
                  <button style={secondaryButtonStyle} onClick={handleSaveDesign}>
                    {isEditMode ? "Update Design" : "Save Design"}
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
                    minWidth: 0
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
                      overflow: "hidden"
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
                          fontSize: "20px"
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

                            setSelectedId(item.id);

                            const rect = canvasRef.current.getBoundingClientRect();
                            const pxPerMeterX = rect.width / roomWidth;
                            const pxPerMeterY = rect.height / roomLength;

                            setDraggingId(item.id);
                            setDragOffset({
                              x: event.clientX - rect.left - item.x * pxPerMeterX,
                              y: event.clientY - rect.top - item.y * pxPerMeterY
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
                            boxShadow:
                              selectedId === item.id
                                ? "0 0 0 4px rgba(37,99,235,0.15)"
                                : "0 10px 18px rgba(15,23,42,0.14)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#0f172a",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "move",
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
              border: "1px solid #dbe2ea",
              borderRadius: "22px",
              minHeight: "calc(100vh - 96px)",
              padding: "14px"
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>
              Inspector
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Wall Color</label>
              <input type="color" value={wallColor} onChange={(e) => setWallColor(e.target.value)} style={colorInputStyle} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Floor Color</label>
              <input type="color" value={floorColor} onChange={(e) => setFloorColor(e.target.value)} style={colorInputStyle} />
            </div>

            <div
              style={{
                border: "1px solid #dbe2ea",
                borderRadius: "16px",
                padding: "12px",
                background: "#f8fafc",
                marginBottom: "12px"
              }}
            >
              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>Selected Floor</div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
                {selectedFloor?.name || "Beige Tiles"}
              </div>
            </div>

            {!selectedItem ? (
              <div style={emptyCardStyle}>Select an item from the canvas to edit it.</div>
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
                  <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>Selected Item</div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>{selectedItem.type}</div>
                </div>

                <div>
                  <label style={labelStyle}>X Position</label>
                  <input
                    type="number"
                    step="0.1"
                    value={selectedItem.x}
                    onChange={(e) =>
                      updatePlacedItem(selectedItem.id, {
                        x: Number(clamp(Number(e.target.value) || 0, 0, Math.max(0, roomWidth - selectedItem.width)).toFixed(2))
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
                        y: Number(clamp(Number(e.target.value) || 0, 0, Math.max(0, roomLength - selectedItem.depth)).toFixed(2))
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

const colorInputStyle = {
  width: "100%",
  height: "34px",
  padding: "4px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  boxSizing: "border-box",
  cursor: "pointer"
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