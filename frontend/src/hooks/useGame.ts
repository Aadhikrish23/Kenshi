import { useEffect, useState } from "react";

export function useGame(socket: any, matchId: string) {
  const [gameState, setGameState] = useState<any>(null);

  useEffect(() => {
    if (!socket) return;

    console.log("🎯 Listening for match:", matchId);

    socket.onmatchdata = (msg: any) => {
      const decoded = JSON.parse(
        new TextDecoder().decode(msg.data)
      );

      if (decoded.type === "state_update") {
        const newState = decoded.state;

        console.log("📦 STATE UPDATE:", newState);

        setGameState({ ...newState });// ✅ FIXED
      }
    };
  }, [socket, matchId]);

  const makeMove = (index: number) => {
    if (!socket || !matchId) return;

    console.log("📤 Sending move:", index);

    socket.sendMatchState(
      matchId,
      1,
      new TextEncoder().encode(JSON.stringify({ index })) // ✅ FIXED
    );
  };

  return { gameState, makeMove };
}