export function validateDesignForm(form) {
  if (!form.roomType) {
    return { valid: false, message: "Please select a room type." };
  }

  if ((Number(form.width) || 0) <= 0 || (Number(form.length) || 0) <= 0) {
    return { valid: false, message: "Room width and length must be greater than zero." };
  }

  return { valid: true };
}
