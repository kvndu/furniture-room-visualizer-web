import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const DRAFT_KEY = "draftDesign";
const PORTFOLIO_KEY = "portfolioDesigns";
const DESIGNS_KEY = "savedDesigns";

function safeParse(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
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

function getFurnitureCount(design) {
  return Array.isArray(design?.furniture) ? design.furniture.length : 0;
}

function getRoomSize(design) {
  const w = Number(design?.width) || 6;
  const l = Number(design?.length) || 5;
  const h = Number(design?.height) || 3;
  return `${w}m × ${l}m × ${h}m`;
}

function normalizeDesignList(items, source) {
  if (!Array.isArray(items)) return [];

  return items.map((item, index) => ({
    id: item?.id || `${source}-${index}`,
    name: item?.name || item?.roomName || "Untitled Room",
    roomType: item?.roomType || "Custom",
    width: Number(item?.width) || 6,
    length: Number(item?.length) || 5,
    height: Number(item?.height) || 3,
    furniture: Array.isArray(item?.furniture) ? item.furniture : [],
    createdAt: item?.createdAt || item?.updatedAt || item?.savedAt || null,
    source
  }));
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

      <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 700 }}>
        {title}
      </div>
      <div style={{ fontSize: "30px", fontWeight: 800, color: "#0f172a", marginTop: "6px" }}>
        {value}
      </div>
      <div style={{ fontSize: "13px", color: "#64748b", marginTop: "6px" }}>
        {subtitle}
      </div>
    </div>
  );
}

function RecentDesignCard({ design, onOpen, onDelete }) {
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
          background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)",
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

      <div style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>
        {design.name}
      </div>

      <div style={{ fontSize: "13px", color: "#475569", fontWeight: 700, marginBottom: "8px" }}>
        {design.roomType}
      </div>

      <div style={{ display: "grid", gap: "6px", marginBottom: "14px" }}>
        <div style={{ fontSize: "13px", color: "#64748b" }}>
          Size: <span style={{ color: "#0f172a", fontWeight: 700 }}>{getRoomSize(design)}</span>
        </div>
        <div style={{ fontSize: "13px", color: "#64748b" }}>
          Items: <span style={{ color: "#0f172a", fontWeight: 700 }}>{getFurnitureCount(design)}</span>
        </div>
        <div style={{ fontSize: "13px", color: "#64748b" }}>
          Updated: <span style={{ color: "#0f172a", fontWeight: 700 }}>{formatDate(design.createdAt)}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <button
          onClick={() => onOpen(design)}
          style={{
            border: "1px solid #cbd5e1",
            background: "#ffffff",
            color: "#0f172a",
            padding: "11px 14px",
            borderRadius: "14px",
            fontWeight: 800,
            cursor: "pointer",
            width: "100%"
          }}
        >
          Open Design
        </button>

        <button
          onClick={() => onDelete(design)}
          style={{
            border: "1px solid #fecaca",
            background: "#fef2f2",
            color: "#b91c1c",
            padding: "11px 14px",
            borderRadius: "14px",
            fontWeight: 800,
            cursor: "pointer",
            width: "100%"
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function SmallStatCard({ title, value, subtitle }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #dbe2ea",
        borderRadius: "18px",
        padding: "16px"
      }}
    >
      <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: "24px", color: "#0f172a", fontWeight: 800, marginTop: "6px" }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>{subtitle}</div>
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

      <div style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>
        {title}
      </div>

      <div style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.5, marginBottom: "12px" }}>
        {text}
      </div>

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

export default function Dashboard() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);

  useEffect(() => {
    const draftData = safeParse(DRAFT_KEY, null);
    const savedData = normalizeDesignList(safeParse(DESIGNS_KEY, []), "saved");
    const portfolioData = normalizeDesignList(safeParse(PORTFOLIO_KEY, []), "portfolio");

    setDraft(draftData);
    setSavedDesigns(savedData);
    setPortfolioItems(portfolioData);
  }, []);

  const totalDesigns = savedDesigns.length;
  const draftCount = draft ? 1 : 0;
  const portfolioCount = portfolioItems.length;

  const recentDesigns = useMemo(() => {
    const items = [...savedDesigns, ...portfolioItems];
    return items
      .sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      })
      .slice(0, 4);
  }, [savedDesigns, portfolioItems]);

  const totalItemsAcrossDesigns = useMemo(() => {
    const all = [...savedDesigns, ...portfolioItems];
    return all.reduce((sum, item) => sum + getFurnitureCount(item), 0);
  }, [savedDesigns, portfolioItems]);

  const lastEdited = draft?.name || recentDesigns[0]?.name || "No recent design";
  const lastPreviewReady = draft ? "Ready" : "No draft";
  const averageItems =
    totalDesigns + portfolioCount > 0
      ? Math.round(totalItemsAcrossDesigns / (totalDesigns + portfolioCount))
      : 0;

  function persistLists(nextSaved, nextPortfolio) {
    setSavedDesigns(nextSaved);
    setPortfolioItems(nextPortfolio);
    localStorage.setItem(DESIGNS_KEY, JSON.stringify(nextSaved));
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(nextPortfolio));
  }

  function openDesign(design) {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
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
      })
    );
    navigate("/create-design");
  }

  function continueDraft() {
    navigate("/create-design");
  }

  function previewDraft() {
    if (!draft) {
      navigate("/create-design");
      return;
    }
    navigate("/preview-3d");
  }

  function deleteDesign(design) {
    const confirmed = window.confirm(`Delete "${design.name}"?`);
    if (!confirmed) return;

    if (design.source === "saved") {
      const nextSaved = savedDesigns.filter((item) => item.id !== design.id);
      persistLists(nextSaved, portfolioItems);
      return;
    }

    if (design.source === "portfolio") {
      const nextPortfolio = portfolioItems.filter((item) => item.id !== design.id);
      persistLists(savedDesigns, nextPortfolio);
    }
  }

  function handleLogout() {
    navigate("/");
  }

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
              Dashboard Workspace
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
            <TopNavItem to="/dashboard" active>
              Dashboard
            </TopNavItem>
            <TopNavItem to="/create-design">Create 2D</TopNavItem>
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
            <button
              onClick={handleLogout}
              style={{
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(239,68,68,0.18)",
                color: "#ffffff",
                padding: "10px 14px",
                borderRadius: "12px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <div
        style={{
          width: "100%",
          padding: "14px",
          boxSizing: "border-box",
          display: "grid",
          gap: "14px"
        }}
      >
        <section
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
            color: "#ffffff",
            borderRadius: "26px",
            padding: "24px",
            boxShadow: "0 18px 40px rgba(37, 99, 235, 0.18)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap"
          }}
        >
          <div>
            <div style={{ fontSize: "13px", opacity: 0.86, fontWeight: 700, marginBottom: "8px" }}>
              Welcome back
            </div>
            <div style={{ fontSize: "34px", fontWeight: 900, lineHeight: 1.1 }}>
              Manage your room designs easily
            </div>
            <div style={{ fontSize: "15px", opacity: 0.9, marginTop: "10px", maxWidth: "760px" }}>
              Create new room layouts, continue saved drafts, preview designs in 3D, and keep your portfolio organized from one place.
            </div>
          </div>

          <div>
            <button
              onClick={() => navigate("/create-design")}
              style={{
                border: "none",
                background: "#ffffff",
                color: "#0f172a",
                padding: "13px 18px",
                borderRadius: "16px",
                fontWeight: 800,
                cursor: "pointer"
              }}
            >
              Create New Design
            </button>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(220px, 1fr))",
            gap: "14px"
          }}
        >
          <SummaryCard
            title="Total Designs"
            value={totalDesigns}
            subtitle="Saved designs in your workspace"
            icon="📁"
            accent="#dbeafe"
          />
          <SummaryCard
            title="Draft Rooms"
            value={draftCount}
            subtitle="Current unfinished design drafts"
            icon="📝"
            accent="#dcfce7"
          />
          <SummaryCard
            title="Portfolio Items"
            value={portfolioCount}
            subtitle="Designs added to your portfolio"
            icon="⭐"
            accent="#fef3c7"
          />
          <SummaryCard
            title="Last Edited"
            value={lastEdited}
            subtitle="Most recent room you worked on"
            icon="🛋️"
            accent="#ede9fe"
          />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.7fr 1fr",
            gap: "14px",
            alignItems: "start"
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #dbe2ea",
              borderRadius: "26px",
              padding: "18px",
              boxShadow: "0 10px 26px rgba(15, 23, 42, 0.05)"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                marginBottom: "14px",
                flexWrap: "wrap"
              }}
            >
              <div>
                <div style={{ fontSize: "25px", fontWeight: 900, color: "#0f172a" }}>
                  Recent Designs
                </div>
                <div style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>
                  Quickly reopen your latest projects
                </div>
              </div>

              <button
                onClick={() => navigate("/portfolio")}
                style={{
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#0f172a",
                  padding: "11px 14px",
                  borderRadius: "14px",
                  fontWeight: 800,
                  cursor: "pointer"
                }}
              >
                View All
              </button>
            </div>

            {recentDesigns.length === 0 ? (
              <div
                style={{
                  border: "1px dashed #cbd5e1",
                  borderRadius: "18px",
                  padding: "28px",
                  textAlign: "center",
                  background: "#f8fafc",
                  color: "#64748b"
                }}
              >
                No recent designs yet. Create your first room design to get started.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(260px, 1fr))",
                  gap: "14px"
                }}
              >
                {recentDesigns.map((design) => (
                  <RecentDesignCard
                    key={design.id}
                    design={design}
                    onOpen={openDesign}
                    onDelete={deleteDesign}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "grid", gap: "14px" }}>
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #dbe2ea",
                borderRadius: "26px",
                padding: "18px",
                boxShadow: "0 10px 26px rgba(15, 23, 42, 0.05)"
              }}
            >
              <div style={{ fontSize: "25px", fontWeight: 900, color: "#0f172a", marginBottom: "14px" }}>
                Quick Access
              </div>

              <div style={{ display: "grid", gap: "10px" }}>
                <ActionButton
                  title="Continue Draft"
                  text="Jump back into your current room draft and continue working."
                  buttonLabel="Continue Draft"
                  onClick={continueDraft}
                  icon="📌"
                  primary
                />

                <ActionButton
                  title="Open Portfolio"
                  text="View completed room concepts and portfolio-ready projects."
                  buttonLabel="Open Portfolio"
                  onClick={() => navigate("/portfolio")}
                  icon="🖼️"
                />

                <ActionButton
                  title="Preview in 3D"
                  text="Inspect your current draft in 3D before finalizing it."
                  buttonLabel="Open 3D Preview"
                  onClick={previewDraft}
                  icon="🧊"
                />
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #dbe2ea",
                borderRadius: "26px",
                padding: "18px",
                boxShadow: "0 10px 26px rgba(15, 23, 42, 0.05)"
              }}
            >
              <div style={{ fontSize: "25px", fontWeight: 900, color: "#0f172a", marginBottom: "14px" }}>
                Project Stats
              </div>

              <div style={{ display: "grid", gap: "10px" }}>
                <SmallStatCard
                  title="Preview Status"
                  value={lastPreviewReady}
                  subtitle="Current draft preview availability"
                />
                <SmallStatCard
                  title="Average Items"
                  value={averageItems}
                  subtitle="Average furniture count per design"
                />
                <SmallStatCard
                  title="Total Furniture Used"
                  value={totalItemsAcrossDesigns}
                  subtitle="Items across saved and portfolio designs"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}