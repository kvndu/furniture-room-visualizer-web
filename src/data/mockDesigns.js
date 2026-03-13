export const mockDesigns = [
  {
    id: 1001,
    roomName: "Modern Kitchen Draft",
    roomType: "Kitchen",
    width: 6,
    length: 5,
    height: 3,
    wallColor: "#dbeafe",
    floorColor: "#d6c3a5",
    furnitureCount: 2,
    furniture: [
      { id: 1, type: "Base Cabinet", x: 0.5, y: 0.5, width: 1.8, depth: 0.6, height: 0.9, rotation: 0, color: "#eab308" },
      { id: 2, type: "Dining Table", x: 2.5, y: 2, width: 1.4, depth: 0.8, height: 0.75, rotation: 0, color: "#c084fc" }
    ],
    createdAt: new Date().toLocaleString()
  }
];
