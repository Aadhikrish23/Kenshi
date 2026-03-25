import { client } from "./client";
import { login, getSession } from "./auth";

let socket: any = null;
let socketPromise: Promise<any> | null = null;

export async function connectToNakama() {
  if (socket && socket.isConnected) {
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
      const newSocket = client.createSocket(useSSL, false); // verbose=false reduces noise

      newSocket.ondisconnect = (evt) => {
        console.warn("🔌 Socket disconnected:", evt);
        socket = null;
        socketPromise = null;
      };

      newSocket.onerror = (evt) => {
        console.error("❌ Socket error:", evt);
      };

      await newSocket.connect(session, true);
      console.log("🔌 Socket connected");

      socket = newSocket;
      resolve(socket);
    } catch (err: any) {
      console.error("❌ Socket connect failed:", JSON.stringify(err), err);
      socketPromise = null;
      reject(err);
    }
  });

  return socketPromise;
}