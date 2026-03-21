import React from "react";
import { useGame } from "../../hooks/useGame";

type Props = {
  socket: any;
  matchId: string;
  userId: string;
};

export default function Game({ socket, matchId,userId  }: Props) {
   console.log("inside game:socket:",socket,"matchid:",matchId,"userid",userId);
  const { gameState, makeMove } = useGame(socket, matchId);
  console.log("gameState",gameState);

  if (!gameState) return <div>Waiting for game...</div>;

const isMyTurn = gameState.turn === userId;
  return (
    <div>
      <h2>Tic Tac Toe</h2>

      <h3>
        {gameState.winner
          ? "Game Over"
          : isMyTurn
          ? "Your Turn"
          : "Opponent Turn"}
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 100px)",
          gap: "5px",
        }}
      >
        {gameState.board.map((cell: string, index: number) => {
          const isDisabled =
            cell !== "" || !isMyTurn || gameState.status !== "playing";

          return (
            <div
              key={index}
              onClick={() => {
                if (!isDisabled) makeMove(index);
              }}
              style={{
                width: 100,
                height: 100,
                border: "1px solid black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                cursor: isDisabled ? "not-allowed" : "pointer",
                backgroundColor: isDisabled ? "#eee" : "#fff",
              }}
            >
              {cell}
            </div>
          );
        })}
      </div>

      <p>Status: {gameState.status}</p>
      <p>Winner: {gameState.winner || "None"}</p>
    </div>
  );
}