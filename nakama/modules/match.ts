type State = {
  board: string[];
  players: {
    player1: string | null;
    player2: string | null;
  };
  turn: string | null;
  winner: string | null;
  status: "waiting" | "playing" | "finished";
   initialStateSent: boolean,
  
};

function createInitialState(): State {
  return {
    board: ["", "", "", "", "", "", "", "", ""],
    players: {
      player1: null,
      player2: null,
    },
    turn: null,
    winner: null,
    status: "waiting",
     initialStateSent: false,
  };
}

// 🔥 BROADCAST
function broadcastState(dispatcher: any, state: State) {
  const payload = JSON.stringify({
    type: "state_update",
    state,
  });

  dispatcher.broadcastMessage(2, payload); // OP_STATE
}

// =====================
// MATCH FUNCTIONS
// =====================

function matchInit(ctx: any, logger: any, nk: any, params: any) {
  logger.info("🚀 MATCH INIT CALLED 🚀");

  return {
    state: createInitialState(),
    tickRate: 10,
    label: JSON.stringify({ open: true }),
  };
}

function matchJoinAttempt(
  ctx: any,
  logger: any,
  nk: any,
  dispatcher: any,
  tick: number,
  state: State,
  presence: any
) {
  return { state, accept: true };
}

function matchJoin(ctx, logger, nk, dispatcher, tick, state, presences) {
  logger.info("DEBUG PRESENCES: " + JSON.stringify(presences));

  // ⚠️ IMPORTANT: do NOT assume only 1 presence
  for (const p of presences) {
    const userId = p.userId;

    if (!state.players.player1) {
      state.players.player1 = userId;
      logger.info("Player 1 joined: " + userId);
    } else if (!state.players.player2 && userId !== state.players.player1) {
      state.players.player2 = userId;
      logger.info("Player 2 joined: " + userId);
    }
  }

  // ✅ START GAME ONLY WHEN BOTH PRESENT
  if (state.players.player1 && state.players.player2) {
    state.status = "playing";
    state.turn = state.players.player1;
    logger.info("Game started");
  }

  // 🔥 CRITICAL: send state ONLY to active presences
  dispatcher.broadcastMessage(
    2,
    JSON.stringify({
      type: "state_update",
      state: state,
    })
  );

  return { state };
}

function matchLeave(
  ctx: any,
  logger: any,
  nk: any,
  dispatcher: any,
  tick: number,
  state: State
) {
  return { state };
}

// ✅ Controlled loop (NOT spammy, but keeps sync)
function matchLoop(ctx, logger, nk, dispatcher, tick, state, messages) {

  // 🔥 HANDLE PLAYER MOVES HERE
  for (const message of messages) {
    logger.info("🔥 MESSAGE RECEIVED 🔥");
    logger.info("opCode: " + message.opCode);

    if (message.opCode !== 1) continue;

    const userId = message.sender.userId;

    let data;
    try {
      data = JSON.parse(nk.binaryToString(message.data));
    } catch {
      logger.info("❌ Invalid data");
      continue;
    }

    logger.info("Move from: " + userId + " index: " + data.index);

    // ❌ GAME NOT STARTED
    if (state.status !== "playing") continue;

    // ❌ NOT PLAYER TURN
    if (state.turn !== userId) {
      logger.info("❌ Not your turn");
      continue;
    }

    const index = data.index;

    // ❌ INVALID MOVE
    if (index < 0 || index > 8) continue;
    if (state.board[index] !== "") continue;

    const symbol = state.players.player1 === userId ? "X" : "O";

    state.board[index] = symbol;

    // 🏆 WIN CHECK
    const winPatterns = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    for (let p of winPatterns) {
      const [a, b, c] = p;

      if (
        state.board[a] &&
        state.board[a] === state.board[b] &&
        state.board[a] === state.board[c]
      ) {
        state.winner = userId;
        state.status = "finished";
        logger.info("🏆 Winner: " + userId);
      }
    }

    // 🔁 SWITCH TURN
    if (!state.winner) {
      state.turn =
        state.turn === state.players.player1
          ? state.players.player2
          : state.players.player1;
    }

    // 📡 BROADCAST UPDATED STATE
    dispatcher.broadcastMessage(
      2,
      JSON.stringify({ type: "state_update", state })
    );
  }

  return { state };
}

function matchTerminate(
  ctx: any,
  logger: any,
  nk: any,
  dispatcher: any,
  tick: number,
  state: State
) {
  return { state };
}

function matchSignal(
  ctx: any,
  logger: any,
  nk: any,
  dispatcher: any,
  tick: number,
  state: State,
  data: string
) {
  return { state, data };
}



function createMatchRpc(ctx: any, logger: any, nk: any, payload: string) {
  const matchId = nk.matchCreate("tic-tac-toe", {});
  logger.info("MATCH CREATED: " + matchId);

  return JSON.stringify({ matchId });
}

function InitModule(ctx: any, logger: any, nk: any, initializer: any) {
  logger.info("🔥 INIT MODULE CALLED 🔥");

  initializer.registerMatch("tic-tac-toe", {
  matchInit: matchInit,
  matchJoinAttempt: matchJoinAttempt,
  matchJoin: matchJoin,
  matchLeave: matchLeave,
  matchLoop: matchLoop,
  matchTerminate: matchTerminate,
  matchSignal: matchSignal,
});

  initializer.registerRpc("create_match", createMatchRpc);
}