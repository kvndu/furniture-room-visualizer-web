export const roomLibrary = {
  LivingRoom: {
    label: "Living Room",
    categories: {
      Sofas: [],
      Chairs: [],
      Tables: [],
      Cabinets: [],
      Others: []
    }
  },

  Bedroom: {
    label: "Bedroom",
    categories: {
      Beds: [],
      Wardrobes: [],
      Tables: [],
      Others: []
    }
  },

  Kitchen: {
    label: "Kitchen",
    categories: {
      Cabinets: [],
      Appliances: [],
      Tables: [],
      Others: []
    }
  },

  Office: {
    label: "Office",
    categories: {
      Furniture: [],
      Others: []
    }
  },

  Bathroom: {
    label: "Bathroom",
    categories: {
      Fixtures: []
    }
  }
};

export const defaultFurnitureByRoom = {
  LivingRoom: [
    {
      id: 1,
      type: "Sofa 1",
      x: 0.8,
      y: 1.0,
      width: 1.8,
      depth: 0.8,
      height: 0.8,
      rotation: 0,
      color: "#60a5fa"
    }
  ],

  Bedroom: [
    {
      id: 1,
      type: "Bed 1",
      x: 1.0,
      y: 1.0,
      width: 1.6,
      depth: 2.0,
      height: 0.65,
      rotation: 0,
      color: "#2563eb"
    }
  ],

  Kitchen: [
    {
      id: 1,
      type: "Cabinet 1",
      x: 0.7,
      y: 0.7,
      width: 1.6,
      depth: 0.6,
      height: 0.9,
      rotation: 0,
      color: "#eab308"
    }
  ],

  Office: [
    {
      id: 1,
      type: "Furniture 1",
      x: 1.0,
      y: 1.2,
      width: 0.8,
      depth: 0.8,
      height: 1.0,
      rotation: 0,
      color: "#34d399"
    }
  ],

  Bathroom: [
    {
      id: 1,
      type: "Bathroom 1",
      x: 1.0,
      y: 1.2,
      width: 1.6,
      depth: 0.8,
      height: 0.6,
      rotation: 0,
      color: "#93c5fd"
    }
  ]
};