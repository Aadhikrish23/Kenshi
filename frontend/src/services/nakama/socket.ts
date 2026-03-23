import { client } from "./client";
import { getSession } from "./auth";

let socket: any = null;

/**
 * Connect socket ONLY if session exists
 */
export async function connectToNakama() {
  if (socket) return socket;

  const session = getSession();

  if (!session) {
    throw new Error("User not authenticated");
  }

  socket = client.createSocket(true, true);
  await socket.connect(session, true);

  console.log("🔌 Socket connected");

  return socket;
}