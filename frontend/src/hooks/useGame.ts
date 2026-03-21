import { useEffect, useState } from "react";

export function useGame(socket: any, matchId: string) {
  const [gameState, setGameState] = useState<any>(null);

 useEffect(() => {
  if (!socket) return;

  console.log("🎯 Attaching match listener...");

  socket.onmatchdata = (data: any) => {
    console.log("🔥 RAW:", data);

    try {
      const decoded = new TextDecoder().decode(data.data);
      const parsed = JSON.parse(decoded);

      console.log("✅ PARSED:", parsed);

      if (parsed.type === "state_update") {
        setGameState(parsed.state);
      }
    } catch (err) {
      console.error("❌ Parse error:", err);
    }
  };

  return () => {
    socket.onmatchdata = null;
  };
}, [socket]);

  const makeMove = (index: number) => {
    if (!socket || !matchId) return;

    socket.sendMatchState(
      matchId,
      1,
      JSON.stringify({ index })
    );
  };

  return { gameState, makeMove };
}