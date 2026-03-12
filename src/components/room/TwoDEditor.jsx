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

  const getItemWidth = (item) => Number(item.width) || 1;
  const getItemDepth = (item) => Number(item.depth) || Number(item.length) || 1;

  const updateFurniture = (id, updates) => {
    setFurniture((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const addSelectedItem = () => {
    if (!selectedLibraryItem) return;

    const itemWidth = getItemWidth(selectedLibraryItem);
    const itemDepth = getItemDepth(selectedLibraryItem);

    const newItem = {
      id: Date.now() + Math.random(),
      type: selectedLibraryItem.type,
      width: itemWidth,
      depth: itemDepth,
      height: selectedLibraryItem.height || 1,
      color: selectedLibraryItem.color || "#94a3b8",
      rotation: 0,
      x: clamp(
        roomWidth / 2 - itemWidth / 2,
        0,
        Math.max(0, roomWidth - itemWidth)
      ),
      y: clamp(
        roomLength / 2 - itemDepth / 2,
        0,
        Math.max(0, roomLength - itemDepth)
      )
    };

    setFurniture((prev) => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  const addDroppedItem = (libraryItem, dropX, dropY) => {
    if (!libraryItem || !boardRef.current) return;

    const itemWidth = getItemWidth(libraryItem);
    const itemDepth = getItemDepth(libraryItem);

    const xInMeters = dropX / scale - itemWidth / 2;
    const yInMeters = dropY / scale - itemDepth / 2;

    const newItem = {
      id: Date.now() + Math.random(),
      type: libraryItem.type,
      width: itemWidth,
      depth: itemDepth,
      height: libraryItem.height || 1,
      color: libraryItem.color || "#94a3b8",
      rotation: 0,
      x: clamp(xInMeters, 0, Math.max(0, roomWidth - itemWidth)),
      y: clamp(yInMeters, 0, Math.max(0, roomLength - itemDepth))
    };

    setFurniture((prev) => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setFurniture((prev) => prev.filter((item) => item.id !== selectedId));
    setSelectedId(null);
  };

  const rotateSelected = (direction = "right") => {
    if (!selectedItem) return;

    const step = direction === "left" ? -15 : 15;
    const nextRotation =
      (((selectedItem.rotation || 0) + step) % 360 + 360) % 360;

    updateFurniture(selectedItem.id, {
      rotation: nextRotation
    });
  };

  const resizeSelected = (direction) => {
    if (!selectedItem) return;

    const step = direction === "increase" ? 0.1 : -0.1;
    const nextWidth = Math.max(
      0.3,
      Number((getItemWidth(selectedItem) + step).toFixed(2))
    );
    const nextDepth = Math.max(
      0.3,
      Number((getItemDepth(selectedItem) + step).toFixed(2))
    );

    updateFurniture(selectedItem.id, {
      width: nextWidth,
      depth: nextDepth,
      x: clamp(selectedItem.x, 0, Math.max(0, roomWidth - nextWidth)),
      y: clamp(selectedItem.y, 0, Math.max(0, roomLength - nextDepth))
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
    const itemPixelWidth = getItemWidth(item) * scale;
    const itemPixelHeight = getItemDepth(item) * scale;

    dragRef.current = {
      id: item.id,
      offsetX: clamp(e.clientX - boardRect.left - itemLeft, 0, itemPixelWidth),
      offsetY: clamp(e.clientY - boardRect.top - itemTop, 0, itemPixelHeight)
    };

    setSelectedId(item.id);
  };

  const handleBoardDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleBoardDrop = (e) => {
    e.preventDefault();

    if (!boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const dropX = e.clientX - boardRect.left;
    const dropY = e.clientY - boardRect.top;

    let droppedItem = null;

    try {
      const raw = e.dataTransfer.getData("application/json");
      if (raw) {
        droppedItem = JSON.parse(raw);
      }
    } catch (error) {
      console.error("Failed to parse dragged item:", error);
    }

    if (!droppedItem && selectedLibraryItem) {
      droppedItem = selectedLibraryItem;
    }

    if (!droppedItem) return;

    addDroppedItem(droppedItem, dropX, dropY);
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!dragRef.current || !boardRef.current) return;

      const boardRect = boardRef.current.getBoundingClientRect();
      const target = furniture.find((item) => item.id === dragRef.current.id);
      if (!target) return;

      const targetWidth = getItemWidth(target);
      const targetDepth = getItemDepth(target);

      const newX =
        (e.clientX - boardRect.left - dragRef.current.offsetX) / scale;
      const newY =
        (e.clientY - boardRect.top - dragRef.current.offsetY) / scale;

      updateFurniture(target.id, {
        x: clamp(newX, 0, Math.max(0, roomWidth - targetWidth)),
        y: clamp(newY, 0, Math.max(0, roomLength - targetDepth))
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
        <button
          type="button"
          className="btn"
          onClick={addSelectedItem}
          disabled={!selectedLibraryItem}
        >
          Add Selected Item
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={deleteSelected}
          disabled={!selectedItem}
        >
          Delete Selected
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => rotateSelected("left")}
          disabled={!selectedItem}
        >
          Rotate Left
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => rotateSelected("right")}
          disabled={!selectedItem}
        >
          Rotate Right
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => resizeSelected("increase")}
          disabled={!selectedItem}
        >
          Bigger
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => resizeSelected("decrease")}
          disabled={!selectedItem}
        >
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
          onDragOver={handleBoardDragOver}
          onDrop={handleBoardDrop}
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
                width: `${getItemWidth(item) * scale}px`,
                height: `${getItemDepth(item) * scale}px`,
                background: item.color,
                borderRadius: "8px",
                border:
                  selectedId === item.id
                    ? "3px solid #ef4444"
                    : "1px solid #334155",
                transform: `rotate(${item.rotation || 0}deg)`,
                transformOrigin: "center center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0f172a",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "move",
                userSelect: "none",
                boxShadow:
                  selectedId === item.id
                    ? "0 10px 18px rgba(239,68,68,0.18)"
                    : "0 8px 14px rgba(15,23,42,0.12)"
              }}
            >
              <span style={{ textAlign: "center", padding: "4px" }}>
                {item.type}
              </span>
            </div>
          ))}

          {furniture.length === 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                fontWeight: 600,
                pointerEvents: "none"
              }}
            >
              Drag furniture here
            </div>
          )}
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