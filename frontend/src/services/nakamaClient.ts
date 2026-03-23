import { Client, type Session, type Socket } from "@heroiclabs/nakama-js";

/**
 * Generate or reuse a per-tab device ID
 */
function getDeviceId(): string {
  let deviceId = sessionStorage.getItem("deviceId");

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    sessionStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
}

/**
 * CONNECT TO NAKAMA
 */
export async function connectToNakama() {
  const client = new Client(
    "kenshi_key",
    "kenshi.onrender.com",
    "443",
    true, // ✅ IMPORTANT (HTTPS)
  );
  // ✅ IMPORTANT: isolate session per tab

  const deviceId = getDeviceId();

  console.log("🔑 Device ID:", deviceId);

  const session: Session = await client.authenticateDevice(
    deviceId,
    undefined,
    // create if not exists
  );

  console.log("✅ Connected as user:", session.user_id);

  const socket: Socket = client.createSocket(true,true);

  await socket.connect(session, true);

  console.log("🔌 Socket connected");

  return {
    client,
    session,
    socket,
    userId: session.user_id,
  };
}

/**
 * CREATE MATCH
 */
export async function createMatch(socket: Socket) {
  const rpc = await socket.rpc("create_match", "");
  const data = JSON.parse(rpc.payload!);

  console.log("🎮 Match created:", data.matchId);

  return data.matchId;
}

/**
 * JOIN MATCH
 */
export async function joinMatch(socket: Socket, matchId: string) {
  const match = await socket.joinMatch(matchId);

  console.log("🎯 Joined match:", match.match_id);
  console.log("👤 Me:", match.self);

  // ❌ DO NOT rely on presences
  // console.log("👥 Players:", match.presences);

  return match;
}

/**
 * SEND MOVE (you'll need this next)
 */
export async function sendMove(socket: Socket, matchId: string, index: number) {
  await socket.sendMatchState(
    matchId,
    1,
    new TextEncoder().encode(JSON.stringify({ index })),
  );
  console.log("📤 Move sent:", index);
}
