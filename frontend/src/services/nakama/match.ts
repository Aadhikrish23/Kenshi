import { connectToNakama } from "./socket";

/**
 * Create match (guest allowed)
 */
export async function createMatch() {
  const socket = await connectToNakama();

  const res = await socket.rpc("create_match", "");
  return JSON.parse(res.payload);
}

/**
 * Join match
 */
export async function joinMatch(matchId: string) {
  const socket = await connectToNakama();
  return await socket.joinMatch(matchId);
}