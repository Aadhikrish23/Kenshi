import { useEffect, useState } from "react";
import "./App.css";
import { connectToNakama, createMatch, joinMatch } from "./nakama";

function App() {
  const [socket, setSocket] = useState<any>(null);
  const [matchId, setMatchId] = useState("");
  const [inputId, setInputId] = useState("");

  // Connect once
  useEffect(() => {
    async function init() {
      const { socket } = await connectToNakama();
      setSocket(socket);
    }

    init();
  }, []);

  // Create + auto join
  async function handleCreate() {
    if (!socket) return;

    const id = await createMatch(socket);
    await joinMatch(socket, id); // IMPORTANT

    console.log("MATCH ID:", id);
    setMatchId(id);
  }

  // Join existing match
  async function handleJoin() {
    if (!socket || !inputId) return;

    const data = await joinMatch(socket, inputId);
    console.log("Joined:", data);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tic Tac Toe Test</h2>
      <button onClick={handleCreate}>Create Match</button>
      {matchId && <p>Match ID: {matchId}</p>}
      <button onClick={() => navigator.clipboard.writeText(matchId)}>
  Copy ID
</button>
      <hr />
      <input
        style={{ width: "400px" }} // 👈 important
        placeholder="Enter Match ID"
        value={inputId}
        onChange={(e) => setInputId(e.target.value)}
      />
      <button onClick={handleJoin}>Join Match</button>
    </div>
  );
}

export default App;
