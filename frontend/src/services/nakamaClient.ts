import { Client, Session, type Socket } from "@heroiclabs/nakama-js";

const client = new Client("defaultkey", "127.0.0.1", "7350");

let session: Session;
let socket: Socket;

export async function connectToNakama() {
  session = await client.authenticateDevice(Math.random().toString());

  console.log("Authenticated:", session);

  socket = client.createSocket();
  await socket.connect(session, true);

  console.log("Socket connected");

  return { client, session, socket, userId: session.user_id };
}

// ✅ THIS IS CORRECT (KEEP THIS)
export async function createMatch(
  client: Client,
  session: Session,
): Promise<string> {
  const res = await client.rpc(session, "create_match", {});

  const parsed =
    typeof res.payload === "string" ? JSON.parse(res.payload) : res.payload;
  console.log("Match created:", parsed.matchId);

  return parsed.matchId;
}

// ✅ THIS IS ALSO CORRECT
export async function joinMatch(socket: Socket, matchId: string) {
  for (let i = 0; i < 3; i++) {
    try {
      const match = await socket.joinMatch(matchId);
      console.log("Joined match:", match);
      return match;
    } catch (err) {
      console.log("Retrying join...", i);
      await new Promise((res) => setTimeout(res, 300));
    }
  }

  throw new Error("Failed to join match after retries");
}
