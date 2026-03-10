import { createContext, useEffect, useState } from "react";

export const DesignContext = createContext();

const DESIGN_KEY = "frv_designs_list";

export function DesignProvider({ children }) {
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(DESIGN_KEY);
    if (saved) {
      setDesigns(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(DESIGN_KEY, JSON.stringify(designs));
  }, [designs]);

  const addDesign = (design) => {
    const newDesign = {
      id: Date.now(),
      createdAt: new Date().toLocaleString(),
      ...design
    };
    setDesigns((prev) => [...prev, newDesign]);
  };

  const updateDesign = (id, updatedData) => {
    setDesigns((prev) =>
      prev.map((design) =>
        design.id === id ? { ...design, ...updatedData } : design
      )
    );
  };

  const deleteDesign = (id) => {
    setDesigns((prev) => prev.filter((design) => design.id !== id));
  };

  return (
    <DesignContext.Provider
      value={{ designs, addDesign, updateDesign, deleteDesign }}
    >
      {children}
    </DesignContext.Provider>
  );
}