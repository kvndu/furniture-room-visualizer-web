import Modal from "../common/Modal";

export default function SaveDesignModal({ open, design, onClose, onConfirm }) {
  return (
    <Modal
      open={open}
      title="Save Design"
      onClose={onClose}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn" onClick={onConfirm}>Confirm Save</button>
        </div>
      }
    >
      <p style={{ marginTop: 0 }}>You are about to save this layout.</p>
      <div className="summary-list">
        <div className="summary-item"><span>Room</span><strong>{design?.roomName || design?.roomType || "Untitled"}</strong></div>
        <div className="summary-item"><span>Furniture</span><strong>{design?.furniture?.length || design?.furnitureCount || 0}</strong></div>
      </div>
    </Modal>
  );
}
