export default function Button({ children, className = "", variant = "primary", ...props }) {
  const variantClass = variant === "secondary" ? "btn btn-secondary" : "btn";
  return (
    <button className={`${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
