export default function FurnitureControls({ selectedItem, onDelete, onRotateLeft, onRotateRight, onBigger, onSmaller }) {
  const disabled = !selectedItem;

  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <button type="button" className="btn btn-secondary" onClick={onRotateLeft} disabled={disabled}>Rotate Left</button>
      <button type="button" className="btn btn-secondary" onClick={onRotateRight} disabled={disabled}>Rotate Right</button>
      <button type="button" className="btn btn-secondary" onClick={onBigger} disabled={disabled}>Bigger</button>
      <button type="button" className="btn btn-secondary" onClick={onSmaller} disabled={disabled}>Smaller</button>
      <button type="button" className="btn btn-secondary" onClick={onDelete} disabled={disabled}>Delete</button>
    </div>
  );
}
