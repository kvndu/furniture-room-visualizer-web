export function calculateRoomScale(roomWidth, roomLength, maxWidth = 700, maxHeight = 420) {
  const safeWidth = Number(roomWidth) || 1;
  const safeLength = Number(roomLength) || 1;
  return Math.min(maxWidth / safeWidth, maxHeight / safeLength, 90);
}
