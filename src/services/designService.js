const DESIGN_KEY = "frv_designs_list";

export function loadDesigns() {
  try {
    const raw = localStorage.getItem(DESIGN_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to load designs:", error);
    return [];
  }
}

export function saveDesigns(designs) {
  localStorage.setItem(DESIGN_KEY, JSON.stringify(designs));
}
