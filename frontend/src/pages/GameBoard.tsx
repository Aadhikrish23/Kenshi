import { useEffect, useRef, useState } from "react";
import { useGame } from "../hooks/useGame";
import { useNavigate } from "react-router-dom";
import Modal from "../components/ui/Modal";

export default function GameBoard({ socket, matchId, userId, isAutomated }: any) {
  const { gameState, makeMove, error, isReady } = useGame(socket, matchId); // ✅ FIX
  const unloadRef = useRef<any>(null);
  const navigate = useNavigate();
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  /**
   * 🚨 Prevent refresh
   */
  useEffect(() => {
    unloadRef.current = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", unloadRef.current);

    return () => {
      window.removeEventListener("beforeunload", unloadRef.current);
    };
  }, []);

  /**
   * ⏳ WAIT UNTIL SOCKET + STATE READY
   */
  if (!isReady || !gameState) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        <h2 className="text-xl font-semibold animate-pulse">
          {isAutomated ? "Joining Match..." : "Waiting for opponent..."}
        </h2>

        {!isAutomated && (
          <div className="text-center space-y-4">
            <p className="text-sm text-zinc-400">Match ID: {matchId}</p>
            <button
              onClick={() => navigator.clipboard.writeText(matchId)}
              className="px-4 py-2 bg-blue-600 rounded-lg text-sm"
            >
              Copy Match ID
            </button>
          </div>
        )}
      </div>
    );
  }

  /**
   * 🎮 Game Logic
   */
  const isMyTurn = gameState.turn === userId;
  const isGameActive = gameState.status === "playing";

  const handleClick = (index: number) => {
    if (!isReady) return; // ✅ CRITICAL FIX
    if (!isGameActive) return;
    if (!isMyTurn) return;
    if (gameState.board[index] !== "") return;

    makeMove(index);
  };

  const mySymbol =
    gameState.players.player1 === userId ? "X" : "O";

  /**
   * 🎯 UI
   */
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-zinc-900 to-black text-white flex flex-col items-center justify-center space-y-6">
      
      {/* HEADER */}
      <div className="w-full flex justify-between items-center mb-4 px-6">
        <button
          onClick={() => {
            if (gameState.status === "playing") {
              setShowLeaveModal(true);
            } else {
              navigate("/");
            }
          }}
          className="px-4 py-2 border border-white/30 rounded-lg hover:bg-white hover:text-black transition"
        >
          ← Back
        </button>

        <div className="text-sm text-zinc-400">
          Match ID: {matchId.slice(0, 6)}...
        </div>
      </div>

      {/* WARNING */}
      <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-300 px-4 py-2 rounded-lg text-sm">
        ⚠️ Do not refresh during a match
      </div>

      {/* STATUS */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-wide">
          {gameState.status === "finished" ? (
            "Game Over"
          ) : isMyTurn ? (
            <span className="text-green-400 animate-pulse">🟢 Your Turn</span>
          ) : (
            <span className="text-red-400">🔴 Opponent's Turn</span>
          )}
        </h2>

        <p className="text-zinc-400 text-sm">
          Playing as{" "}
          <span className="text-white font-semibold text-lg">
            {mySymbol}
          </span>
        </p>

        {/* RESULT */}
        {gameState.status === "finished" && (
          <div className="mt-2">
            {gameState.winner ? (
              gameState.winner === userId ? (
                <p className="text-green-400 text-2xl font-bold animate-bounce">
                  🏆 Victory!
                </p>
              ) : (
                <p className="text-red-400 text-2xl font-bold animate-pulse">
                  💀 Defeat
                </p>
              )
            ) : (
              <p className="text-yellow-400 text-xl font-semibold">
                🤝 It's a Draw
              </p>
            )}
          </div>
        )}

        {gameState.reason === "disconnect" && (
          <div className="mt-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-red-400 text-sm">⚠ Opponent disconnected</p>
          </div>
        )}
      </div>

      {/* BOARD */}
      <div className="p-4 rounded-2xl bg-white/5 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
        <div className="grid grid-cols-3 gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10">
          {gameState.board.map((cell: string, i: number) => {
            const isClickable =
              isReady &&
              isGameActive &&
              isMyTurn &&
              cell === "";

            return (
              <button
                key={i}
                onClick={() => handleClick(i)}
                disabled={!isClickable} // ✅ prevents spam
                className={`w-24 h-24 flex items-center justify-center text-3xl font-bold rounded-xl 
                ${isClickable ? "bg-black/40 hover:bg-white/10" : "bg-black/20 opacity-50 cursor-not-allowed"}
                transition active:scale-90`}
              >
                {cell === "X" ? "❌" : cell === "O" ? "⭕" : ""}
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* LEAVE MODAL */}
      <Modal
        isOpen={showLeaveModal}
        title="Leave Match?"
        message="Leaving now will forfeit the match. Are you sure?"
        confirmText="Leave"
        cancelText="Stay"
        onCancel={() => setShowLeaveModal(false)}
        onConfirm={() => {
          try {
            socket?.disconnect(false);
          } catch {}

          setShowLeaveModal(false);
          navigate("/");
        }}
      />
    </div>
  );
}