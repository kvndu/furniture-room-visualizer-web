import { createContext, useEffect, useState } from "react";

export const DesignContext = createContext();

const DESIGN_KEY = "frv_designs_list";
const DRAFT_KEY = "frv_current_draft";

export function DesignProvider({ children }) {
  const [designs, setDesigns] = useState([]);
  const [draftDesign, setDraftDesignState] = useState(null);

  useEffect(() => {
    const savedDesigns = localStorage.getItem(DESIGN_KEY);
    const savedDraft = localStorage.getItem(DRAFT_KEY);

    if (savedDesigns) {
      setDesigns(JSON.parse(savedDesigns));
    }

    if (savedDraft) {
      setDraftDesignState(JSON.parse(savedDraft));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(DESIGN_KEY, JSON.stringify(designs));
  }, [designs]);

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
        String(design.id) === String(id) ? { ...design, ...updatedData } : design
      )
    );
  };

  const deleteDesign = (id) => {
    setDesigns((prev) => prev.filter((design) => String(design.id) !== String(id)));
  };

  const getDesignById = (id) => {
    return designs.find((design) => String(design.id) === String(id)) || null;
  };

  const setDraftDesign = (design) => {
    setDraftDesignState(design);
  };

  const clearDraftDesign = () => {
    setDraftDesignState(null);
  };

  return (
    <DesignContext.Provider
      value={{
        designs,
        draftDesign,
        addDesign,
        updateDesign,
        deleteDesign,
        getDesignById,
        setDraftDesign,
        clearDraftDesign
      }}
    >
      {children}
    </DesignContext.Provider>
  );
}