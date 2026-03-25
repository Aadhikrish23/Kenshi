import { Client } from "@heroiclabs/nakama-js";

export const client = new Client(
  import.meta.env.VITE_NAKAMA_SERVER_KEY,
  import.meta.env.VITE_NAKAMA_HOST,
  import.meta.env.VITE_NAKAMA_PORT,
  true
);
console.log("Connecting to:", {
  host: import.meta.env.VITE_NAKAMA_HOST,
  port: import.meta.env.VITE_NAKAMA_PORT,
  ssl: import.meta.env.VITE_NAKAMA_SSL,
});