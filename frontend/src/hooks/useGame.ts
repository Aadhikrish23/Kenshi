import { useEffect, useState } from "react";

export function useGame(socket: any, matchId: string) {
  const [gameState, setGameState] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false); // ✅ NEW

useEffect(() => {
  if (!socket || !matchId) {
    setIsReady(false);
    return;
  }

  console.log("🎯 Binding match listener for:", matchId);

  // ✅ FIX: The match is joined, we are ready to send moves immediately
  setIsReady(true); 

  const handleMatchData = (msg: any) => {
    try {
      // Nakama returns data as Uint8Array
      const decoded = new TextDecoder().decode(msg.data);
      const data = JSON.parse(decoded);

      // Log this to see what the server is actually sending back
      console.log("📥 Received match data:", data);

      if (data.type === "state_update") {
        setGameState(data.state);
      }
    } catch (err) {
      console.error("❌ Parse error:", err);
      setError("Invalid game data");
    }
  };

  socket.onmatchdata = handleMatchData;

  return () => {
    socket.onmatchdata = null;
    setIsReady(false);
  };
}, [socket, matchId]);


 const makeMove = async (index: number) => {
  // Check socket exists; remove isReady if you haven't moved it to the useEffect
  if (!socket || !matchId) {
    console.warn("🔌 Socket or MatchID missing");
    return;
  }

  try {
    const opCode = 1; // Ensure this matches your Nakama server's OpCode for moves
    const data = JSON.stringify({ index });
    
    console.log("📤 Sending move:", data, "to match:", matchId);

    await socket.sendMatchState(
      matchId,
      opCode,
      data
    );
    
    // Optional: Log success to verify the promise resolved
    console.log("✅ Move sent successfully");
  } catch (err) {
    console.error("❌ Move failed at socket level:", err);
    setError("Move failed");
  }
};


  return { gameState, makeMove, error, isReady };
}