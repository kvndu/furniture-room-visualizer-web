import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDesign } from "../hooks/useDesign";
import RoomViewer3D from "../components/room/RoomViewer3D";

const roomLibrary = {
  LivingRoom: {
    label: "Living Room",
    categories: {
      Seating: [
        { type: "Sofa", width: 90, height: 50, color: "#60a5fa" },
        { type: "Armchair", width: 50, height: 50, color: "#a78bfa" },
        { type: "Recliner", width: 55, height: 55, color: "#8b5cf6" },
        { type: "Loveseat", width: 75, height: 45, color: "#7c3aed" }
      ],
      Tables: [
        { type: "Coffee Table", width: 60, height: 40, color: "#34d399" },
        { type: "Side Table", width: 40, height: 40, color: "#10b981" },
        { type: "Console Table", width: 80, height: 30, color: "#22c55e" },
        { type: "Ottoman", width: 35, height: 35, color: "#16a34a" }
      ],
      Storage: [
        { type: "TV Cabinet", width: 100, height: 35, color: "#f59e0b" },
        { type: "Display Shelf", width: 45, height: 90, color: "#d97706" },
        { type: "Book Cabinet", width: 50, height: 85, color: "#b45309" }
      ],
      Decor: [
        { type: "Floor Lamp", width: 25, height: 25, color: "#facc15" },
        { type: "Plant", width: 30, height: 30, color: "#16a34a" },
        { type: "Wall Art", width: 50, height: 25, color: "#94a3b8" }
      ]
    }
  },

  Bedroom: {
    label: "Bedroom",
    categories: {
      Beds: [
        { type: "Single Bed", width: 70, height: 110, color: "#60a5fa" },
        { type: "Double Bed", width: 100, height: 130, color: "#2563eb" },
        { type: "Queen Bed", width: 110, height: 140, color: "#1d4ed8" },
        { type: "King Bed", width: 120, height: 145, color: "#1e40af" }
      ],
      Storage: [
        { type: "Wardrobe", width: 45, height: 90, color: "#f59e0b" },
        { type: "Sliding Wardrobe", width: 55, height: 90, color: "#fbbf24" },
        { type: "Dresser", width: 70, height: 40, color: "#34d399" },
        { type: "Chest Drawer", width: 60, height: 45, color: "#10b981" }
      ],
      Accessories: [
        { type: "Night Stand", width: 40, height: 40, color: "#14b8a6" },
        { type: "Study Desk", width: 75, height: 40, color: "#06b6d4" },
        { type: "Mirror", width: 35, height: 20, color: "#cbd5e1" },
        { type: "Study Chair", width: 35, height: 35, color: "#67e8f9" }
      ]
    }
  },

  Kitchen: {
    label: "Kitchen",
    categories: {
      Layouts: [
        { type: "Straight Kitchen", width: 120, height: 35, color: "#eab308" },
        { type: "L Shape Kitchen", width: 110, height: 60, color: "#facc15" },
        { type: "U Shape Kitchen", width: 130, height: 70, color: "#f59e0b" },
        { type: "Kitchen Island", width: 85, height: 50, color: "#d97706" }
      ],
      Appliances: [
        { type: "Fridge", width: 45, height: 80, color: "#93c5fd" },
        { type: "Sink", width: 60, height: 35, color: "#a78bfa" },
        { type: "Oven", width: 50, height: 40, color: "#818cf8" },
        { type: "Microwave", width: 40, height: 30, color: "#6366f1" },
        { type: "Dishwasher", width: 45, height: 45, color: "#8b5cf6" }
      ],
      Dining: [
        { type: "Dining Table", width: 80, height: 60, color: "#34d399" },
        { type: "Dining Chair", width: 35, height: 35, color: "#10b981" },
        { type: "Bar Table", width: 70, height: 35, color: "#22c55e" },
        { type: "Bar Stool", width: 25, height: 25, color: "#16a34a" }
      ],
      Storage: [
        { type: "Cabinet", width: 90, height: 35, color: "#f59e0b" },
        { type: "Wall Cabinet", width: 75, height: 30, color: "#fb923c" },
        { type: "Pantry Shelf", width: 45, height: 85, color: "#ea580c" }
      ]
    }
  },

  Office: {
    label: "Office",
    categories: {
      Workstations: [
        { type: "Office Desk", width: 90, height: 45, color: "#60a5fa" },
        { type: "Office Chair", width: 45, height: 45, color: "#34d399" },
        { type: "Computer Desk", width: 100, height: 45, color: "#3b82f6" },
        { type: "Corner Desk", width: 95, height: 55, color: "#2563eb" }
      ],
      Meeting: [
        { type: "Meeting Table", width: 100, height: 55, color: "#7c3aed" },
        { type: "Visitor Chair", width: 35, height: 35, color: "#8b5cf6" },
        { type: "Conference Table", width: 130, height: 60, color: "#6d28d9" },
        { type: "Sofa Chair", width: 50, height: 50, color: "#9333ea" }
      ],
      Storage: [
        { type: "Bookshelf", width: 40, height: 90, color: "#8b5cf6" },
        { type: "File Cabinet", width: 45, height: 55, color: "#a855f7" },
        { type: "Storage Rack", width: 50, height: 85, color: "#9333ea" },
        { type: "Laptop Table", width: 55, height: 35, color: "#c084fc" }
      ]
    }
  },

  Bathroom: {
    label: "Bathroom",
    categories: {
      Fixtures: [
        { type: "Bathtub", width: 90, height: 50, color: "#93c5fd" },
        { type: "Toilet", width: 35, height: 45, color: "#e5e7eb" },
        { type: "Wash Basin", width: 45, height: 30, color: "#c4b5fd" },
        { type: "Shower Cabin", width: 70, height: 70, color: "#a5f3fc" }
      ],
      Storage: [
        { type: "Bathroom Cabinet", width: 60, height: 30, color: "#f59e0b" },
        { type: "Mirror Cabinet", width: 50, height: 20, color: "#94a3b8" },
        { type: "Vanity Unit", width: 65, height: 30, color: "#fbbf24" }
      ],
      Accessories: [
        { type: "Towel Rack", width: 40, height: 15, color: "#64748b" },
        { type: "Laundry Basket", width: 30, height: 30, color: "#a16207" }
      ]
    }
  },

  DiningRoom: {
    label: "Dining Room",
    categories: {
      DiningSets: [
        { type: "4 Seat Table", width: 80, height: 60, color: "#22c55e" },
        { type: "6 Seat Table", width: 100, height: 65, color: "#16a34a" },
        { type: "Round Dining Table", width: 70, height: 70, color: "#15803d" }
      ],
      Seating: [
        { type: "Dining Chair", width: 35, height: 35, color: "#4ade80" },
        { type: "Bench", width: 70, height: 30, color: "#65a30d" },
        { type: "Dining Bench", width: 75, height: 30, color: "#84cc16" }
      ],
      Storage: [
        { type: "Crockery Cabinet", width: 60, height: 85, color: "#f59e0b" },
        { type: "Buffet Table", width: 90, height: 35, color: "#d97706" },
        { type: "Sideboard", width: 85, height: 35, color: "#b45309" }
      ]
    }
  },

  KidsRoom: {
    label: "Kids Room",
    categories: {
      Beds: [
        { type: "Kids Bed", width: 70, height: 100, color: "#60a5fa" },
        { type: "Bunk Bed", width: 80, height: 120, color: "#2563eb" }
      ],
      Study: [
        { type: "Kids Desk", width: 70, height: 35, color: "#34d399" },
        { type: "Kids Chair", width: 30, height: 30, color: "#10b981" }
      ],
      Storage: [
        { type: "Toy Shelf", width: 55, height: 65, color: "#f59e0b" },
        { type: "Book Rack", width: 45, height: 70, color: "#fbbf24" }
      ],
      Play: [
        { type: "Play Mat", width: 70, height: 50, color: "#f472b6" },
        { type: "Bean Bag", width: 35, height: 35, color: "#ec4899" }
      ]
    }
  },

  Balcony: {
    label: "Balcony",
    categories: {
      Seating: [
        { type: "Swing Chair", width: 45, height: 45, color: "#8b5cf6" },
        { type: "Outdoor Chair", width: 35, height: 35, color: "#7c3aed" }
      ],
      Tables: [
        { type: "Outdoor Table", width: 55, height: 40, color: "#22c55e" },
        { type: "Tea Table", width: 40, height: 40, color: "#16a34a" }
      ],
      Decor: [
        { type: "Planter Box", width: 50, height: 25, color: "#65a30d" },
        { type: "Flower Pot", width: 25, height: 25, color: "#84cc16" }
      ]
    }
  }
};

export default function CreateDesign() {
  const navigate = useNavigate();
  const { addDesign } = useDesign();
  const { user, logout } = useAuth();

  const [roomLayout, setRoomLayout] = useState("Vertical");
  const [form, setForm] = useState({
    roomName: "",
    roomType: "Kitchen",
    width: "",
    length: "",
    wallColor: "#dbeafe",
    furnitureCount: 0
  });

  const currentRoom = roomLibrary[form.roomType];
  const categoryNames = useMemo(
    () => Object.keys(currentRoom.categories),
    [currentRoom]
  );

  const [selectedCategory, setSelectedCategory] = useState(categoryNames[0]);
  const [selectedLibraryItem, setSelectedLibraryItem] = useState(null);

  useEffect(() => {
    const firstCategory = Object.keys(roomLibrary[form.roomType].categories)[0];
    setSelectedCategory(firstCategory);
    setSelectedLibraryItem(null);
  }, [form.roomType]);

  const categoryItems = useMemo(() => {
    return currentRoom.categories[selectedCategory] || [];
  }, [currentRoom, selectedCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFurnitureCountChange = (count) => {
    setForm((prev) => ({
      ...prev,
      furnitureCount: count
    }));
  };

  const handleSave = () => {
    addDesign({
      ...form,
      roomLayout,
      selectedCategory
    });
    navigate("/portfolio");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-inner">
          <div>
            <h2 style={{ margin: 0 }}>Furniture Room Visualizer</h2>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#cbd5e1" }}>
              Design workspace
            </p>
          </div>

          <div className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/create-design">Create Design</Link>
            <Link to="/portfolio">Portfolio</Link>
            <span className="badge" style={{ background: "#1e3a8a", color: "#dbeafe" }}>
              {user?.name || "Designer"}
            </span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="planner-page with-navbar">
        <div className="planner-shell">
          <div className="planner-sidebar">
            <div className="planner-tabs">
              <button className="planner-tab active" type="button">
                Library
              </button>
              <button className="planner-tab" type="button">
                Elements
              </button>
            </div>

            <div className="planner-sidebar-content">
              <div className="planner-room-box">
                <div className="planner-room-title">Room Type</div>

                <select
                  className="input"
                  name="roomType"
                  value={form.roomType}
                  onChange={handleChange}
                >
                  <option value="LivingRoom">Living Room</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Office">Office</option>
                  <option value="Bathroom">Bathroom</option>
                  <option value="DiningRoom">Dining Room</option>
                  <option value="KidsRoom">Kids Room</option>
                  <option value="Balcony">Balcony</option>
                </select>
              </div>

              <div className="planner-room-box">
                <div className="planner-room-title">Layout</div>

                <div className="planner-layout-options">
                  <button
                    type="button"
                    className={roomLayout === "Vertical" ? "layout-btn active" : "layout-btn"}
                    onClick={() => setRoomLayout("Vertical")}
                  >
                    Vertical
                  </button>

                  <button
                    type="button"
                    className={roomLayout === "Horizontal" ? "layout-btn active" : "layout-btn"}
                    onClick={() => setRoomLayout("Horizontal")}
                  >
                    Horizontal
                  </button>

                  <button
                    type="button"
                    className={roomLayout === "Freeform" ? "layout-btn active" : "layout-btn"}
                    onClick={() => setRoomLayout("Freeform")}
                  >
                    Freeform
                  </button>
                </div>
              </div>

              <div className="planner-room-box">
                <div className="planner-room-title">
                  {currentRoom.label} Categories
                </div>

                <div className="planner-category-list">
                  {categoryNames.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={
                        selectedCategory === category
                          ? "planner-category-item active"
                          : "planner-category-item"
                      }
                      onClick={() => {
                        setSelectedCategory(category);
                        setSelectedLibraryItem(null);
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="planner-library-panel">
            <div className="planner-library-header">
              <h2>{currentRoom.label}</h2>
              <p>{selectedCategory} items available for this room</p>
            </div>

            <div className="planner-selected-room-banner">
              <strong>{currentRoom.label}</strong>
              <span>{selectedCategory}</span>
            </div>

            <div className="planner-item-grid">
              {categoryItems.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  className={
                    selectedLibraryItem?.type === item.type
                      ? "planner-item-card active"
                      : "planner-item-card"
                  }
                  onClick={() => setSelectedLibraryItem(item)}
                >
                  <div
                    className="planner-item-preview"
                    style={{ background: item.color }}
                  />
                  <span>{item.type}</span>
                </button>
              ))}
            </div>

            <div className="planner-form-card">
              <h3>Room Settings</h3>

              <input
                className="input"
                name="roomName"
                placeholder="Room name"
                value={form.roomName}
                onChange={handleChange}
              />

              <input
                className="input"
                name="width"
                type="number"
                placeholder="Width (m)"
                value={form.width}
                onChange={handleChange}
              />

              <input
                className="input"
                name="length"
                type="number"
                placeholder="Length (m)"
                value={form.length}
                onChange={handleChange}
              />

              <div className="planner-color-row">
                <label>Wall Color</label>
                <input
                  name="wallColor"
                  type="color"
                  value={form.wallColor}
                  onChange={handleChange}
                />
              </div>

              <div className="planner-count-box">
                Furniture Count: {form.furnitureCount}
              </div>

              <button className="btn" onClick={handleSave} type="button">
                Save Design
              </button>
            </div>
          </div>

          <div className="planner-preview-panel">
            <div className="planner-preview-header">
              <div>
                <h2>Preview Area</h2>
                <p>
                  {selectedLibraryItem
                    ? `${selectedLibraryItem.type} selected`
                    : `Choose a ${selectedCategory.toLowerCase()} item`}
                </p>
              </div>
            </div>

            <div className="planner-preview-canvas">
              <RoomViewer3D
                roomType={form.roomType}
                wallColor={form.wallColor}
                onFurnitureCountChange={handleFurnitureCountChange}
                selectedLibraryItem={selectedLibraryItem}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}