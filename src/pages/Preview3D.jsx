import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThreeDRoomViewer from "../components/room/ThreeDRoomViewer";

const STORAGE_KEY = "draftDesign";

function readDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function InfoCard({ label, value }) {
  return (
    <div
      style={{
        border: "1px solid #dbe2ea",
        background: "#ffffff",
        borderRadius: "16px",
        padding: "12px 14px",
        marginBottom: "10px"
      }}
    >
      <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px", fontWeight: 700 }}>
        {label}
      </div>
      <div style={{ fontSize: "16px", color: "#0f172a", fontWeight: 800 }}>
        {value}
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
      {title}
    </div>
  );
}

function ModeButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `1px solid ${active ? "#60a5fa" : "#cbd5e1"}`,
        background: active ? "#dbeafe" : "#ffffff",
        color: "#0f172a",
        padding: "11px 14px",
        borderRadius: "14px",
        fontWeight: 800,
        cursor: "pointer"
      }}
    >
      {label}
    </button>
  );
}

export default function Preview3D() {
  const navigate = useNavigate();
  const [design, setDesign] = useState(null);
  const [wallMode, setWallMode] = useState("solid");
  const [themeMode, setThemeMode] = useState("light");

  useEffect(() => {
    setDesign(readDraft());
    const onFocus = () => setDesign(readDraft());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  if (!design) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f1f5f9" }}>
        <button onClick={() => navigate("/create-design")}>Go to Create Design</button>
      </div>
    );
  }

  const roomName = design.name || "My Dream Room";
  const roomWidth = Number(design.width) || 6;
  const roomLength = Number(design.length) || 5;
  const roomHeight = Number(design.height) || 3;
  const furnitureCount = Array.isArray(design.furniture) ? design.furniture.length : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "12px", boxSizing: "border-box" }}>
      <div style={{ width: "100%", display: "grid", gridTemplateColumns: "260px 1fr", gap: "12px" }}>
        <aside
          style={{
            background: "rgba(255,255,255,0.94)",
            border: "1px solid #dbe2ea",
            borderRadius: "24px",
            padding: "14px",
            minHeight: "calc(100vh - 24px)"
          }}
        >
          <div
            style={{
              borderRadius: "22px",
              padding: "16px",
              color: "#ffffff",
              background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
              marginBottom: "14px"
            }}
          >
            <div style={{ fontSize: "12px", opacity: 0.84, marginBottom: "6px" }}>3D Preview Workspace</div>
            <div style={{ fontSize: "20px", fontWeight: 800 }}>{roomName}</div>
            <div style={{ fontSize: "14px", marginTop: "6px", opacity: 0.9 }}>Explore your room in 3D</div>
          </div>

          <InfoCard label="Room" value={roomName} />
          <InfoCard label="Size" value={`${roomWidth}m × ${roomLength}m × ${roomHeight}m`} />
          <InfoCard label="Furniture" value={`${furnitureCount}`} />

          <SectionTitle title="Wall Style" />
          <div style={{ display: "grid", gap: "8px", marginBottom: "14px" }}>
            <ModeButton active={wallMode === "transparent"} onClick={() => setWallMode("transparent")} label="Transparent" />
            <ModeButton active={wallMode === "solid"} onClick={() => setWallMode("solid")} label="Solid" />
            <ModeButton active={wallMode === "hidden"} onClick={() => setWallMode("hidden")} label="Hidden Walls" />
          </div>

          <SectionTitle title="Canvas Theme" />
          <div style={{ display: "grid", gap: "8px", marginBottom: "14px" }}>
            <ModeButton active={themeMode === "light"} onClick={() => setThemeMode("light")} label="Light Canvas" />
            <ModeButton active={themeMode === "dark"} onClick={() => setThemeMode("dark")} label="Dark Canvas" />
          </div>

          <div
            style={{
              border: "1px solid #dbe2ea",
              background: "#f8fafc",
              borderRadius: "18px",
              padding: "12px",
              marginBottom: "16px"
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
              Tips
            </div>
            <div style={{ color: "#475569", fontSize: "14px", lineHeight: 1.55 }}>
              Solid walls + Light Canvas is best. Models and selected floor now load from the same draft.
            </div>
          </div>

          <div style={{ display: "grid", gap: "10px" }}>
            <button
              onClick={() => navigate("/create-design")}
              style={{
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                padding: "12px 16px",
                borderRadius: "14px",
                fontWeight: 800,
                cursor: "pointer"
              }}
            >
              Back to Editor
            </button>

            <button
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                setDesign(null);
              }}
              style={{
                border: "1px solid #fecaca",
                background: "#fef2f2",
                color: "#b91c1c",
                padding: "12px 16px",
                borderRadius: "14px",
                fontWeight: 800,
                cursor: "pointer"
              }}
            >
              Clear Preview Data
            </button>
          </div>
        </aside>

        <main
          style={{
            background: "rgba(255,255,255,0.94)",
            border: "1px solid #dbe2ea",
            borderRadius: "24px",
            padding: "10px",
            minHeight: "calc(100vh - 24px)"
          }}
        >
          <ThreeDRoomViewer design={design} wallMode={wallMode} themeMode={themeMode} />
        </main>
      </div>
    </div>
  );
}