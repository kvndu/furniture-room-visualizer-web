import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDesign } from "../hooks/useDesign";
import ThreeDRoomViewer from "../components/room/ThreeDRoomViewer";

const furnitureModelMap = {
  chair: "/models/chair.glb",
  armchair: "/models/armchair.glb",
  desk: "/models/desk.glb",
  table: "/models/table.glb",
  diningtable: "/models/diningtable.glb",
  coffeetable: "/models/coffeetable.glb",
  sidetable: "/models/sidetable.glb",
  bed: "/models/bed.glb",
  sofa: "/models/sofa.glb",
  fridge: "/models/fridge.glb",
  cabinet: "/models/cabinet.glb",
  wardrobe: "/models/wardrobe.glb",
  tvstand: "/models/tvstand.glb",
  nightstand: "/models/nightstand.glb",
  kitchenisland: "/models/kitchen-island.glb",
  shelf: "/models/shelf.glb",
  bookshelf: "/models/bookshelf.glb",
  dresser: "/models/dresser.glb"
};

export default function Preview3D() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const designId = searchParams.get("id");

  const { user, logout } = useAuth();
  const { draftDesign, getDesignById } = useDesign();

  const design = designId ? getDesignById(designId) : draftDesign;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!design) {
    return (
      <>
        <div className="navbar">
          <div className="navbar-inner">
            <h2 style={{ margin: 0 }}>Furniture Room Visualizer</h2>
            <div className="nav-links">
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/create-design">Create 2D</Link>
              <Link to="/portfolio">Portfolio</Link>
            </div>
          </div>
        </div>

        <div className="page">
          <div className="container">
            <div className="card">
              <h1 className="title">3D Preview</h1>
              <p className="subtitle">No draft or saved design found.</p>
              <Link to="/create-design" className="btn">
                Go to 2D Editor
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="navbar">
        <div className="navbar-inner">
          <div>
            <h2 style={{ margin: 0 }}>Furniture Room Visualizer</h2>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#cbd5e1" }}>
              3D Preview Workspace
            </p>
          </div>

          <div className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/create-design">Create 2D</Link>
            <Link to="/portfolio">Portfolio</Link>
            <span
              className="badge"
              style={{ background: "#1e3a8a", color: "#dbeafe" }}
            >
              {user?.name || "Designer"}
            </span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="page" style={{ background: "#f8fafc" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "320px 1fr",
              gap: "20px"
            }}
          >
            <div className="card">
              <h1 className="title" style={{ marginBottom: "8px" }}>
                3D Preview
              </h1>
              <p className="subtitle">Orbit, zoom, and inspect the current design.</p>

              <div style={{ display: "grid", gap: "12px" }}>
                <div className="summary-item">
                  <span>Room</span>
                  <strong>{design.roomName || design.roomType}</strong>
                </div>

                <div className="summary-item">
                  <span>Type</span>
                  <strong>{design.roomType}</strong>
                </div>

                <div className="summary-item">
                  <span>Size</span>
                  <strong>
                    {design.width}m × {design.length}m × {design.height || 3}m
                  </strong>
                </div>

                <div className="summary-item">
                  <span>Furniture</span>
                  <strong>{design.furniture?.length || 0}</strong>
                </div>
              </div>

              <div
                style={{
                  marginTop: "18px",
                  padding: "14px",
                  borderRadius: "12px",
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  fontSize: "13px",
                  color: "#1e3a8a",
                  lineHeight: 1.5
                }}
              >
                This preview is ready to use real GLB furniture models from
                <strong> public/models</strong>. Furniture will load as real 3D models
                when the item type matches a model key.
              </div>

              <div style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
                <button className="btn" onClick={() => navigate("/create-design")}>
                  Back to 2D Editor
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/portfolio")}
                >
                  Open Portfolio
                </button>
              </div>
            </div>

            <div className="card">
              <ThreeDRoomViewer
                design={design}
                furnitureModelMap={furnitureModelMap}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}