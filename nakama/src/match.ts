type State = {
  board: string[];
  players: {
    player1: string | null;
    player2: string | null;
  };
  turn: string | null;
  winner: string | null;
  reason: string | null;
  status: "waiting" | "playing" | "finished";
};

function createInitialState(): State {
  return {
    board: ["", "", "", "", "", "", "", "", ""],
    players: { player1: null, player2: null },
    turn: null,
    winner: null,
    reason: null,
    status: "waiting",
  };
}

function broadcastState(dispatcher, state) {
  dispatcher.broadcastMessage(
    1,
    JSON.stringify({
      type: "state_update",
      state,
    }),
    null // ✅ THIS IS CORRECT IN JS RUNTIME
  );
}

// =====================

function matchInit(ctx, logger, nk, params) {
  logger.error("🚀 MATCH INIT");

  return {
    state: createInitialState(),
    tickRate: 10,
    label: JSON.stringify({ open: true }),
  };
}

function matchJoinAttempt(ctx, logger, nk, dispatcher, tick, state, presence) {
  return { state, accept: true };
}

function matchJoin(ctx, logger, nk, dispatcher, tick, state, presences) {
  presences.forEach(p => {
    if (!state.players.player1) {
      state.players.player1 = p.userId;
      logger.error("Player1 joined: " + p.userId);
    } else if (!state.players.player2) {
      state.players.player2 = p.userId;
      logger.error("Player2 joined: " + p.userId);
    }
  });

    broadcastState(dispatcher, state);

  return { state };
}

function matchLeave(ctx, logger, nk, dispatcher, tick, state, presences) {
  presences.forEach((p) => {
    const userId = p.userId;

    logger.error("❌ Player left: " + userId);

    if (state.status === "playing") {
      const winner =
        userId === state.players.player1
          ? state.players.player2
          : state.players.player1;

      state.status = "finished";
      state.winner = winner;
      state.reason = "disconnect";

      broadcastState(dispatcher, state);
    }
  });

  return { state };
}

function matchLoop(ctx, logger, nk, dispatcher, tick, state, messages) {
  let stateChanged = false;

  // 🎮 Start game
  if (
    state.players.player1 &&
    state.players.player2 &&
    state.status === "waiting"
  ) {
    state.status = "playing";
    state.turn = state.players.player1;
    stateChanged = true;

    logger.error("🎮 GAME STARTED");
  }

  // 🎯 Moves
  for (const msg of messages) {
    if (msg.opCode !== 1) continue;

    const userId = msg.sender.userId;
    const data = JSON.parse(nk.binaryToString(msg.data));
    const index = data.index;

    if (state.status !== "playing") continue;
    if (state.turn !== userId) continue;
    if (state.board[index] !== "") continue;

    const symbol =
      state.players.player1 === userId ? "X" : "O";

    state.board[index] = symbol;
    stateChanged = true;

    // ✅ WIN CHECK
    const winPatterns = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6],
    ];

    for (let [a,b,c] of winPatterns) {
      if (
        state.board[a] &&
        state.board[a] === state.board[b] &&
        state.board[a] === state.board[c]
      ) {
        state.winner = userId;
        state.status = "finished";
      }
    }

    // draw
    if (!state.winner && state.board.every(c => c !== "")) {
      state.status = "finished";
    }

    // switch turn
    if (state.status === "playing") {
      state.turn =
        state.turn === state.players.player1
          ? state.players.player2
          : state.players.player1;
    }
  }

  // ✅ Broadcast only if changed
  if (stateChanged) {
    broadcastState(dispatcher, state);
  }

  return { state };
}

function matchTerminate(ctx, logger, nk, dispatcher, tick, state) {
  return { state };
}

function matchSignal(ctx, logger, nk, dispatcher, tick, state, data) {
  return { state, data };
}

function matchmakerMatched(ctx, logger, nk, entries) {
  return nk.matchCreate("tic-tac-toe", {});
}

function createMatchRpc(ctx, logger, nk, payload) {
  const matchId = nk.matchCreate("tic-tac-toe", {});
  logger.error("MATCH CREATED: " + matchId);

  return JSON.stringify({ matchId });
}

function InitModule(ctx, logger, nk, initializer) {
  initializer.registerMatch("tic-tac-toe", {
    matchInit,
    matchJoinAttempt,
    matchJoin,
    matchLeave,
    matchLoop,
    matchTerminate,
    matchSignal,
  });

  initializer.registerMatchmakerMatched(matchmakerMatched);
  initializer.registerRpc("create_match", createMatchRpc);
}