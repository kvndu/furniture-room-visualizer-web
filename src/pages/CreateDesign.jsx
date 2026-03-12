import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDesign } from "../hooks/useDesign";
import { defaultFurnitureByRoom, roomLibrary } from "../data/furnitureData";
import TwoDEditor from "../components/room/TwoDEditor";

const defaultForm = {
  roomName: "",
  roomType: "Kitchen",
  width: 6,
  length: 5,
  height: 3,
  wallColor: "#dbeafe",
  floorColor: "#d6c3a5"
};

export default function CreateDesign() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");

  const { user, logout } = useAuth();
  const {
    designs,
    addDesign,
    updateDesign,
    getDesignById,
    setDraftDesign
  } = useDesign();

  const [form, setForm] = useState(defaultForm);
  const [furniture, setFurniture] = useState(defaultFurnitureByRoom.Kitchen || []);
  const [selectedLibraryItem, setSelectedLibraryItem] = useState(null);

  const currentRoom = roomLibrary[form.roomType];
  const categoryNames = useMemo(
    () => Object.keys(currentRoom.categories),
    [currentRoom]
  );

  const [selectedCategory, setSelectedCategory] = useState(categoryNames[0] || "");

  useEffect(() => {
    if (!editId) return;

    const existing = getDesignById(editId);
    if (!existing) return;

    setForm({
      roomName: existing.roomName || "",
      roomType: existing.roomType || "Kitchen",
      width: existing.width || 6,
      length: existing.length || 5,
      height: existing.height || 3,
      wallColor: existing.wallColor || "#dbeafe",
      floorColor: existing.floorColor || "#d6c3a5"
    });

    setFurniture(existing.furniture || []);
    setSelectedCategory(existing.selectedCategory || Object.keys(roomLibrary[existing.roomType || "Kitchen"].categories)[0]);
  }, [editId, designs, getDesignById]);

  useEffect(() => {
    if (editId) return;
    const firstCategory = Object.keys(roomLibrary[form.roomType].categories)[0];
    setSelectedCategory(firstCategory);
  }, [form.roomType, editId]);

  useEffect(() => {
    const draft = {
      roomName: form.roomName,
      roomType: form.roomType,
      width: Number(form.width) || 6,
      length: Number(form.length) || 5,
      height: Number(form.height) || 3,
      wallColor: form.wallColor,
      floorColor: form.floorColor,
      furniture,
      selectedCategory
    };
    setDraftDesign(draft);
  }, [form, furniture, selectedCategory, setDraftDesign]);

  const categoryItems = useMemo(() => {
    return currentRoom.categories[selectedCategory] || [];
  }, [currentRoom, selectedCategory]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "width" || name === "length" || name === "height" ? Number(value) : value
    }));
  };

  const handleRoomTypeChange = (e) => {
    const roomType = e.target.value;
    const firstCategory = Object.keys(roomLibrary[roomType].categories)[0];

    setForm((prev) => ({
      ...prev,
      roomType
    }));
    setSelectedCategory(firstCategory);
    setSelectedLibraryItem(null);
    setFurniture(defaultFurnitureByRoom[roomType] || []);
  };

  const handleSave = () => {
    const designPayload = {
      roomName: form.roomName,
      roomType: form.roomType,
      width: Number(form.width) || 6,
      length: Number(form.length) || 5,
      height: Number(form.height) || 3,
      wallColor: form.wallColor,
      floorColor: form.floorColor,
      furniture,
      furnitureCount: furniture.length,
      selectedCategory
    };

    if (editId) {
      updateDesign(editId, designPayload);
    } else {
      addDesign(designPayload);
    }

    navigate("/portfolio");
  };

  const handlePreview3D = () => {
    const draft = {
      roomName: form.roomName,
      roomType: form.roomType,
      width: Number(form.width) || 6,
      length: Number(form.length) || 5,
      height: Number(form.height) || 3,
      wallColor: form.wallColor,
      floorColor: form.floorColor,
      furniture,
      furnitureCount: furniture.length,
      selectedCategory
    };

    setDraftDesign(draft);

    if (editId) {
      navigate(`/preview-3d?id=${editId}`);
    } else {
      navigate("/preview-3d");
    }
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-inner">
          <div>
            <h2 style={{ margin: 0 }}>Furniture Room Visualizer</h2>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#cbd5e1" }}>
              2D Design Workspace
            </p>
          </div>

          <div className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/create-design">Create 2D</Link>
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

      <div style={{ padding: "20px", background: "#f8fafc", minHeight: "calc(100vh - 84px)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 360px 1fr",
            gap: "20px",
            alignItems: "start"
          }}
        >
          <div className="card">
            <h3 className="section-title">Room Type</h3>

            <div style={{ marginBottom: "16px" }}>
              <select
                className="input"
                name="roomType"
                value={form.roomType}
                onChange={handleRoomTypeChange}
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

            <h3 className="section-title">Categories</h3>
            <div style={{ display: "grid", gap: "10px" }}>
              {categoryNames.map((category) => (
                <button
                  key={category}
                  type="button"
                  className="btn btn-secondary"
                  style={{
                    justifyContent: "flex-start",
                    background: selectedCategory === category ? "#dbeafe" : "#e5e7eb",
                    color: selectedCategory === category ? "#1d4ed8" : "#111827"
                  }}
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

          <div className="card">
            <div style={{ marginBottom: "14px" }}>
              <h2 className="title" style={{ fontSize: "30px", marginBottom: "6px" }}>
                {currentRoom.label}
              </h2>
              <p className="subtitle" style={{ marginBottom: 0 }}>
                {selectedCategory} items for this room
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
                marginBottom: "18px"
              }}
            >
              {categoryItems.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setSelectedLibraryItem(item)}
                  style={{
                    border: selectedLibraryItem?.type === item.type ? "2px solid #2563eb" : "1px solid #e5e7eb",
                    borderRadius: "14px",
                    padding: "12px",
                    background: "#fff",
                    boxShadow:
                      selectedLibraryItem?.type === item.type
                        ? "0 0 0 3px rgba(37,99,235,0.12)"
                        : "0 8px 18px rgba(15,23,42,0.05)"
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "72px",
                      borderRadius: "10px",
                      background: item.color,
                      marginBottom: "10px"
                    }}
                  />
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "14px" }}>{item.type}</div>
                </button>
              ))}
            </div>

            <div
              style={{
                padding: "16px",
                borderRadius: "16px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                display: "grid",
                gap: "12px"
              }}
            >
              <h3 className="section-title" style={{ marginBottom: 0 }}>Room Settings</h3>

              <input
                className="input"
                name="roomName"
                placeholder="Room name"
                value={form.roomName}
                onChange={handleFieldChange}
              />

              <input
                className="input"
                name="width"
                type="number"
                placeholder="Width (m)"
                value={form.width}
                onChange={handleFieldChange}
              />

              <input
                className="input"
                name="length"
                type="number"
                placeholder="Length (m)"
                value={form.length}
                onChange={handleFieldChange}
              />

              <input
                className="input"
                name="height"
                type="number"
                placeholder="Height (m)"
                value={form.height}
                onChange={handleFieldChange}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: "#fff",
                  border: "1px solid #cbd5e1"
                }}
              >
                <label style={{ fontWeight: 600 }}>Wall Color</label>
                <input
                  name="wallColor"
                  type="color"
                  value={form.wallColor}
                  onChange={handleFieldChange}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: "#fff",
                  border: "1px solid #cbd5e1"
                }}
              >
                <label style={{ fontWeight: 600 }}>Floor Color</label>
                <input
                  name="floorColor"
                  type="color"
                  value={form.floorColor}
                  onChange={handleFieldChange}
                />
              </div>

              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  background: "#fff",
                  border: "1px solid #cbd5e1",
                  fontWeight: 600
                }}
              >
                Furniture Count: {furniture.length}
              </div>

              <button className="btn" type="button" onClick={handleSave}>
                {editId ? "Update Design" : "Save Design"}
              </button>
            </div>
          </div>

          <div className="card">
            <div style={{ marginBottom: "14px" }}>
              <h2 className="title" style={{ marginBottom: "6px" }}>2D Editor</h2>
              <p className="subtitle" style={{ marginBottom: 0 }}>
                Create the layout in 2D, then open the separate 3D preview page.
              </p>
            </div>

            <TwoDEditor
              form={form}
              furniture={furniture}
              setFurniture={setFurniture}
              selectedLibraryItem={selectedLibraryItem}
              onPreview3D={handlePreview3D}
            />
          </div>
        </div>
      </div>
    </>
  );
}