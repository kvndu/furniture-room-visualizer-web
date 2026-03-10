import { Link } from "react-router-dom";
import { useDesign } from "../hooks/useDesign";

export default function Portfolio() {
  const { designs, deleteDesign } = useDesign();

  return (
    <div className="page">
      <div className="container">
        <h1 className="title">Saved Portfolio</h1>
        <p className="subtitle">View all saved room designs</p>

        {designs.length === 0 ? (
          <div className="card">
            <p>No saved designs yet.</p>
          </div>
        ) : (
          <div className="grid-3">
            {designs.map((design) => (
              <div key={design.id} className="card">
                <div style={{ marginBottom: "8px" }}>
                  <span className="badge">{design.roomType}</span>
                </div>

                <h3>{design.roomName || "Untitled Room"}</h3>

                <p style={{ fontSize: "14px", marginTop: "6px" }}>
                  Size: {design.width || "-"}m × {design.length || "-"}m
                </p>

                <p style={{ fontSize: "14px" }}>
                  Furniture: {design.furnitureCount}
                </p>

                <div
                  style={{
                    height: "40px",
                    background: design.wallColor,
                    borderRadius: "8px",
                    margin: "10px 0"
                  }}
                />

                <p style={{ fontSize: "12px", color: "#6b7280" }}>
                  {design.createdAt}
                </p>

                <div className="flex mt-20">
                  <Link to={`/edit-design/${design.id}`} className="btn">
                    Edit
                  </Link>

                  <button
                    className="btn btn-secondary"
                    onClick={() => deleteDesign(design.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}