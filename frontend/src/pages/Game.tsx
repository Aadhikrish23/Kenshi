import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GameBoard from "./GameBoard";
import { getSession } from "../services/nakama/auth";
import { connectToNakama } from "../services/nakama/socket"; // ✅ Import your socket service

export default function Game() {
  const location = useLocation();
  const navigate = useNavigate();
  const [socket, setSocket] = useState<any>(null);

  const { matchId ,isAutomated} = location.state || {};
  const session = getSession();

  useEffect(() => {
    // If we don't have a matchId or session, we shouldn't be here
    if (!matchId || !session) {
      console.error("Missing match data or session, redirecting...");
      navigate("/");
      return;
    }

    const initSocket = async () => {
      try {
        // This returns the ALREADY CONNECTED socket from your singleton
        const activeSocket = await connectToNakama();
        setSocket(activeSocket);
      } catch (err) {
        console.error("Failed to retrieve socket:", err);
        navigate("/");
      }
    };

    initSocket();
  }, [matchId, session, navigate]);

  // Loading state while we grab the socket reference
  if (!socket || !matchId || !session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Initializing Game...
      </div>
    );
  }

  return (
    <GameBoard
      socket={socket}
      matchId={matchId}
      userId={session.user_id} 
      isAutomated={isAutomated}
    />
  );
}
