import { useGame } from "../../hooks/useGame";

export default function GameBoard({ socket, matchId, userId }: any) {
  const { gameState, makeMove } = useGame(socket, matchId);

  if (!gameState) return <h2>Waiting for game...</h2>;

  return (
    <div>
      <h3>Status: {gameState.status}</h3>
      <h3>Your ID: {userId}</h3>
      <h3>Turn: {gameState.turn}</h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 100px)" }}>
        {gameState.board.map((cell: string, i: number) => (
          <button
            key={i}
            onClick={() => makeMove(i)}
            style={{ width: 100, height: 100, fontSize: 24 }}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}