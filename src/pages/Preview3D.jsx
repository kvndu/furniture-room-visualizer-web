import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThreeDRoomViewer from "../components/room/ThreeDRoomViewer";

const STORAGE_KEY = "draftDesign";

export default function Preview3D() {
  const navigate = useNavigate();
  const [design, setDesign] = useState(null);
  const [wallMode, setWallMode] = useState("transparent");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setDesign(parsed);
    } catch (error) {
      console.error("Failed to load preview design:", error);
    }
  }, []);

  if (!design) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #f8fbff 0%, #f1f5f9 100%)",
          display: "grid",
          placeItems: "center",
          padding: "24px"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "520px",
            background: "#ffffff",
            border: "1px solid #dbe2ea",
            borderRadius: "24px",
            padding: "28px",
            textAlign: "center",
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)"
          }}
        >
          <h2 style={{ margin: "0 0 10px", color: "#0f172a" }}>No Preview Data</h2>
          <p style={{ margin: "0 0 18px", color: "#64748b" }}>
            Create Design page eken item ekak add karala Preview 3D click karanna.
          </p>
          <button
            onClick={() => navigate("/create-design")}
            style={primaryButtonStyle}
          >
            Back to Create Design
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fbff 0%, #f1f5f9 100%)",
        padding: "10px"
      }}
    >
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "290px 1fr",
          gap: "10px"
        }}
      >
        <aside
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid #dbe2ea",
            borderRadius: "24px",
            padding: "18px",
            minHeight: "calc(100vh - 20px)",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)"
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
              color: "#ffffff",
              borderRadius: "20px",
              padding: "16px 18px",
              marginBottom: "16px"
            }}
          >
            <div style={{ fontSize: "12px", opacity: 0.85, marginBottom: "6px" }}>
              3D Preview Workspace
            </div>
            <div style={{ fontSize: "24px", fontWeight: 800 }}>
              {design.name || "My Room"}
            </div>
            <div style={{ fontSize: "13px", opacity: 0.9, marginTop: "6px" }}>
              Explore your room in 3D
            </div>
          </div>

          <div style={{ display: "grid", gap: "10px" }}>
            <InfoRow label="Room" value={design.name || "My Room"} />
            <InfoRow
              label="Size"
              value={`${design.width || 6}m × ${design.length || 5}m × ${design.height || 3}m`}
            />
            <InfoRow
              label="Furniture"
              value={String(design.furniture?.length || 0)}
            />
          </div>

          <div
            style={{
              marginTop: "18px",
              padding: "14px",
              border: "1px solid #dbe2ea",
              borderRadius: "16px",
              background: "#f8fafc"
            }}
          >
            <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "10px" }}>
              Wall Style
            </div>

            <div style={{ display: "grid", gap: "10px" }}>
              <button
                onClick={() => setWallMode("transparent")}
                style={wallMode === "transparent" ? activeWallButtonStyle : wallButtonStyle}
              >
                Transparent
              </button>

              <button
                onClick={() => setWallMode("solid")}
                style={wallMode === "solid" ? activeWallButtonStyle : wallButtonStyle}
              >
                Solid
              </button>

              <button
                onClick={() => setWallMode("hidden")}
                style={wallMode === "hidden" ? activeWallButtonStyle : wallButtonStyle}
              >
                Hidden Walls
              </button>
            </div>
          </div>

          <div
            style={{
              marginTop: "18px",
              padding: "14px",
              border: "1px solid #dbe2ea",
              borderRadius: "16px",
              background: "#f8fafc"
            }}
          >
            <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>
              Tips
            </div>
            <div style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>
              Drag to rotate the camera. Scroll to zoom. Use wall modes to inspect the room better.
            </div>
          </div>

          <div style={{ display: "grid", gap: "10px", marginTop: "18px" }}>
            <button
              onClick={() => navigate("/create-design")}
              style={secondaryButtonStyle}
            >
              Back to Editor
            </button>

            <button
              onClick={() => localStorage.removeItem(STORAGE_KEY)}
              style={dangerButtonStyle}
            >
              Clear Preview Data
            </button>
          </div>
        </aside>

        <section
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid #dbe2ea",
            borderRadius: "24px",
            padding: "10px",
            minHeight: "calc(100vh - 20px)",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)"
          }}
        >
          <ThreeDRoomViewer design={design} wallMode={wallMode} />
        </section>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        padding: "13px 14px",
        display: "flex",
        justifyContent: "space-between",
        gap: "10px",
        background: "#ffffff"
      }}
    >
      <span style={{ color: "#64748b", fontWeight: 700 }}>{label}</span>
      <span style={{ color: "#0f172a", fontWeight: 800 }}>{value}</span>
    </div>
  );
}

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
  padding: "12px 16px",
  borderRadius: "14px",
  fontWeight: 800,
  cursor: "pointer"
};

const wallButtonStyle = {
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  padding: "11px 14px",
  borderRadius: "12px",
  fontWeight: 700,
  cursor: "pointer"
};

const activeWallButtonStyle = {
  ...wallButtonStyle,
  background: "#dbeafe",
  border: "1px solid #93c5fd",
  color: "#1d4ed8"
};