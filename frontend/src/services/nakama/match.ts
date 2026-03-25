// import { connectToNakama } from "./socket";

// /**
//  * ✅ CREATE + JOIN MATCH (HOST FLOW)
//  */
// export async function createMatch() {
//   const socket = await connectToNakama();

//   // 1. Create match
//   const res = await socket.rpc("create_match", "");
//   const { matchId } = JSON.parse(res.payload);

//   console.log("🆕 Match created:", matchId);

//   // 2. 🔥 CRITICAL: JOIN immediately
//   const match = await socket.joinMatch(matchId);

//   console.log("✅ Host joined match:", match.match_id);

//   return { match, socket };
// }

// /**
//  * ✅ JOIN MATCH (PLAYER 2)
//  */
// export async function joinMatch(matchId: string) {
//   const socket = await connectToNakama();

//   const match = await socket.joinMatch(matchId);

//   console.log("✅ Joined match:", match.match_id);

//   return { match, socket };
// }

import { connectToNakama } from "./socket";

export async function createMatch() {
  const socket = await connectToNakama();
  
  if (!socket.isConnected) {
    throw new Error("Socket not connected after connectToNakama()");
  }

  const res = await socket.rpc("create_match", "");
  const { matchId } = JSON.parse(res.payload);
  console.log("🆕 Match created:", matchId);

  const match = await socket.joinMatch(matchId);
  console.log("✅ Host joined match:", match.match_id);

  return { match, socket };
}

export async function joinMatch(matchId: string) {
  const socket = await connectToNakama();

  if (!socket.isConnected) {
    throw new Error("Socket not connected after connectToNakama()");
  }

  const match = await socket.joinMatch(matchId);
  console.log("✅ Joined match:", match.match_id);

  return { match, socket };
}