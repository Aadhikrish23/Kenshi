import { useEffect, useState } from "react";
import {
  connectToNakama,
  createMatch,
  joinMatch,
} from "../../services/nakamaClient";
import Game from "./GameBoard";
function Lobby() {
  const [socket, setSocket] = useState<any>(null);
  const [userId, setUserId] = useState<string>("");
  const [matchId, setMatchId] = useState("");
  const [inputId, setInputId] = useState("");
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    async function init() {
      try {
        const { client, session, socket, userId } = await connectToNakama();
        if (!socket || !userId) {
          return;
        }
        setClient(client);
        setSession(session);
        setSocket(socket);
        setUserId(userId);

        setSocket(socket);
        setUserId(userId);
      } catch (err) {
        console.error("Connection failed:", err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  // 🎮 CREATE
async function handleCreate() {
  if (!socket || !client || !session) return;

  try {
    const id = await createMatch(client, session);

    await socket.joinMatch(id);

    setMatchId(id);
  } catch (err) {
    console.error("Create failed:", err);
  }
}

  // 🔗 JOIN
  async function handleJoin() {
    if (!socket || !inputId) return;

    try {
      const cleanId = inputId.trim();

      console.log("Joining with ID:", cleanId);

      await joinMatch(socket, cleanId);

      setMatchId(cleanId);
    } catch (err) {
      console.error("Join failed:", err);
    }
  }

  if (loading) {
    return <div style={{ padding: "20px" }}>Connecting...</div>;
  }

  if (matchId && socket) {
    return <Game socket={socket} matchId={matchId} userId={userId} />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tic Tac Toe</h2>

      <button onClick={handleCreate}>Create Match</button>

      {matchId && (
        <>
          <p>Match ID: {matchId}</p>
          <button onClick={() => navigator.clipboard.writeText(matchId)}>
            Copy ID
          </button>
        </>
      )}

      <hr />

      <input
        style={{ width: "400px" }}
        placeholder="Enter Match ID"
        value={inputId}
        onChange={(e) => setInputId(e.target.value)}
      />

      <button onClick={handleJoin}>Join Match</button>
    </div>
  );
}

export default Lobby;
