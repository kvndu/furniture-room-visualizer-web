export function hexToRgba(hex, alpha = 1) {
  const clean = String(hex).replace("#", "");
  const value = clean.length === 3
    ? clean.split("").map((char) => char + char).join("")
    : clean;

  const int = parseInt(value, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
