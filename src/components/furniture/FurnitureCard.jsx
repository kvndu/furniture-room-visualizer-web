export default function FurnitureCard({ item, selected, onSelect, onDragStart }) {
  return (
    <div
      role="button"
      tabIndex={0}
      draggable
      onDragStart={(e) => onDragStart?.(e, item)}
      onClick={() => onSelect?.(item)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect?.(item)}
      style={{
        cursor: "grab",
        border: selected ? "2px solid #2563eb" : "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "12px",
        background: "#fff"
      }}
    >
      <div style={{ height: "100px", borderRadius: "10px", background: item.color || "#e2e8f0", marginBottom: "10px" }} />
      <strong>{item.type}</strong>
      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "6px" }}>
        {item.width || 1}m × {item.depth || item.length || 1}m
      </div>
    </div>
  );
}
