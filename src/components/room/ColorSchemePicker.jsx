export default function ColorSchemePicker({ wallColor, floorColor, onChange }) {
  return (
    <div style={{ display: "grid", gap: "12px" }}>
      <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Wall Color</span>
        <input type="color" value={wallColor} onChange={(e) => onChange?.("wallColor", e.target.value)} />
      </label>
      <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Floor Color</span>
        <input type="color" value={floorColor} onChange={(e) => onChange?.("floorColor", e.target.value)} />
      </label>
    </div>
  );
}
