import { connectToNakama } from "./socket";

/**
 * Create match
 */
export async function createMatch() {
  const res = await connectToNakama();
  const socket = res.socket;

  const response = await socket.rpc("create_match", "");
  return JSON.parse(response.payload);
}

/**
 * Join match
 */
export async function joinMatch(matchId: string) {
  const res = await connectToNakama();
  const socket = res.socket;

  const match = await socket.joinMatch(matchId);
  return match;
}