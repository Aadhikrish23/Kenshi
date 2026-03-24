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

      // ✅ AUTO LOGIN (no UI interruption)
      if (!session) {
        console.log("⚡ No session → auto login");
        session = await login();
      }

      const newSocket = client.createSocket(true);
      await newSocket.connect(session, true);

      console.log("🔌 Socket connected");

      // ⚠️ DO NOT OVERRIDE LATER
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