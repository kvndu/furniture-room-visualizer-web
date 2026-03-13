import Button from "../common/Button";

export default function DesignToolbar({ onSave, onPreview, disabled = false }) {
  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <Button type="button" onClick={onSave} disabled={disabled}>Save Design</Button>
      <Button type="button" variant="secondary" onClick={onPreview} disabled={disabled}>Preview 3D</Button>
    </div>
  );
}
