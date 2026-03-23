import { useGame } from "../hooks/useGame";

export default function GameBoard({ socket, matchId, userId }: any) {
  const { gameState, makeMove, error } = useGame(socket, matchId);

  if (!gameState) {
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-zinc-900 to-black text-white flex flex-col items-center justify-center space-y-6">

      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-zinc-300 animate-pulse">
        Waiting for opponent...
      </h2>

      {/* Info */}
      <div className="text-center space-y-2">
        <p className="text-sm text-zinc-500">
          Share your match ID or wait for someone to join
        </p>

        <p className="text-sm text-zinc-400">
          Match ID: <span className="text-white font-medium">{matchId}</span>
        </p>
      </div>

      {/* Copy Button */}
      <button
        onClick={() => navigator.clipboard.writeText(matchId)}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all rounded-lg text-sm font-medium shadow-md"
      >
        Copy Match ID
      </button>

    </div>
  );
}

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

  // const opponentId =
  //   gameState.players.player1 === userId
  //     ? gameState.players.player2
  //     : gameState.players.player1;
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-zinc-900 to-black text-white flex flex-col items-center justify-center space-y-6">
      {/* Status */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          {gameState.status === "finished"
            ? "Game Over"
            : isMyTurn
              ? "Your Turn"
              : "Opponent's Turn"}
        </h2>

        <p className="text-zinc-400">You are: {mySymbol}</p>

        {gameState.status === "finished" && (
          <p className="text-xl">
            {gameState.winner
              ? gameState.winner === userId
                ? "🏆 You Win"
                : "💀 You Lose"
              : "🤝 Draw"}
          </p>
        )}

        {gameState.reason === "disconnect" && (
          <p className="text-red-400">Opponent disconnected</p>
        )}
      </div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10">
        {gameState.board.map((cell: string, i: number) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="
            w-24 h-24 
            flex items-center justify-center 
            text-3xl font-bold 
            rounded-xl 
            bg-black/40 
            hover:bg-blue-600/30 
            transition
          "
          >
            {cell === "X" ? "❌" : cell === "O" ? "⭕" : ""}
          </button>
        ))}
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
