import { useEffect, useMemo, useRef, useState } from "react";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function TwoDEditor({
  form,
  furniture,
  setFurniture,
  selectedLibraryItem,
  onPreview3D
}) {
  const boardRef = useRef(null);
  const dragRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);

  const roomWidth = Number(form.width) > 0 ? Number(form.width) : 6;
  const roomLength = Number(form.length) > 0 ? Number(form.length) : 5;

  const scale = useMemo(() => {
    const scaleX = 700 / roomWidth;
    const scaleY = 420 / roomLength;
    return Math.min(scaleX, scaleY, 90);
  }, [roomWidth, roomLength]);

  const boardPixelWidth = roomWidth * scale;
  const boardPixelHeight = roomLength * scale;

  const selectedItem = useMemo(
    () => furniture.find((item) => item.id === selectedId) || null,
    [furniture, selectedId]
  );

  const updateFurniture = (id, updates) => {
    setFurniture((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const addSelectedItem = () => {
    if (!selectedLibraryItem) return;

    const newItem = {
      id: Date.now(),
      type: selectedLibraryItem.type,
      width: selectedLibraryItem.width,
      depth: selectedLibraryItem.depth,
      height: selectedLibraryItem.height,
      color: selectedLibraryItem.color,
      rotation: 0,
      x: clamp(roomWidth / 2 - selectedLibraryItem.width / 2, 0, Math.max(0, roomWidth - selectedLibraryItem.width)),
      y: clamp(roomLength / 2 - selectedLibraryItem.depth / 2, 0, Math.max(0, roomLength - selectedLibraryItem.depth))
    };

    setFurniture((prev) => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setFurniture((prev) => prev.filter((item) => item.id !== selectedId));
    setSelectedId(null);
  };

  const rotateSelected = () => {
    if (!selectedItem) return;
    updateFurniture(selectedItem.id, {
      rotation: (selectedItem.rotation + 15) % 360
    });
  };

  const resizeSelected = (direction) => {
    if (!selectedItem) return;

    const step = direction === "increase" ? 0.1 : -0.1;
    updateFurniture(selectedItem.id, {
      width: Math.max(0.3, Number((selectedItem.width + step).toFixed(2))),
      depth: Math.max(0.3, Number((selectedItem.depth + step).toFixed(2)))
    });
  };

  const recolorSelected = (e) => {
    if (!selectedItem) return;
    updateFurniture(selectedItem.id, { color: e.target.value });
  };

  const startDrag = (e, item) => {
    if (!boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const itemLeft = item.x * scale;
    const itemTop = item.y * scale;

    dragRef.current = {
      id: item.id,
      offsetX: e.clientX - boardRect.left - itemLeft,
      offsetY: e.clientY - boardRect.top - itemTop
    };

    setSelectedId(item.id);
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!dragRef.current || !boardRef.current) return;

      const boardRect = boardRef.current.getBoundingClientRect();
      const target = furniture.find((item) => item.id === dragRef.current.id);
      if (!target) return;

      const newX =
        (e.clientX - boardRect.left - dragRef.current.offsetX) / scale;
      const newY =
        (e.clientY - boardRect.top - dragRef.current.offsetY) / scale;

      updateFurniture(target.id, {
        x: clamp(newX, 0, Math.max(0, roomWidth - target.width)),
        y: clamp(newY, 0, Math.max(0, roomLength - target.depth))
      });
    };

    const handleUp = () => {
      dragRef.current = null;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [furniture, roomWidth, roomLength, scale]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "14px"
        }}
      >
        <button type="button" className="btn" onClick={addSelectedItem} disabled={!selectedLibraryItem}>
          Add Selected Item
        </button>
        <button type="button" className="btn btn-secondary" onClick={deleteSelected}>
          Delete Selected
        </button>
        <button type="button" className="btn btn-secondary" onClick={rotateSelected}>
          Rotate
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => resizeSelected("increase")}>
          Bigger
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => resizeSelected("decrease")}>
          Smaller
        </button>
        <input
          type="color"
          value={selectedItem?.color || "#000000"}
          onChange={recolorSelected}
          disabled={!selectedItem}
          style={{
            width: "46px",
            height: "40px",
            borderRadius: "10px",
            border: "1px solid #cbd5e1",
            background: "#fff"
          }}
        />
        <button type="button" className="btn" onClick={onPreview3D}>
          Preview in 3D
        </button>
      </div>

      <div
        style={{
          padding: "14px",
          border: "2px dashed #cbd5e1",
          borderRadius: "18px",
          background: "#f8fafc"
        }}
      >
        <div
          ref={boardRef}
          style={{
            position: "relative",
            width: `${boardPixelWidth}px`,
            height: `${boardPixelHeight}px`,
            margin: "0 auto",
            background: form.wallColor,
            border: "3px solid #94a3b8",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)"
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.18) 1px, transparent 1px)",
              backgroundSize: `${scale}px ${scale}px`,
              pointerEvents: "none"
            }}
          />

          {furniture.map((item) => (
            <div
              key={item.id}
              onMouseDown={(e) => startDrag(e, item)}
              onClick={() => setSelectedId(item.id)}
              style={{
                position: "absolute",
                left: `${item.x * scale}px`,
                top: `${item.y * scale}px`,
                width: `${item.width * scale}px`,
                height: `${item.depth * scale}px`,
                background: item.color,
                borderRadius: "8px",
                border: selectedId === item.id ? "3px solid #ef4444" : "1px solid #334155",
                transform: `rotate(${item.rotation}deg)`,
                transformOrigin: "center center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0f172a",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "move",
                userSelect: "none",
                boxShadow: selectedId === item.id
                  ? "0 10px 18px rgba(239,68,68,0.18)"
                  : "0 8px 14px rgba(15,23,42,0.12)"
              }}
            >
              <span style={{ textAlign: "center", padding: "4px" }}>{item.type}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "12px",
            display: "flex",
            justifyContent: "space-between",
            color: "#64748b",
            fontSize: "13px"
          }}
        >
          <span>Top View 2D Editor</span>
          <span>
            Room: {roomWidth}m × {roomLength}m
          </span>
        </div>
      </div>
    </div>
  );
}