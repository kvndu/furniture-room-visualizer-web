import Input from "../common/Input";

export default function RoomForm({ form, onChange }) {
  return (
    <div style={{ display: "grid", gap: "12px" }}>
      <Input id="roomName" name="roomName" label="Room Name" value={form.roomName} onChange={onChange} />
      <Input id="width" name="width" label="Width" type="number" value={form.width} onChange={onChange} />
      <Input id="length" name="length" label="Length" type="number" value={form.length} onChange={onChange} />
      <Input id="height" name="height" label="Height" type="number" value={form.height} onChange={onChange} />
    </div>
  );
}
