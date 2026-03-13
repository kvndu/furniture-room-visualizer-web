export default function FurnitureTransformPanel({ item }) {
  if (!item) {
    return <p style={{ color: "#64748b", margin: 0 }}>Select a furniture item to inspect its properties.</p>;
  }

  return (
    <div className="summary-list">
      <div className="summary-item"><span>Type</span><strong>{item.type}</strong></div>
      <div className="summary-item"><span>Position</span><strong>{item.x?.toFixed?.(2) ?? item.x}, {item.y?.toFixed?.(2) ?? item.y}</strong></div>
      <div className="summary-item"><span>Size</span><strong>{item.width}m × {item.depth}m</strong></div>
      <div className="summary-item"><span>Rotation</span><strong>{item.rotation || 0}°</strong></div>
    </div>
  );
}
