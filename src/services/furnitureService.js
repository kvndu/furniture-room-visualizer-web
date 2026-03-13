import { supabase } from "../lib/supabase";

function withImageUrl(item) {
  if (!item.image_path) {
    return item;
  }

  const { data } = supabase.storage
    .from("furniture-images")
    .getPublicUrl(item.image_path);

  return {
    ...item,
    image: data.publicUrl
  };
}

export async function getFurnitureItems(roomType, category) {
  let query = supabase
    .from("furniture_items")
    .select("*")
    .order("id", { ascending: true });

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

  return (data || []).map(withImageUrl);
}