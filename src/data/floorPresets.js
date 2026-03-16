import floorTilesA from "../assets/textures/floor-tiles.jpg";
import floorTilesB from "../assets/textures/floor-tiles-2.jpg";
import floorWoodA from "../assets/textures/floor-wood-1.jpg";
import floorMarbleA from "../assets/textures/floor-marble-1.jpg";

export const FLOOR_PRESETS = [
  {
    id: "tiles-beige",
    name: "Beige Tiles",
    texture: floorTilesA,
    preview: floorTilesA,
    repeatX: 2.4,
    repeatY: 2.4
  },
  {
    id: "tiles-soft",
    name: "Soft Tiles",
    texture: floorTilesB,
    preview: floorTilesB,
    repeatX: 2.2,
    repeatY: 2.2
  },
  {
    id: "wood-oak",
    name: "Oak Wood",
    texture: floorWoodA,
    preview: floorWoodA,
    repeatX: 3.4,
    repeatY: 3.4
  },
  {
    id: "marble-light",
    name: "Light Marble",
    texture: floorMarbleA,
    preview: floorMarbleA,
    repeatX: 2.8,
    repeatY: 2.8
  }
];

export function getFloorPresetById(id) {
  return FLOOR_PRESETS.find((item) => item.id === id) || FLOOR_PRESETS[0];
}