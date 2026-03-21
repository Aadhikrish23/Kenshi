type State = {
  board: string[];
  players: {
    player1: string | null;
    player2: string | null;
  };
  turn: string | null;
  winner: string | null;
  status: "waiting" | "playing" | "finished";
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
  };
}

// =====================
// 🔥 BROADCAST
// =====================
function broadcastState(dispatcher: any, state: State) {
  const payload = JSON.stringify({
    type: "state_update",
    state,
  });

  dispatcher.broadcastMessage(1, payload);
}

// =====================
// 🎮 MATCH FUNCTIONS
// =====================

function matchInit(ctx: any, logger: any, nk: any, params: any) {
  logger.info("🚀 MATCH INIT CALLED 🚀");

  return {
    state: createInitialState(),
    tickRate: 1,
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
  presence: any,
) {
  return { state, accept: true };
}

function matchJoin(
  ctx: any,
  logger: any,
  nk: any,
  dispatcher: any,
  tick: number,
  state: State,
  presence: any,
) {
  logger.info("DEBUG PRESENCE: " + JSON.stringify(presence));
  var userId = presence[0].userId;
  if (!state.players.player1) {
    state.players.player1 = userId;
    logger.info("Player 1 joined: " + userId);
  } else if (!state.players.player2) {
    state.players.player2 = userId;
    logger.info("Player 2 joined: " + userId);
  }

  if (state.players.player1 && state.players.player2) {
    state.status = "playing";
    state.turn = state.players.player1;
    logger.info("Game started");
  }

  broadcastState(dispatcher, state);
  return { state };
}

function matchLeave(
  ctx: any,
  logger: any,
  nk: any,
  dispatcher: any,
  tick: number,
  state: State,
) {
  return { state };
}

function matchLoop(
  ctx: any,
  logger: any,
  nk: any,
  dispatcher: any,
  tick: number,
  state: State,
) {
  broadcastState(dispatcher, state); // ✅ KEEP SYNCING

  return { state };
}

function matchTerminate(
  ctx: any,
  logger: any,
  nk: any,
  dispatcher: any,
  tick: number,
  state: State,
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
  data: string,
) {
  return { state, data };
}

function matchMessage(
  ctx: any,
  logger: any,
  nk: any,
  dispatcher: any,
  tick: number,
  state: State,
  message: any,
) {
  const userId = message.sender.userId;

  let data;
  try {
    data = JSON.parse(message.data);
  } catch {
    logger.info("Invalid message");
    return { state };
  }

  if (state.status !== "playing") return { state };
  if (state.turn !== userId) return { state };

  const index = data.index;

  if (index < 0 || index > 8) return { state };
  if (state.board[index] !== "") return { state };

  const symbol = state.players.player1 === userId ? "X" : "O";

  state.board[index] = symbol;

  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
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
      logger.info("Winner: " + userId);
    }
  }

  if (!state.winner) {
    state.turn =
      state.turn === state.players.player1
        ? state.players.player2
        : state.players.player1;
  }

  broadcastState(dispatcher, state);
  return { state };
}

function createMatchRpc(ctx: any, logger: any, nk: any, payload: string) {
  const matchId = nk.matchCreate("tic-tac-toe");
  logger.info("MATCH CREATED: " + matchId);

  return JSON.stringify({ matchId });
}

function InitModule(ctx: any, logger: any, nk: any, initializer: any) {
  logger.info("🔥 INIT MODULE CALLED 🔥");

  initializer.registerMatch("tic-tac-toe", {
    matchInit,
    matchJoinAttempt,
    matchJoin,
    matchLeave,
    matchLoop,
    matchTerminate,
    matchSignal,
    matchMessage,
  });

  initializer.registerRpc("create_match", createMatchRpc);
}
