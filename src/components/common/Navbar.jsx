import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function navItemStyle(active) {
  return {
    border: "1px solid rgba(255,255,255,0.18)",
    background: active ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
    color: "#ffffff",
    padding: "10px 14px",
    borderRadius: "12px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  };
}

export default function Navbar({ subtitle = "Workspace", onPreview, showPreview = true, previewLabel = "Preview 3D" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  function isActive(path) {
    return location.pathname === path;
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
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
          boxSizing: "border-box",
          flexWrap: "wrap"
        }}
      >
        <div>
          <div style={{ color: "#ffffff", fontSize: "17px", fontWeight: 800 }}>Furniture Room Visualizer</div>
          <div style={{ color: "rgba(255,255,255,0.78)", fontSize: "12px", marginTop: "2px" }}>
            {subtitle}{user?.name ? ` • ${user.name}` : ""}
          </div>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <NavLink to="/dashboard" style={navItemStyle(isActive("/dashboard"))}>Dashboard</NavLink>
          <NavLink to="/create-design" style={navItemStyle(isActive("/create-design"))}>Create 2D</NavLink>
          <NavLink to="/portfolio" style={navItemStyle(isActive("/portfolio"))}>Portfolio</NavLink>

          {showPreview && (
            <button onClick={onPreview || (() => navigate("/preview-3d"))} style={navItemStyle(isActive("/preview-3d"))}>
              {previewLabel}
            </button>
          )}

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
  );
}
