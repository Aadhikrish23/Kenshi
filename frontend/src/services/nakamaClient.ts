import { Client, Session, type Socket } from "@heroiclabs/nakama-js";

const client = new Client("defaultkey", "127.0.0.1", "7350");

let session: Session;
let socket: Socket;

export async function connectToNakama() {
  // Create user (no login needed)
  session = await client.authenticateDevice(
    Math.random().toString()
  );

  console.log("Authenticated:", session);

  // Create socket
  socket = client.createSocket();

  // Connect realtime
  await socket.connect(session, true);

  console.log("Socket connected");

  return { client, session, socket };
}
export async function createMatch(socket: Socket) {
  const match = await socket.createMatch("tic-tac-toe");

  console.log("Match created:", match.match_id);

  return match.match_id;
}
export async function joinMatch(socket: Socket, matchId: string) {
  const match = await socket.joinMatch(matchId);

  console.log("Joined match:", match);

  return match;
}