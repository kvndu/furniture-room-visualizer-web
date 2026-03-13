export default function DesignHistory({ designs = [], onOpen }) {
  return (
    <div className="card">
      <h3 className="section-title">Design History</h3>
      <div style={{ display: "grid", gap: "12px" }}>
        {designs.length === 0 ? (
          <p style={{ color: "#64748b", margin: 0 }}>No saved revisions yet.</p>
        ) : (
          designs.map((design) => (
            <button
              key={design.id}
              type="button"
              className="btn btn-secondary"
              style={{ justifyContent: "space-between" }}
              onClick={() => onOpen?.(design)}
            >
              <span>{design.roomName || design.roomType}</span>
              <span>{design.createdAt}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
