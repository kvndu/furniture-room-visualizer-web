export default function Input({ label, id, error, className = "", ...props }) {
  return (
    <label htmlFor={id} style={{ display: "grid", gap: "8px" }}>
      {label && <span style={{ fontWeight: 600, fontSize: "14px" }}>{label}</span>}
      <input id={id} className={`input ${className}`.trim()} {...props} />
      {error && <span style={{ color: "#dc2626", fontSize: "13px" }}>{error}</span>}
    </label>
  );
}
