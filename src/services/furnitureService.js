import { supabase } from "../lib/supabase";

const fallbackFurniture = {
  LivingRoom: {
    Sofas: [
      { id: "lr-sofa-1", type: "Corner Sofa", width: 2.2, depth: 0.9, height: 0.85, color: "#60a5fa" },
      { id: "lr-sofa-2", type: "Loveseat", width: 1.6, depth: 0.85, height: 0.8, color: "#3b82f6" }
    ],
    Chairs: [
      { id: "lr-chair-1", type: "Accent Chair", width: 0.8, depth: 0.8, height: 0.9, color: "#f59e0b" }
    ],
    Tables: [
      { id: "lr-table-1", type: "Coffee Table", width: 1.2, depth: 0.6, height: 0.45, color: "#c084fc" }
    ],
    Cabinets: [
      { id: "lr-cabinet-1", type: "TV Unit", width: 1.8, depth: 0.45, height: 0.55, color: "#34d399" }
    ],
    Others: [
      { id: "lr-rug-1", type: "Console", width: 1.1, depth: 0.4, height: 0.8, color: "#94a3b8" }
    ]
  },
  Bedroom: {
    Beds: [
      { id: "br-bed-1", type: "Queen Bed", width: 1.8, depth: 2.0, height: 0.65, color: "#2563eb" }
    ],
    Wardrobes: [
      { id: "br-wardrobe-1", type: "Wardrobe", width: 1.5, depth: 0.6, height: 2.1, color: "#64748b" }
    ],
    Tables: [
      { id: "br-table-1", type: "Bedside Table", width: 0.5, depth: 0.45, height: 0.5, color: "#eab308" }
    ],
    Others: [
      { id: "br-bench-1", type: "Bench", width: 1.1, depth: 0.45, height: 0.5, color: "#8b5cf6" }
    ]
  },
  Kitchen: {
    Cabinets: [
      { id: "kt-cab-1", type: "Base Cabinet", width: 1.8, depth: 0.6, height: 0.9, color: "#eab308" },
      { id: "kt-cab-2", type: "Wall Cabinet", width: 1.2, depth: 0.4, height: 0.8, color: "#facc15" }
    ],
    Appliances: [
      { id: "kt-app-1", type: "Fridge", width: 0.9, depth: 0.8, height: 1.9, color: "#cbd5e1" },
      { id: "kt-app-2", type: "Oven Unit", width: 0.7, depth: 0.6, height: 0.9, color: "#94a3b8" }
    ],
    Tables: [
      { id: "kt-table-1", type: "Dining Table", width: 1.5, depth: 0.9, height: 0.75, color: "#c084fc" }
    ],
    Others: [
      { id: "kt-island-1", type: "Island", width: 1.6, depth: 0.8, height: 0.95, color: "#fb7185" }
    ]
  },
  Office: {
    Furniture: [
      { id: "of-desk-1", type: "Office Desk", width: 1.4, depth: 0.7, height: 0.75, color: "#34d399" },
      { id: "of-chair-1", type: "Office Chair", width: 0.7, depth: 0.7, height: 1.1, color: "#10b981" }
    ],
    Others: [
      { id: "of-shelf-1", type: "Book Shelf", width: 1.0, depth: 0.35, height: 1.8, color: "#64748b" }
    ]
  },
  Bathroom: {
    Fixtures: [
      { id: "ba-fixture-1", type: "Bathtub", width: 1.7, depth: 0.8, height: 0.6, color: "#93c5fd" },
      { id: "ba-fixture-2", type: "Vanity", width: 1.0, depth: 0.55, height: 0.85, color: "#38bdf8" }
    ]
  }
};

function withImageUrl(item) {
  if (!item.image_path) {
    return item;
  }

  const { data } = supabase.storage.from("furniture-images").getPublicUrl(item.image_path);
  return { ...item, image: data.publicUrl };
}

function getFallbackItems(roomType, category) {
  return fallbackFurniture?.[roomType]?.[category] || [];
}

export async function getFurnitureItems(roomType, category) {
  try {
    let query = supabase.from("furniture_items").select("*").order("id", { ascending: true });

    if (roomType) {
      query = query.eq("room_type", roomType);
    }

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    const mapped = (data || []).map(withImageUrl);
    return mapped.length > 0 ? mapped : getFallbackItems(roomType, category);
  } catch (error) {
    console.warn("Using fallback furniture items:", error);
    return getFallbackItems(roomType, category);
  }
}
