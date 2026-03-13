import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function createFallbackClient() {
  return {
    from() {
      return {
        select() {
          return this;
        },
        order() {
          return this;
        },
        eq() {
          return Promise.resolve({ data: [], error: null });
        }
      };
    },
    storage: {
      from() {
        return {
          getPublicUrl(path) {
            return { data: { publicUrl: path || "" } };
          }
        };
      }
    }
  };
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createFallbackClient();
