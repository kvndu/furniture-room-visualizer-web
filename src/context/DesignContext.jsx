import { createContext, useEffect, useMemo, useState } from "react";
import { mockDesigns } from "../data/mockDesigns";
import { loadDesigns, saveDesigns } from "../services/designService";

export const DesignContext = createContext();

const DRAFT_KEY = "frv_current_draft";

export function DesignProvider({ children }) {
  const [designs, setDesigns] = useState([]);
  const [draftDesign, setDraftDesignState] = useState(null);
  const [designsReady, setDesignsReady] = useState(false);

  useEffect(() => {
    const savedDesigns = loadDesigns();
    const savedDraft = localStorage.getItem(DRAFT_KEY);

    setDesigns(savedDesigns.length > 0 ? savedDesigns : mockDesigns);

    if (savedDraft) {
      try {
        setDraftDesignState(JSON.parse(savedDraft));
      } catch (error) {
        console.error("Failed to restore draft design:", error);
        localStorage.removeItem(DRAFT_KEY);
      }
    }

    setDesignsReady(true);
  }, []);

  useEffect(() => {
    if (!designsReady) return;
    saveDesigns(designs);
  }, [designs, designsReady]);

  useEffect(() => {
    if (draftDesign) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftDesign));
    } else {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, [draftDesign]);

  const addDesign = (design) => {
    const newDesign = {
      id: Date.now(),
      createdAt: new Date().toLocaleString(),
      ...design
    };
    setDesigns((prev) => [...prev, newDesign]);
    return newDesign;
  };

  const updateDesign = (id, updatedData) => {
    setDesigns((prev) =>
      prev.map((design) =>
        String(design.id) === String(id)
          ? { ...design, ...updatedData, updatedAt: new Date().toLocaleString() }
          : design
      )
    );
  };

  const deleteDesign = (id) => {
    setDesigns((prev) => prev.filter((design) => String(design.id) !== String(id)));
  };

  const getDesignById = (id) => designs.find((design) => String(design.id) === String(id)) || null;

  const setDraftDesign = (design) => setDraftDesignState(design);
  const clearDraftDesign = () => setDraftDesignState(null);

  const value = useMemo(() => ({
    designs,
    draftDesign,
    designsReady,
    addDesign,
    updateDesign,
    deleteDesign,
    getDesignById,
    setDraftDesign,
    clearDraftDesign
  }), [designs, draftDesign, designsReady]);

  return <DesignContext.Provider value={value}>{children}</DesignContext.Provider>;
}
