import { client } from "./client";
import { login, getSession } from "./auth";

let socket: any = null;
let socketPromise: Promise<any> | null = null;

export async function connectToNakama() {
  if (socket) {
    return socket;
  }

  if (socketPromise) {
    return socketPromise;
  }

  socketPromise = new Promise(async (resolve, reject) => {
    try {
      let session = getSession();

      if (!session) {
        console.log("⚡ No session → auto login");
        session = await login();
      }

      const useSSL = import.meta.env.VITE_NAKAMA_SSL === "true";
      const newSocket = client.createSocket(useSSL);

      console.log("🔌 Connecting socket...");
      console.log("SESSION:", session);

      await newSocket.connect(session, true);

      console.log("✅ Socket connected");

      // 🔥 IMPORTANT: listen for close/errors
      newSocket.ondisconnect = (evt: any) => {
        console.log("❌ Socket disconnected:", evt);
        socket = null;
        socketPromise = null;
      };

      socket = newSocket;
      resolve(socket);

    } catch (err) {
      console.error("🔥 SOCKET ERROR:", err);
      socketPromise = null;
      reject(err);
    }
  });

  return socketPromise;
}