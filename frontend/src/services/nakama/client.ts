import { Client } from "@heroiclabs/nakama-js";

export const client = new Client(
  import.meta.env.VITE_NAKAMA_SERVER_KEY,
  import.meta.env.VITE_NAKAMA_HOST,
  import.meta.env.VITE_NAKAMA_PORT,
  import.meta.env.VITE_NAKAMA_SSL === "true"
);
console.log("ENV SSL:", import.meta.env.VITE_NAKAMA_SSL);