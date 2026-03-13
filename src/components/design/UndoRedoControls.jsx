export default function UndoRedoControls({ onUndo, onRedo, canUndo, canRedo }) {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <button type="button" className="btn btn-secondary" onClick={onUndo} disabled={!canUndo}>Undo</button>
      <button type="button" className="btn btn-secondary" onClick={onRedo} disabled={!canRedo}>Redo</button>
    </div>
  );
}
