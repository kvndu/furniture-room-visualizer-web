import FurnitureCard from "./FurnitureCard";

export default function FurnitureList({ items = [], selectedItem, onSelect, onDragStart }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
      {items.map((item) => (
        <FurnitureCard
          key={item.id || item.type}
          item={item}
          selected={selectedItem?.type === item.type}
          onSelect={onSelect}
          onDragStart={onDragStart}
        />
      ))}
    </div>
  );
}
