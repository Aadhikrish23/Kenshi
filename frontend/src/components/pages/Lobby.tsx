import { useState, useRef } from "react";
import { connectToNakama, createMatch, joinMatch } from "../../services/nakamaClient";
import GameBoard from "./GameBoard";

export default function Lobby() {
  const [matchId, setMatchId] = useState("");
  const [inputId, setInputId] = useState("");
  const [socket, setSocket] = useState<any>(null);
  const [userId, setUserId] = useState("");
  const [inGame, setInGame] = useState(false);

  const hasConnected = useRef(false);


async function handleCreate() {
  const { socket, userId } = await connectToNakama();

  setSocket(socket);
  setUserId(userId!);

  const id = await createMatch(socket);
  setMatchId(id);

  await joinMatch(socket, id);

  setInGame(true);
}

async function handleJoin() {
  const { socket, userId } = await connectToNakama();

  setSocket(socket);
  setUserId(userId!);

  const match = await joinMatch(socket, inputId);

  setMatchId(match.match_id);
  setInGame(true);
}

  if (inGame) {
    return (
      <GameBoard socket={socket} matchId={matchId} userId={userId} />
    );
  }

  return (
    <div>
      <button onClick={handleCreate}>Create Match</button>

      <input
        value={inputId}
        onChange={(e) => setInputId(e.target.value)}
        placeholder="Enter Match ID"
      />

      <button onClick={handleJoin}>Join Match</button>
    </div>
  );
}