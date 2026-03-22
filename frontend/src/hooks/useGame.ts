import { useEffect, useState } from "react";

export function useGame(socket: any, matchId: string) {
  const [gameState, setGameState] = useState<any>(null);
  const [error, setError] = useState<String | null>("");

  useEffect(() => {
    if (!socket) return;

    console.log("🎯 Listening for match:", matchId);
    setError(null);

    socket.onmatchdata = (msg: any) => {
      const decoded = JSON.parse(new TextDecoder().decode(msg.data));

      if (msg.op_code === 1) {
    console.log("📦 STATE UPDATE:", decoded.state);
    setGameState({ ...decoded.state });
    return;
  }

  if (msg.op_code === 2) {
    console.log("❌ ERROR:", decoded.message);
    setError(decoded.message);
    return;
  }
    };
  }, [socket, matchId]);

  const makeMove = (index: number) => {
    if (!socket || !matchId) return;

    console.log("📤 Sending move:", index);

    socket.sendMatchState(
      matchId,
      1,
      new TextEncoder().encode(JSON.stringify({ index })), // ✅ FIXED
    );
  };

  return { gameState, makeMove, error };
}
