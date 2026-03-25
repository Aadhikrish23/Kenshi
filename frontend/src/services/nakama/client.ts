import { Client } from "@heroiclabs/nakama-js";

export const client = new Client(
  "kenshi_key",
  "kenshi-game.duckdns.org",
  "7350",   // 👈 DIRECT PORT
  false     // 👈 NO SSL
);