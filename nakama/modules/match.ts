export {};

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

const matchInit = function (ctx: any, logger: any, nk: any, params: any) {
  const state = createInitialState();

  return {
    state: state,
    tickRate: 1,
    label: "tic-tac-toe",
  };
};

const matchJoin = function (
  ctx: any,
  logger: any,
  nk: any,
  dispatcher: any,
  tick: any,
  state: State,
  presence: any,
) {
  const userId = presence.userId;

  if (!state.players.player1) {
    state.players.player1 = userId;
    logger.info("Player 1 joined: " + userId);
  }
  else if (!state.players.player2) {
    state.players.player2 = userId;
    logger.info("Player 2 joined: " + userId);
  }

  // Start game when 2 players join
  if (state.players.player1 && state.players.player2) {
    state.status = "playing";
    state.turn = state.players.player1;
    logger.info("Game started");
  }

  return {state}
};

const matchMessage = function (
  ctx: any,
  logger: any,
  nk: any,
  dispatcher: any,
  tick: number,
  state: State,
  message: any
) {
  const userId = message.sender.userId;
  const data = JSON.parse(message.data);

  // Only allow moves when game is playing
  if (state.status !== "playing") {
    return { state };
  }

  // Validate turn
  if (state.turn !== userId) {
    logger.info("Not your turn");
    return { state };
  }

  const index = data.index;

  // Validate index
  if (index < 0 || index > 8) {
    return { state };
  }

  // Check if cell empty
  if (state.board[index] !== "") {
    return { state };
  }

  // Assign symbol
  const symbol =
    state.players.player1 === userId ? "X" : "O";

  // Apply move
  state.board[index] = symbol;

  // Check winner
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
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

  // Switch turn if no winner
  if (!state.winner) {
    state.turn =
      state.turn === state.players.player1
        ? state.players.player2
        : state.players.player1;
  }

  // Broadcast updated state
  dispatcher.broadcastMessage(
    1,
    JSON.stringify({
      type: "state_update",
      state: state,
    })
  );

  return { state };
};

const matchHandler = {
  matchInit,
  matchJoin,
  matchLoop: function (
    ctx: any,
    logger: any,
    nk: any,
    dispatcher: any,
    tick: number,
    state: State
  ) {
    return { state };
  },
  matchMessage,
};

function InitModule(ctx: any, logger: any, nk: any, initializer: any) {
  initializer.registerMatch("tic-tac-toe", matchHandler);
}