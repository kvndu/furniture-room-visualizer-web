export default function Modal({ open, title, children, footer, onClose }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div className="card" style={{ width: "100%", maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 className="section-title" style={{ marginBottom: 0 }}>{title}</h3>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
        <div>{children}</div>
        {footer && <div style={{ marginTop: "18px" }}>{footer}</div>}
      </div>
    </div>
  );
}
