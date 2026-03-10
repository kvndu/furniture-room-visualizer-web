import { Stage, Layer, Rect, Text, Group, Line, Circle } from "react-konva";
import { useEffect, useMemo, useState } from "react";

const defaultFurnitureByRoom = {
  LivingRoom: [
    { id: 1, x: 300, y: 220, width: 90, height: 50, color: "#60a5fa", name: "Sofa", rotation: 0 },
    { id: 2, x: 430, y: 250, width: 100, height: 35, color: "#f59e0b", name: "TV Cabinet", rotation: 0 }
  ],
  Bedroom: [
    { id: 1, x: 300, y: 210, width: 100, height: 130, color: "#2563eb", name: "Double Bed", rotation: 0 },
    { id: 2, x: 450, y: 220, width: 45, height: 90, color: "#f59e0b", name: "Wardrobe", rotation: 0 }
  ],
  Kitchen: [
    { id: 1, x: 280, y: 190, width: 120, height: 35, color: "#eab308", name: "Straight Kitchen", rotation: 0 },
    { id: 2, x: 430, y: 230, width: 45, height: 80, color: "#93c5fd", name: "Fridge", rotation: 0 }
  ],
  Office: [
    { id: 1, x: 290, y: 220, width: 90, height: 45, color: "#60a5fa", name: "Office Desk", rotation: 0 },
    { id: 2, x: 410, y: 220, width: 45, height: 45, color: "#34d399", name: "Office Chair", rotation: 0 }
  ],
  Bathroom: [
    { id: 1, x: 300, y: 220, width: 90, height: 50, color: "#93c5fd", name: "Bathtub", rotation: 0 },
    { id: 2, x: 430, y: 230, width: 35, height: 45, color: "#e5e7eb", name: "Toilet", rotation: 0 }
  ],
  DiningRoom: [
    { id: 1, x: 300, y: 220, width: 100, height: 65, color: "#16a34a", name: "6 Seat Table", rotation: 0 },
    { id: 2, x: 430, y: 235, width: 35, height: 35, color: "#4ade80", name: "Dining Chair", rotation: 0 }
  ],
  KidsRoom: [
    { id: 1, x: 300, y: 210, width: 70, height: 100, color: "#60a5fa", name: "Kids Bed", rotation: 0 },
    { id: 2, x: 410, y: 220, width: 55, height: 65, color: "#f59e0b", name: "Toy Shelf", rotation: 0 }
  ],
  Balcony: [
    { id: 1, x: 310, y: 225, width: 45, height: 45, color: "#8b5cf6", name: "Swing Chair", rotation: 0 },
    { id: 2, x: 410, y: 230, width: 55, height: 40, color: "#22c55e", name: "Outdoor Table", rotation: 0 }
  ]
};

export default function RoomViewer3D({
  roomType = "Kitchen",
  wallColor = "#dbeafe",
  onFurnitureCountChange,
  selectedLibraryItem
}) {
  const [furniture, setFurniture] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const defaults = defaultFurnitureByRoom[roomType] || [];
    setFurniture(defaults);
    setSelectedId(null);

    if (onFurnitureCountChange) {
      onFurnitureCountChange(defaults.length);
    }
  }, [roomType, onFurnitureCountChange]);

  const selectedItem = useMemo(() => {
    return furniture.find((item) => item.id === selectedId) || null;
  }, [furniture, selectedId]);

  const updateFurniture = (id, updates) => {
    setFurniture((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleDrag = (id, e) => {
    updateFurniture(id, {
      x: e.target.x(),
      y: e.target.y()
    });
  };

  const addSelectedLibraryItem = () => {
    if (!selectedLibraryItem) return;

    const newItem = {
      id: Date.now(),
      x: 360,
      y: 260,
      width: selectedLibraryItem.width,
      height: selectedLibraryItem.height,
      color: selectedLibraryItem.color,
      name: selectedLibraryItem.type,
      rotation: 0
    };

    const updated = [...furniture, newItem];
    setFurniture(updated);
    setSelectedId(newItem.id);

    if (onFurnitureCountChange) {
      onFurnitureCountChange(updated.length);
    }
  };

  const deleteSelected = () => {
    if (!selectedId) return;

    const updated = furniture.filter((item) => item.id !== selectedId);
    setFurniture(updated);
    setSelectedId(null);

    if (onFurnitureCountChange) {
      onFurnitureCountChange(updated.length);
    }
  };

  const handleRotate = () => {
    if (!selectedItem) return;

    updateFurniture(selectedItem.id, {
      rotation: (selectedItem.rotation + 15) % 360
    });
  };

  const handleResize = (type) => {
    if (!selectedItem) return;

    const step = type === "increase" ? 10 : -10;

    updateFurniture(selectedItem.id, {
      width: Math.max(25, selectedItem.width + step),
      height: Math.max(25, selectedItem.height + step)
    });
  };

  const handleColorChange = (e) => {
    if (!selectedItem) return;

    updateFurniture(selectedItem.id, {
      color: e.target.value
    });
  };

  return (
    <div className="three-preview-wrapper">
      <div className="three-preview-toolbar">
        <button
          type="button"
          className="btn"
          onClick={addSelectedLibraryItem}
          disabled={!selectedLibraryItem}
        >
          Add Selected Item
        </button>

        <button type="button" className="btn btn-secondary" onClick={deleteSelected}>
          Delete Selected
        </button>

        <button type="button" className="btn btn-secondary" onClick={handleRotate}>
          Rotate
        </button>

        <button type="button" className="btn btn-secondary" onClick={() => handleResize("increase")}>
          Bigger
        </button>

        <button type="button" className="btn btn-secondary" onClick={() => handleResize("decrease")}>
          Smaller
        </button>

        <input
          type="color"
          value={selectedItem?.color || "#000000"}
          onChange={handleColorChange}
          disabled={!selectedItem}
          className="preview-color-input"
        />
      </div>

      <div className="three-preview-stage-shell">
        <div className="three-floating-tools">
          <button type="button" className="floating-tool-btn">⤢</button>
          <button type="button" className="floating-tool-btn">◐</button>
          <button type="button" className="floating-tool-btn">⌘</button>
          <button type="button" className="floating-tool-btn">☼</button>
          <button type="button" className="floating-tool-btn active">3D</button>
          <button type="button" className="floating-tool-btn">⊞</button>
          <button type="button" className="floating-tool-btn axis-x">X</button>
          <button type="button" className="floating-tool-btn axis-y">Y</button>
          <button type="button" className="floating-tool-btn axis-z">Z</button>
        </div>

        <Stage width={980} height={620}>
          <Layer>
            <Rect
              x={0}
              y={0}
              width={980}
              height={620}
              fill="#d9d9d9"
            />

            <Line
              points={[490, 310, 490, 255]}
              stroke="#22c55e"
              strokeWidth={2}
            />
            <Line
              points={[490, 310, 545, 340]}
              stroke="#f97316"
              strokeWidth={2}
            />
            <Line
              points={[490, 310, 435, 340]}
              stroke="#2563eb"
              strokeWidth={2}
            />
            <Circle x={490} y={310} radius={3} fill="#ef4444" />

            {furniture.map((item) => (
              <Group
                key={item.id}
                x={item.x}
                y={item.y}
                rotation={item.rotation}
                draggable
                onClick={() => setSelectedId(item.id)}
                onTap={() => setSelectedId(item.id)}
                onDragEnd={(e) => handleDrag(item.id, e)}
              >
                <Rect
                  width={item.width}
                  height={item.height}
                  fill={item.color}
                  cornerRadius={6}
                  stroke={selectedId === item.id ? "#ef4444" : "#475569"}
                  strokeWidth={selectedId === item.id ? 3 : 1}
                  shadowBlur={selectedId === item.id ? 8 : 2}
                  shadowOpacity={0.18}
                />
                <Text
                  x={6}
                  y={item.height / 2 - 7}
                  text={item.name}
                  fontSize={12}
                  fill="black"
                />
              </Group>
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}