export const roomLibrary = {
  LivingRoom: {
    label: "Living Room",
    categories: {
      Seating: [
        { type: "Sofa", width: 1.8, depth: 0.8, height: 0.8, color: "#60a5fa" },
        { type: "Armchair", width: 0.9, depth: 0.9, height: 0.9, color: "#a78bfa" },
        { type: "Recliner", width: 1.0, depth: 1.0, height: 0.95, color: "#8b5cf6" },
        { type: "Loveseat", width: 1.4, depth: 0.8, height: 0.8, color: "#7c3aed" }
      ],
      Tables: [
        { type: "Coffee Table", width: 1.0, depth: 0.6, height: 0.45, color: "#34d399" },
        { type: "Side Table", width: 0.5, depth: 0.5, height: 0.5, color: "#10b981" },
        { type: "Console Table", width: 1.2, depth: 0.4, height: 0.75, color: "#22c55e" },
        { type: "Ottoman", width: 0.6, depth: 0.6, height: 0.45, color: "#16a34a" }
      ],
      Storage: [
        { type: "TV Cabinet", width: 1.6, depth: 0.45, height: 0.6, color: "#f59e0b" },
        { type: "Display Shelf", width: 0.7, depth: 0.35, height: 1.8, color: "#d97706" }
      ]
    }
  },

  Bedroom: {
    label: "Bedroom",
    categories: {
      Beds: [
        { type: "Single Bed", width: 1.0, depth: 2.0, height: 0.6, color: "#60a5fa" },
        { type: "Double Bed", width: 1.6, depth: 2.0, height: 0.65, color: "#2563eb" },
        { type: "Queen Bed", width: 1.8, depth: 2.0, height: 0.65, color: "#1d4ed8" },
        { type: "King Bed", width: 2.0, depth: 2.1, height: 0.7, color: "#1e40af" }
      ],
      Storage: [
        { type: "Wardrobe", width: 1.0, depth: 0.6, height: 2.0, color: "#f59e0b" },
        { type: "Sliding Wardrobe", width: 1.5, depth: 0.65, height: 2.1, color: "#fbbf24" },
        { type: "Dresser", width: 1.2, depth: 0.45, height: 0.8, color: "#34d399" }
      ],
      Accessories: [
        { type: "Night Stand", width: 0.5, depth: 0.5, height: 0.55, color: "#14b8a6" },
        { type: "Study Desk", width: 1.2, depth: 0.6, height: 0.75, color: "#06b6d4" },
        { type: "Study Chair", width: 0.5, depth: 0.5, height: 0.9, color: "#67e8f9" }
      ]
    }
  },

  Kitchen: {
    label: "Kitchen",
    categories: {
      Layouts: [
        { type: "Straight Kitchen", width: 2.4, depth: 0.6, height: 0.9, color: "#eab308" },
        { type: "L Shape Kitchen", width: 2.2, depth: 1.4, height: 0.9, color: "#facc15" },
        { type: "U Shape Kitchen", width: 2.6, depth: 1.8, height: 0.9, color: "#f59e0b" },
        { type: "Kitchen Island", width: 1.6, depth: 0.9, height: 0.9, color: "#d97706" }
      ],
      Appliances: [
        { type: "Fridge", width: 0.8, depth: 0.8, height: 1.9, color: "#93c5fd" },
        { type: "Sink", width: 1.0, depth: 0.6, height: 0.9, color: "#a78bfa" },
        { type: "Oven", width: 0.8, depth: 0.6, height: 0.9, color: "#818cf8" },
        { type: "Microwave", width: 0.6, depth: 0.45, height: 0.4, color: "#6366f1" },
        { type: "Dishwasher", width: 0.7, depth: 0.6, height: 0.9, color: "#8b5cf6" }
      ],
      Dining: [
        { type: "Dining Table", width: 1.4, depth: 0.9, height: 0.75, color: "#34d399" },
        { type: "Dining Chair", width: 0.5, depth: 0.5, height: 0.9, color: "#10b981" },
        { type: "Bar Table", width: 1.2, depth: 0.5, height: 1.0, color: "#22c55e" },
        { type: "Bar Stool", width: 0.4, depth: 0.4, height: 0.7, color: "#16a34a" }
      ]
    }
  },

  Office: {
    label: "Office",
    categories: {
      Workstations: [
        { type: "Office Desk", width: 1.4, depth: 0.7, height: 0.75, color: "#60a5fa" },
        { type: "Office Chair", width: 0.6, depth: 0.6, height: 1.0, color: "#34d399" },
        { type: "Computer Desk", width: 1.6, depth: 0.75, height: 0.75, color: "#3b82f6" },
        { type: "Corner Desk", width: 1.5, depth: 1.0, height: 0.75, color: "#2563eb" }
      ],
      Meeting: [
        { type: "Meeting Table", width: 1.8, depth: 1.0, height: 0.75, color: "#7c3aed" },
        { type: "Visitor Chair", width: 0.5, depth: 0.5, height: 0.9, color: "#8b5cf6" },
        { type: "Conference Table", width: 2.4, depth: 1.2, height: 0.75, color: "#6d28d9" }
      ],
      Storage: [
        { type: "Bookshelf", width: 0.8, depth: 0.35, height: 2.0, color: "#8b5cf6" },
        { type: "File Cabinet", width: 0.7, depth: 0.5, height: 1.1, color: "#a855f7" },
        { type: "Laptop Table", width: 0.8, depth: 0.45, height: 0.7, color: "#c084fc" }
      ]
    }
  },

  Bathroom: {
    label: "Bathroom",
    categories: {
      Fixtures: [
        { type: "Bathtub", width: 1.6, depth: 0.8, height: 0.6, color: "#93c5fd" },
        { type: "Toilet", width: 0.5, depth: 0.7, height: 0.8, color: "#e5e7eb" },
        { type: "Wash Basin", width: 0.7, depth: 0.5, height: 0.85, color: "#c4b5fd" },
        { type: "Shower Cabin", width: 1.0, depth: 1.0, height: 2.0, color: "#a5f3fc" }
      ],
      Storage: [
        { type: "Bathroom Cabinet", width: 0.9, depth: 0.35, height: 0.8, color: "#f59e0b" },
        { type: "Vanity Unit", width: 1.0, depth: 0.5, height: 0.85, color: "#fbbf24" }
      ]
    }
  },

  DiningRoom: {
    label: "Dining Room",
    categories: {
      DiningSets: [
        { type: "4 Seat Table", width: 1.2, depth: 0.8, height: 0.75, color: "#22c55e" },
        { type: "6 Seat Table", width: 1.6, depth: 0.9, height: 0.75, color: "#16a34a" },
        { type: "Round Dining Table", width: 1.2, depth: 1.2, height: 0.75, color: "#15803d" }
      ],
      Seating: [
        { type: "Dining Chair", width: 0.5, depth: 0.5, height: 0.9, color: "#4ade80" },
        { type: "Bench", width: 1.2, depth: 0.4, height: 0.45, color: "#65a30d" },
        { type: "Dining Bench", width: 1.3, depth: 0.4, height: 0.45, color: "#84cc16" }
      ],
      Storage: [
        { type: "Crockery Cabinet", width: 1.1, depth: 0.45, height: 1.9, color: "#f59e0b" },
        { type: "Sideboard", width: 1.4, depth: 0.45, height: 0.8, color: "#b45309" }
      ]
    }
  },

  KidsRoom: {
    label: "Kids Room",
    categories: {
      Beds: [
        { type: "Kids Bed", width: 1.0, depth: 1.8, height: 0.55, color: "#60a5fa" },
        { type: "Bunk Bed", width: 1.1, depth: 2.0, height: 1.7, color: "#2563eb" }
      ],
      Study: [
        { type: "Kids Desk", width: 1.0, depth: 0.5, height: 0.65, color: "#34d399" },
        { type: "Kids Chair", width: 0.4, depth: 0.4, height: 0.7, color: "#10b981" }
      ],
      Storage: [
        { type: "Toy Shelf", width: 1.0, depth: 0.35, height: 1.2, color: "#f59e0b" },
        { type: "Book Rack", width: 0.8, depth: 0.3, height: 1.4, color: "#fbbf24" }
      ],
      Play: [
        { type: "Play Mat", width: 1.4, depth: 1.0, height: 0.05, color: "#f472b6" },
        { type: "Bean Bag", width: 0.7, depth: 0.7, height: 0.6, color: "#ec4899" }
      ]
    }
  },

  Balcony: {
    label: "Balcony",
    categories: {
      Seating: [
        { type: "Swing Chair", width: 0.8, depth: 0.8, height: 1.2, color: "#8b5cf6" },
        { type: "Outdoor Chair", width: 0.5, depth: 0.5, height: 0.85, color: "#7c3aed" }
      ],
      Tables: [
        { type: "Outdoor Table", width: 0.8, depth: 0.6, height: 0.7, color: "#22c55e" },
        { type: "Tea Table", width: 0.5, depth: 0.5, height: 0.55, color: "#16a34a" }
      ],
      Decor: [
        { type: "Planter Box", width: 1.0, depth: 0.3, height: 0.4, color: "#65a30d" },
        { type: "Flower Pot", width: 0.35, depth: 0.35, height: 0.4, color: "#84cc16" }
      ]
    }
  }
};

export const defaultFurnitureByRoom = {
  LivingRoom: [
    { id: 1, type: "Sofa", x: 0.8, y: 1.0, width: 1.8, depth: 0.8, height: 0.8, rotation: 0, color: "#60a5fa" },
    { id: 2, type: "TV Cabinet", x: 3.5, y: 1.2, width: 1.6, depth: 0.45, height: 0.6, rotation: 0, color: "#f59e0b" }
  ],
  Bedroom: [
    { id: 1, type: "Double Bed", x: 1.0, y: 1.0, width: 1.6, depth: 2.0, height: 0.65, rotation: 0, color: "#2563eb" },
    { id: 2, type: "Wardrobe", x: 4.0, y: 0.8, width: 1.0, depth: 0.6, height: 2.0, rotation: 0, color: "#f59e0b" }
  ],
  Kitchen: [
    { id: 1, type: "Straight Kitchen", x: 0.7, y: 0.7, width: 2.4, depth: 0.6, height: 0.9, rotation: 0, color: "#eab308" },
    { id: 2, type: "Fridge", x: 4.2, y: 1.1, width: 0.8, depth: 0.8, height: 1.9, rotation: 0, color: "#93c5fd" }
  ],
  Office: [
    { id: 1, type: "Office Desk", x: 1.0, y: 1.2, width: 1.4, depth: 0.7, height: 0.75, rotation: 0, color: "#60a5fa" },
    { id: 2, type: "Office Chair", x: 2.8, y: 1.3, width: 0.6, depth: 0.6, height: 1.0, rotation: 0, color: "#34d399" }
  ],
  Bathroom: [
    { id: 1, type: "Bathtub", x: 1.0, y: 1.2, width: 1.6, depth: 0.8, height: 0.6, rotation: 0, color: "#93c5fd" },
    { id: 2, type: "Toilet", x: 3.1, y: 1.2, width: 0.5, depth: 0.7, height: 0.8, rotation: 0, color: "#e5e7eb" }
  ],
  DiningRoom: [
    { id: 1, type: "6 Seat Table", x: 1.2, y: 1.3, width: 1.6, depth: 0.9, height: 0.75, rotation: 0, color: "#16a34a" },
    { id: 2, type: "Dining Chair", x: 3.2, y: 1.5, width: 0.5, depth: 0.5, height: 0.9, rotation: 0, color: "#4ade80" }
  ],
  KidsRoom: [
    { id: 1, type: "Kids Bed", x: 1.0, y: 1.0, width: 1.0, depth: 1.8, height: 0.55, rotation: 0, color: "#60a5fa" },
    { id: 2, type: "Toy Shelf", x: 3.0, y: 1.1, width: 1.0, depth: 0.35, height: 1.2, rotation: 0, color: "#f59e0b" }
  ],
  Balcony: [
    { id: 1, type: "Swing Chair", x: 1.0, y: 1.2, width: 0.8, depth: 0.8, height: 1.2, rotation: 0, color: "#8b5cf6" },
    { id: 2, type: "Outdoor Table", x: 2.4, y: 1.4, width: 0.8, depth: 0.6, height: 0.7, rotation: 0, color: "#22c55e" }
  ]
};