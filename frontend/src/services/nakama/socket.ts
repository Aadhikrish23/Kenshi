import { client } from "./client";
import { authenticate } from "./auth";

let socket: any = null;
let userId: string | null = null;

/**
 * Create or reuse socket
 */
export async function connectToNakama() {
  // ✅ Always return same structure
  if (socket && userId) {
    return { socket, userId };
  }

  const { session, userId: uid } = await authenticate();

  socket = client.createSocket(true, true);
  await socket.connect(session, true);

  userId = uid!;

  console.log("🔌 Socket connected");

  return { socket, userId };
}