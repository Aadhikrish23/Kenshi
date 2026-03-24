import { useState } from "react";
import GameBoard from "./GameBoard";
import { createMatch, joinMatch } from "../services/nakama/match";
import { getSession } from "../services/nakama/auth";
import { useNavigate } from "react-router-dom";

export default function Lobby() {
  const [matchId, setMatchId] = useState("");
  const [inputId, setInputId] = useState("");
  const [socket, setSocket] = useState<any>(null);
  const [userId, setUserId] = useState("");
  const [inGame, setInGame] = useState(false);

  const navigate = useNavigate();

  // ✅ CREATE MATCH (HOST)
  async function handleCreate() {
    try {
      const { match, socket } = await createMatch();

      const session = getSession();
      const userId = session!.user_id;

      setSocket(socket);
      setUserId(userId!);
      setMatchId(match.match_id);
      setInGame(true);

      console.log("🆕 Host ready:", match.match_id);
    } catch (err:any) {
      console.error("❌ Create failed:", {
         code: err.code,
        message: err.message,
      });
    }
  }

  // ✅ JOIN MATCH (PLAYER 2)
  async function handleJoin() {
    try {
      const { match, socket } = await joinMatch(inputId);

      const session = getSession();
      const userId = session!.user_id;

      setSocket(socket);
      setUserId(userId!);
      setMatchId(match.match_id);
      setInGame(true);

      console.log("👥 Joined match:", match.match_id);
    } catch (err : any) {
      console.error("❌ Join failed:", {
        code: err.code,
        message: err.message,
      });
    }
  }

  // 🎮 ENTER GAME
  if (inGame) {
    return <GameBoard socket={socket} matchId={matchId} userId={userId} />;
  }

  // 🧭 LOBBY UI
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center">
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white hover:text-black transition"
        >
          ← Back
        </button>
      </div>

      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center">Private Lobby</h1>

        {/* Create */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-xl">
          <h2 className="text-lg font-semibold mb-4">Create Room</h2>
          <button
            onClick={handleCreate}
            className="w-full bg-green-600 hover:bg-green-500 py-2 rounded-lg transition shadow-md hover:shadow-green-500/30"
          >
            Create Match
          </button>
        </div>

        {/* Join */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-xl">
          <h2 className="text-lg font-semibold mb-4">Join Room</h2>

          <input
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            placeholder="Enter Match ID"
            className="w-full mb-4 px-4 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleJoin}
            className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg transition shadow-md hover:shadow-blue-500/30"
          >
            Join Match
          </button>
        </div>

        {matchId && (
          <div className="text-center text-sm text-zinc-400">
            Match ID: <span className="text-white">{matchId}</span>
          </div>
        )}
      </div>
    </div>
  );
}
