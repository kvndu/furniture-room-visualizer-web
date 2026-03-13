export function buildRoomSummary(room) {
  return `${room.roomType} • ${room.width}m × ${room.length}m × ${room.height || 3}m`;
}

export function normalizeRoomDimensions(room) {
  return {
    ...room,
    width: Number(room.width) || 6,
    length: Number(room.length) || 5,
    height: Number(room.height) || 3
  };
}
