import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const DRAFT_KEY = "draftDesign";
const PORTFOLIO_KEY = "portfolioDesigns";
const DESIGNS_KEY = "savedDesigns";

function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function uid(prefix = "design") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatDate(value) {
  if (!value) return "Not available";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "Not available";
  }
}

function normalizeDesign(item, source = "saved") {
  return {
    id: item?.id || uid(source),
    name: item?.name || item?.roomName || "Untitled Room",
    roomType: item?.roomType || "Custom",
    width: Number(item?.width) || 6,
    length: Number(item?.length) || 5,
    height: Number(item?.height) || 3,
    wallColor: item?.wallColor || "#dbeafe",
    floorColor: item?.floorColor || "#efe7da",
    floorTexture: item?.floorTexture || "tiles-beige",
    furniture: Array.isArray(item?.furniture) ? item.furniture : [],
    createdAt: item?.createdAt || item?.savedAt || item?.updatedAt || null,
    updatedAt: item?.updatedAt || item?.savedAt || item?.createdAt || null,
    savedAt: item?.savedAt || item?.updatedAt || item?.createdAt || null,
    source
  };
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

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: "84px",
        right: "18px",
        zIndex: 80,
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

function SummaryCard({ title, value, subtitle, icon, accent }) {
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
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          display: "grid",
          placeItems: "center",
          fontSize: "22px",
          background: accent,
          marginBottom: "12px"
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: "30px", fontWeight: 800, color: "#0f172a", marginTop: "6px" }}>{value}</div>
      <div style={{ fontSize: "13px", color: "#64748b", marginTop: "6px" }}>{subtitle}</div>
    </div>
  );
}

function ActionButton({ title, text, buttonLabel, onClick, icon, primary = false }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #dbe2ea",
        borderRadius: "20px",
        padding: "16px"
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "12px",
          display: "grid",
          placeItems: "center",
          fontSize: "20px",
          background: "#eff6ff",
          marginBottom: "10px"
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>{title}</div>
      <div style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.5, marginBottom: "12px" }}>{text}</div>
      <button
        onClick={onClick}
        style={
          primary
            ? {
                border: "none",
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#ffffff",
                padding: "11px 14px",
                borderRadius: "14px",
                fontWeight: 800,
                cursor: "pointer",
                width: "100%"
              }
            : {
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                padding: "11px 14px",
                borderRadius: "14px",
                fontWeight: 800,
                cursor: "pointer",
                width: "100%"
              }
        }
      >
        {buttonLabel}
      </button>
    </div>
  );
}

function DesignCard({ design, onOpen, onEdit, onDuplicate, onDelete }) {
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
          background: `linear-gradient(135deg, ${design.wallColor || "#dbeafe"} 0%, #eff6ff 100%)`,
          border: "1px solid #cbd5e1",
          display: "grid",
          placeItems: "center",
          marginBottom: "14px",
          color: "#1d4ed8",
          fontSize: "34px"
        }}
      >
        🏠
      </div>

      <div style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>{design.name}</div>
      <div style={{ fontSize: "13px", color: "#475569", fontWeight: 700, marginBottom: "10px" }}>{design.roomType}</div>

      <div style={{ display: "grid", gap: "6px", marginBottom: "14px" }}>
        <div style={{ fontSize: "13px", color: "#64748b" }}>Size: <span style={{ color: "#0f172a", fontWeight: 700 }}>{design.width}m × {design.length}m × {design.height}m</span></div>
        <div style={{ fontSize: "13px", color: "#64748b" }}>Items: <span style={{ color: "#0f172a", fontWeight: 700 }}>{design.furniture.length}</span></div>
        <div style={{ fontSize: "13px", color: "#64748b" }}>Floor: <span style={{ color: "#0f172a", fontWeight: 700 }}>{design.floorTexture || "tiles-beige"}</span></div>
        <div style={{ fontSize: "13px", color: "#64748b" }}>Updated: <span style={{ color: "#0f172a", fontWeight: 700 }}>{formatDate(design.updatedAt)}</span></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
        <button onClick={() => onOpen(design)} style={buttonSecondary}>Open</button>
        <button onClick={() => onEdit(design)} style={buttonSecondary}>Edit</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <button onClick={() => onDuplicate(design)} style={buttonSecondary}>Duplicate</button>
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

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [draft, setDraft] = useState(null);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setDraft(safeRead(DRAFT_KEY, null));
    setSavedDesigns((safeRead(DESIGNS_KEY, []) || []).map((item) => normalizeDesign(item, "saved")));
    setPortfolioItems((safeRead(PORTFOLIO_KEY, []) || []).map((item) => normalizeDesign(item, "portfolio")));
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const recentDesigns = useMemo(() => {
    const query = search.trim().toLowerCase();
    const combined = [...savedDesigns, ...portfolioItems].filter((item) => !query || item.name.toLowerCase().includes(query));

    combined.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "items") return b.furniture.length - a.furniture.length;
      const da = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const db = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return db - da;
    });

    return combined;
  }, [savedDesigns, portfolioItems, search, sortBy]);

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  function persistLists(nextSaved, nextPortfolio = portfolioItems) {
    setSavedDesigns(nextSaved);
    setPortfolioItems(nextPortfolio);
    localStorage.setItem(DESIGNS_KEY, JSON.stringify(nextSaved));
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(nextPortfolio));
  }

  function draftFromDesign(design) {
    return {
      id: design.id,
      name: design.name,
      roomType: design.roomType,
      width: design.width,
      length: design.length,
      height: design.height,
      wallColor: design.wallColor,
      floorColor: design.floorColor,
      floorTexture: design.floorTexture,
      furniture: design.furniture || [],
      createdAt: design.createdAt || design.savedAt || new Date().toISOString(),
      updatedAt: design.updatedAt || design.savedAt || design.createdAt || null,
      savedAt: design.savedAt || design.updatedAt || design.createdAt || null
    };
  }

  function openDesign(design) {
    const draftDesign = draftFromDesign(design);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draftDesign));
    navigate("/preview-3d", { state: { design: draftDesign } });
  }

  function editDesign(design) {
    const draftDesign = draftFromDesign(design);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draftDesign));
    navigate("/create-design", { state: { design: draftDesign } });
  }

  function duplicateDesign(design) {
    const now = new Date().toISOString();
    const copy = normalizeDesign({
      ...design,
      id: uid("design"),
      name: `${design.name} Copy`,
      createdAt: now,
      updatedAt: now,
      savedAt: now
    });
    const nextSaved = [copy, ...savedDesigns];
    persistLists(nextSaved);
    showToast(`Duplicated ${design.name}`);
  }

  function deleteDesign(design) {
    if (!window.confirm(`Delete "${design.name}"?`)) return;

    if (design.source === "portfolio") {
      const nextPortfolio = portfolioItems.filter((item) => item.id !== design.id);
      persistLists(savedDesigns, nextPortfolio);
    } else {
      const nextSaved = savedDesigns.filter((item) => item.id !== design.id);
      persistLists(nextSaved, portfolioItems);
    }

    if (draft?.id === design.id) {
      localStorage.removeItem(DRAFT_KEY);
      setDraft(null);
    }

    showToast(`Deleted ${design.name}`);
  }

  function continueDraft() {
    navigate("/create-design");
  }

  function previewDraft() {
    if (!draft) {
      navigate("/create-design");
      return;
    }
    navigate("/preview-3d", { state: { design: draft } });
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  const totalDesigns = savedDesigns.length;
  const draftCount = draft ? 1 : 0;
  const portfolioCount = portfolioItems.length;
  const totalItemsAcrossDesigns = [...savedDesigns, ...portfolioItems].reduce((sum, item) => sum + item.furniture.length, 0);
  const averageItems = totalDesigns + portfolioCount > 0 ? Math.round(totalItemsAcrossDesigns / (totalDesigns + portfolioCount)) : 0;
  const lastEdited = draft?.name || recentDesigns[0]?.name || "No recent design";

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f8fbff 0%, #f1f5f9 100%)" }}>
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
            <div style={{ color: "#ffffff", fontSize: "17px", fontWeight: 800 }}>Furniture Room Visualizer</div>
            <div style={{ color: "rgba(255,255,255,0.78)", fontSize: "12px", marginTop: "2px" }}>
              Dashboard Workspace {user?.name ? `• ${user.name}` : ""}
            </div>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <TopNavItem to="/dashboard" active>Dashboard</TopNavItem>
            <TopNavItem to="/create-design">Create 2D</TopNavItem>
            <TopNavItem to="/portfolio">Portfolio</TopNavItem>
            <button onClick={previewDraft} style={{ border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.1)", color: "#ffffff", padding: "10px 14px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>Preview 3D</button>
            <button onClick={handleLogout} style={{ border: "1px solid rgba(255,255,255,0.18)", background: "rgba(239,68,68,0.18)", color: "#ffffff", padding: "10px 14px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>Logout</button>
          </nav>
        </div>
      </header>

      <Toast toast={toast} />

      <div style={{ width: "100%", padding: "14px", boxSizing: "border-box", display: "grid", gap: "14px" }}>
        <section style={{ background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)", color: "#ffffff", borderRadius: "26px", padding: "24px", boxShadow: "0 18px 40px rgba(37, 99, 235, 0.18)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "13px", opacity: 0.86, fontWeight: 700, marginBottom: "8px" }}>Welcome back</div>
            <div style={{ fontSize: "34px", fontWeight: 900, lineHeight: 1.1 }}>Manage your room designs easily</div>
            <div style={{ fontSize: "15px", opacity: 0.9, marginTop: "10px", maxWidth: "760px" }}>
              Create new room layouts, continue saved drafts, preview designs in 3D, and keep your portfolio organized from one place.
            </div>
          </div>
          <button onClick={() => navigate("/create-design")} style={{ border: "none", background: "#ffffff", color: "#0f172a", padding: "13px 18px", borderRadius: "16px", fontWeight: 800, cursor: "pointer" }}>Create New Design</button>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "12px" }}>
          <SummaryCard title="Total Designs" value={totalDesigns} subtitle="Saved designs in your workspace" icon="📁" accent="#dbeafe" />
          <SummaryCard title="Draft Rooms" value={draftCount} subtitle="Current unfinished design drafts" icon="📝" accent="#dcfce7" />
          <SummaryCard title="Portfolio Items" value={portfolioCount} subtitle="Designs added to your portfolio" icon="⭐" accent="#fef3c7" />
          <SummaryCard title="Last Edited" value={lastEdited} subtitle="Most recent room you worked on" icon="🕒" accent="#ede9fe" />
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1.65fr 0.95fr", gap: "14px", alignItems: "start" }}>
          <div style={{ background: "#ffffff", border: "1px solid #dbe2ea", borderRadius: "24px", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "14px", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: "18px", fontWeight: 900, color: "#0f172a" }}>Saved Designs</div>
                <div style={{ color: "#64748b", fontSize: "13px", marginTop: "4px" }}>Search, sort, edit, duplicate, and delete your saved room layouts.</div>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search designs..." style={{ border: "1px solid #cbd5e1", borderRadius: "12px", padding: "10px 12px", minWidth: "220px", outline: "none" }} />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ border: "1px solid #cbd5e1", borderRadius: "12px", padding: "10px 12px", outline: "none" }}>
                  <option value="updated">Sort: Last updated</option>
                  <option value="name">Sort: Name</option>
                  <option value="items">Sort: Item count</option>
                </select>
              </div>
            </div>

            {recentDesigns.length === 0 ? (
              <div style={{ border: "1px dashed #cbd5e1", borderRadius: "20px", padding: "32px", textAlign: "center", color: "#64748b", fontWeight: 700 }}>
                No saved designs yet. Create your first room design.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
                {recentDesigns.map((design) => (
                  <DesignCard
                    key={design.id}
                    design={design}
                    onOpen={openDesign}
                    onEdit={editDesign}
                    onDuplicate={duplicateDesign}
                    onDelete={deleteDesign}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "grid", gap: "14px" }}>
            <ActionButton title="Continue Draft" text="Jump back into your current room draft and continue working." buttonLabel="Continue Draft" onClick={continueDraft} icon="📌" primary />
            <ActionButton title="Open Portfolio" text="View completed room concepts and portfolio-ready projects." buttonLabel="Open Portfolio" onClick={() => navigate("/portfolio")} icon="🖼️" />
            <ActionButton title="Preview Current Draft" text="Review the latest draft in 3D before finalizing your design." buttonLabel="Preview Draft" onClick={previewDraft} icon="🧊" />
            <ActionButton title="Workspace Average" text={`Average furniture items per design: ${averageItems}.`} buttonLabel="Create New Room" onClick={() => navigate("/create-design")} icon="📊" />
          </div>
        </section>
      </div>
    </div>
  );
}
