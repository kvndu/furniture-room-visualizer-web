import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const SAVED_KEY = "savedDesigns";
const PORTFOLIO_KEY = "portfolioDesigns";
const DRAFT_KEY = "draftDesign";

function readItems(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatDate(value) {
  if (!value) return "Not available";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "Not available";
  }
}

function normalize(item, source = "saved") {
  return {
    id: item?.id || `${source}-${Date.now()}`,
    name: item?.name || item?.roomName || "Untitled Room",
    roomType: item?.roomType || "Custom",
    width: Number(item?.width) || 6,
    length: Number(item?.length) || 5,
    height: Number(item?.height) || 3,
    wallColor: item?.wallColor || "#dbeafe",
    floorTexture: item?.floorTexture || "tiles-beige",
    furniture: Array.isArray(item?.furniture) ? item.furniture : [],
    updatedAt: item?.updatedAt || item?.savedAt || item?.createdAt || null,
    source
  };
}

function DesignCard({ design, onOpen, onEdit, onDelete }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #dbe2ea",
        borderRadius: "22px",
        padding: "18px",
        boxShadow: "0 10px 26px rgba(15, 23, 42, 0.05)"
      }}
    >
      <div
        style={{
          height: "120px",
          borderRadius: "16px",
          background: `linear-gradient(135deg, ${design.wallColor} 0%, #eff6ff 100%)`,
          border: "1px solid #cbd5e1",
          display: "grid",
          placeItems: "center",
          marginBottom: "14px",
          color: "#1d4ed8",
          fontSize: "34px"
        }}
      >
        🖼️
      </div>

      <div style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>{design.name}</div>
      <div style={{ fontSize: "13px", color: "#475569", fontWeight: 700, marginBottom: "10px" }}>{design.roomType}</div>

      <div style={{ display: "grid", gap: "6px", marginBottom: "14px" }}>
        <div style={{ fontSize: "13px", color: "#64748b" }}>Size: <span style={{ color: "#0f172a", fontWeight: 700 }}>{design.width}m × {design.length}m × {design.height}m</span></div>
        <div style={{ fontSize: "13px", color: "#64748b" }}>Items: <span style={{ color: "#0f172a", fontWeight: 700 }}>{design.furniture.length}</span></div>
        <div style={{ fontSize: "13px", color: "#64748b" }}>Floor: <span style={{ color: "#0f172a", fontWeight: 700 }}>{design.floorTexture}</span></div>
        <div style={{ fontSize: "13px", color: "#64748b" }}>Updated: <span style={{ color: "#0f172a", fontWeight: 700 }}>{formatDate(design.updatedAt)}</span></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
        <button onClick={() => onOpen(design)} style={buttonSecondary}>Open</button>
        <button onClick={() => onEdit(design)} style={buttonSecondary}>Edit</button>
        <button onClick={() => onDelete(design)} style={buttonDanger}>Delete</button>
      </div>
    </div>
  );
}

const buttonSecondary = {
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  padding: "11px 14px",
  borderRadius: "14px",
  fontWeight: 800,
  cursor: "pointer",
  width: "100%"
};

const buttonDanger = {
  border: "1px solid #fecaca",
  background: "#fef2f2",
  color: "#b91c1c",
  padding: "11px 14px",
  borderRadius: "14px",
  fontWeight: 800,
  cursor: "pointer",
  width: "100%"
};

export default function Portfolio() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [version, setVersion] = useState(0);

  const items = useMemo(() => {
    const all = [
      ...readItems(SAVED_KEY).map((item) => normalize(item, "saved")),
      ...readItems(PORTFOLIO_KEY).map((item) => normalize(item, "portfolio"))
    ];
    const query = search.trim().toLowerCase();
    return all.filter((item) => !query || item.name.toLowerCase().includes(query));
  }, [search, version]);

  function openDesign(design) {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(design));
    navigate("/preview-3d", { state: { design } });
  }

  function editDesign(design) {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(design));
    navigate("/create-design", { state: { design } });
  }

  function deleteDesign(design) {
    if (!window.confirm(`Delete "${design.name}"?`)) return;
    const key = design.source === "portfolio" ? PORTFOLIO_KEY : SAVED_KEY;
    const nextItems = readItems(key).filter((item) => String(item?.id) !== String(design.id));
    localStorage.setItem(key, JSON.stringify(nextItems));
    setVersion((value) => value + 1);
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f8fbff 0%, #f1f5f9 100%)" }}>
      <Navbar subtitle="Portfolio Workspace" />

      <div style={{ width: "100%", padding: "14px", boxSizing: "border-box", display: "grid", gap: "14px" }}>
        <section style={{ background: "#ffffff", border: "1px solid #dbe2ea", borderRadius: "24px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "#0f172a" }}>Portfolio</div>
              <div style={{ color: "#64748b", fontSize: "14px", marginTop: "6px" }}>
                View and manage your saved room concepts from one place.
              </div>
            </div>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search portfolio..."
              style={{ border: "1px solid #cbd5e1", borderRadius: "12px", padding: "10px 12px", minWidth: "240px", outline: "none" }}
            />
          </div>
        </section>

        {items.length === 0 ? (
          <div style={{ background: "#ffffff", border: "1px dashed #cbd5e1", borderRadius: "24px", padding: "36px", textAlign: "center", color: "#64748b", fontWeight: 700 }}>
            No saved designs yet. Create your first room design.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "14px" }}>
            {items.map((design) => (
              <DesignCard key={`${design.source}-${design.id}`} design={design} onOpen={openDesign} onEdit={editDesign} onDelete={deleteDesign} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
