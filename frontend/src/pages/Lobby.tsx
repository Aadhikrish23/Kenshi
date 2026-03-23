import { useEffect, useState } from "react";
import GameBoard from "./GameBoard";
import { createMatch, joinMatch } from "../services/nakama/match";
import { connectToNakama } from "../services/nakama/socket";

export default function Lobby() {
  const [matchId, setMatchId] = useState("");
  const [inputId, setInputId] = useState("");
  const [socket, setSocket] = useState<any>(null);
  const [userId, setUserId] = useState("");
  const [inGame, setInGame] = useState(false);

  async function handleCreate() {
    const { socket, userId } = await connectToNakama();

    const res = await createMatch();
    const id = res.matchId;

    

    await joinMatch(id);

    setSocket(socket);
    setUserId(userId);
    setMatchId(id);
    setInGame(true);
  }

  async function handleJoin() {
    const { socket, userId } = await connectToNakama();

    const match = await joinMatch(inputId);

    

    setSocket(socket);
    setUserId(userId);
    setMatchId(match.match_id);
    setInGame(true);
  }

 



  if (inGame) {
    return (
      <GameBoard socket={socket} matchId={matchId} userId={userId} />
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center">
          Private Lobby
        </h1>

        {/* Create */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Create Room</h2>
          <button
            onClick={handleCreate}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 transition"
          >
            Create Match
          </button>
        </div>

        {/* Join */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Join Room</h2>

          <input
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            placeholder="Enter Match ID"
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-blue-500"
          />

          <button
            onClick={handleJoin}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition"
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