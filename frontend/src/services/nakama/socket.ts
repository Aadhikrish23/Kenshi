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

      const newSocket = client.createSocket(useSSL);

      console.log("🔌 Connecting socket...");

      // 🔥 THIS WAS MISSING
      await newSocket.connect(session, true);
      console.log("SESSION:", session);

      console.log("✅ Socket connected");
      newSocket.onmatchdata = () => {};
      newSocket.onmatchmakermatched = () => {};

      socket = newSocket;
      resolve(socket);
    } catch (err) {
      socketPromise = null;
      reject(err);
    }
  });

  return socketPromise;
}