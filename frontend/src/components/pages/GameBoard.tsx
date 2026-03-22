import { useGame } from "../../hooks/useGame";

export default function GameBoard({ socket, matchId, userId }: any) {
  const { gameState, makeMove, error } = useGame(socket, matchId);

  if (!gameState) return <h2>Waiting for game...</h2>;

  // ✅ Core conditions
  const isMyTurn = gameState.turn === userId;
  const isGameActive = gameState.status === "playing";

  // ✅ Safe click handler
  const handleClick = (index: number) => {
    if (!isGameActive) return;
    if (!isMyTurn) return;
    if (gameState.board[index] !== "") return;

    makeMove(index);
  };
  const mySymbol = gameState.players.player1 === userId ? "X" : "O";

  const opponentId =
    gameState.players.player1 === userId
      ? gameState.players.player2
      : gameState.players.player1;
  return (
    <div>
      <h3>You are: {mySymbol}</h3>
      {gameState.status === "finished" && (
        <h2>
          {gameState.winner
            ? gameState.winner === userId
              ? `🏆 You Win (${mySymbol})`
              : `💀 You Lose (${mySymbol})`
            : "🤝 Draw!"}
        </h2>
      )}
      {gameState.reason === "disconnect" && <h3>⚠️ Opponent disconnected</h3>}
      {gameState.status === "playing" && (
        <h3>
          {gameState.turn === userId
            ? `Your Turn (${mySymbol})`
            : `Opponent's Turn (${mySymbol === "X" ? "O" : "X"})`}
        </h3>
      )}

      <h2>
        {gameState.status === "finished"
          ? "Game Over"
          : isMyTurn
            ? "Your Turn"
            : "Opponent's Turn"}
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 100px)" }}>
        {gameState.board.map((cell: string, i: number) => (
          <button
            key={i}
            onClick={() => {
              handleClick(i);
            }}
            style={{ width: 100, height: 100, fontSize: 24 }}
          >
            {cell === "X" ? "❌" : cell === "O" ? "⭕" : ""}
          </button>
        ))}

        {error && <h4 style={{ color: "red" }}>{error}</h4>}
      </div>
    </div>
  );
}
