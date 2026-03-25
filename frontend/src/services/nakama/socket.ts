import { client } from "./client";
import { login, getSession } from "./auth";

let socket: any = null;
let socketPromise: Promise<any> | null = null;

export async function connectToNakama() {
  // If socket exists but is disconnected, reset it
  if (socket && !socket.isConnected) {
    console.warn("⚠️ Socket exists but disconnected, resetting...");
    socket = null;
    socketPromise = null;
  }

  if (socket && socket.isConnected) {
    return socket;
  }

  if (socketPromise) {
    return socketPromise;
  }

  socketPromise = (async () => {
    try {
      let session = getSession();

      if (!session) {
        console.log("⚡ No session → auto login");
        session = await login();
      }

      const useSSL = import.meta.env.VITE_NAKAMA_SSL === "true";
      const newSocket = client.createSocket(useSSL, false);

      newSocket.ondisconnect = (evt: any) => {
        console.warn("🔌 Socket disconnected:", evt);
        socket = null;
        socketPromise = null;
      };

      newSocket.onerror = (evt: any) => {
        console.error("❌ Socket error:", evt);
      };

      await newSocket.connect(session, true);
      console.log("🔌 Socket connected, isConnected:", newSocket);

      socket = newSocket;
      return socket;
    } catch (err: any) {
      console.error("❌ Socket connect failed:", err?.message, err?.code, JSON.stringify(err));
      socket = null;
      socketPromise = null;
      throw err;
    }
  })();

  return socketPromise;
}