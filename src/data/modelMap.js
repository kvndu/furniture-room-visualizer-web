export const MODEL_MAP = {
  "Queen Bed": "beds/bedDouble.glb",
  "Single Bed": "beds/bedSingle.glb",

  Wardrobe: "wardrobes/bookcaseClosed.glb",
  "Sliding Wardrobe": "wardrobes/bookcaseClosedWide.glb",

  "Dining Table": "tables/table.glb",
  "Coffee Table": "tables/tableCoffee.glb",
  "Work Desk": "home-equipment/desk.glb",

  "Office Chair": "home-equipment/chairModernCushion.glb",
  Bookshelf: "wardrobes/bookcaseOpen.glb",
  "Side Cabinet": "cabinets/cabinetTelevision.glb",

  Lamp: "home-equipment/lampSquareFloor.glb",
  Mirror: "other/bathroomMirror.glb",
  Plant: "details/pottedPlant.glb",

  Bench: "wardrobes/bench.glb",
  "Storage Box": "home-equipment/cardboardBoxClosed.glb",

  "L Kitchen": "kitchens/kitchenCabinetCornerInner.glb",
  "Straight Kitchen": "kitchens/kitchenCabinet.glb",
  "Island Kitchen": "kitchens/kitchenBar.glb",

  "Base Cabinet": "kitchens/kitchenCabinet.glb",
  "Wall Cabinet": "kitchens/kitchenCabinetUpper.glb",
  "TV Unit": "cabinets/cabinetTelevision.glb"
};

export function withModel(type, item) {
  return {
    ...item,
    model: MODEL_MAP[type] || null
  };
}