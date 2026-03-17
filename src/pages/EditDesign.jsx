import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DESIGNS_KEY = "savedDesigns";

function readSavedDesign(id) {
  try {
    const raw = localStorage.getItem(DESIGNS_KEY);
    const items = raw ? JSON.parse(raw) : [];
    return Array.isArray(items) ? items.find((item) => String(item?.id) === String(id)) || null : null;
  } catch {
    return null;
  }
}

export default function EditDesign() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const design = readSavedDesign(id);
    if (design) {
      navigate("/create-design", { replace: true, state: { design } });
      return;
    }
    navigate("/dashboard", { replace: true });
  }, [id, navigate]);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8fafc" }}>
      <div style={{ background: "#ffffff", padding: "24px", borderRadius: "18px", border: "1px solid #dbe2ea" }}>
        Redirecting to the selected design...
      </div>
    </div>
  );
}
