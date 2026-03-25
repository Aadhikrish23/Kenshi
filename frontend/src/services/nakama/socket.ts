import { client } from "./client";
import { login, getSession } from "./auth";
import { Session } from "@heroiclabs/nakama-js";

let socket: any = null;
let socketPromise: Promise<any> | null = null;

async function getValidSession() {
  let session = getSession();

  if (!session) {
    return await login();
  }

  // Refresh if expired or expiring within 10 seconds
  if (session.isexpired(Date.now() / 1000 + 10)) {
    console.log("🔄 Session expired/expiring, refreshing...");
    try {
      session = await client.sessionRefresh(session);
      sessionStorage.setItem("nakama_session", JSON.stringify(session));
    } catch (err) {
      console.warn("⚠️ Refresh failed, re-logging in...");
      session = await login();
    }
  }

  return session;
}

export async function connectToNakama() {
  if (socket && !socket.isConnected) {
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
      const session = await getValidSession();

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
      console.log("🔌 Socket connected");

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