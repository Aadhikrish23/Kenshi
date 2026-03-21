function createInitialState() {
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
function broadcastState(dispatcher, state) {
    var payload = JSON.stringify({
        type: "state_update",
        state: state,
    });
    dispatcher.broadcastMessage(1, payload);
}
// =====================
// 🎮 MATCH FUNCTIONS
// =====================
function matchInit(ctx, logger, nk, params) {
    logger.info("🚀 MATCH INIT CALLED 🚀");
    return {
        state: createInitialState(),
        tickRate: 1,
        label: JSON.stringify({ open: true }),
    };
}
function matchJoinAttempt(ctx, logger, nk, dispatcher, tick, state, presence) {
    return { state: state, accept: true };
}
function matchJoin(ctx, logger, nk, dispatcher, tick, state, presence) {
    logger.info("DEBUG PRESENCE: " + JSON.stringify(presence));
    var userId = presence[0].userId;
    if (!state.players.player1) {
        state.players.player1 = userId;
        logger.info("Player 1 joined: " + userId);
    }
    else if (!state.players.player2) {
        state.players.player2 = userId;
        logger.info("Player 2 joined: " + userId);
    }
    if (state.players.player1 && state.players.player2) {
        state.status = "playing";
        state.turn = state.players.player1;
        logger.info("Game started");
    }
    broadcastState(dispatcher, state);
    return { state: state };
}
function matchLeave(ctx, logger, nk, dispatcher, tick, state) {
    return { state: state };
}
function matchLoop(ctx, logger, nk, dispatcher, tick, state) {
    broadcastState(dispatcher, state); // ✅ KEEP SYNCING
    return { state: state };
}
function matchTerminate(ctx, logger, nk, dispatcher, tick, state) {
    return { state: state };
}
function matchSignal(ctx, logger, nk, dispatcher, tick, state, data) {
    return { state: state, data: data };
}
function matchMessage(ctx, logger, nk, dispatcher, tick, state, message) {
    var userId = message.sender.userId;
    var data;
    try {
        data = JSON.parse(message.data);
    }
    catch (_a) {
        logger.info("Invalid message");
        return { state: state };
    }
    if (state.status !== "playing")
        return { state: state };
    if (state.turn !== userId)
        return { state: state };
    var index = data.index;
    if (index < 0 || index > 8)
        return { state: state };
    if (state.board[index] !== "")
        return { state: state };
    var symbol = state.players.player1 === userId ? "X" : "O";
    state.board[index] = symbol;
    var winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (var _i = 0, winPatterns_1 = winPatterns; _i < winPatterns_1.length; _i++) {
        var p = winPatterns_1[_i];
        var a = p[0], b = p[1], c = p[2];
        if (state.board[a] &&
            state.board[a] === state.board[b] &&
            state.board[a] === state.board[c]) {
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
    return { state: state };
}
function createMatchRpc(ctx, logger, nk, payload) {
    var matchId = nk.matchCreate("tic-tac-toe");
    logger.info("MATCH CREATED: " + matchId);
    return JSON.stringify({ matchId: matchId });
}
function InitModule(ctx, logger, nk, initializer) {
    logger.info("🔥 INIT MODULE CALLED 🔥");
    initializer.registerMatch("tic-tac-toe", {
        matchInit: matchInit,
        matchJoinAttempt: matchJoinAttempt,
        matchJoin: matchJoin,
        matchLeave: matchLeave,
        matchLoop: matchLoop,
        matchTerminate: matchTerminate,
        matchSignal: matchSignal,
        matchMessage: matchMessage,
    });
    initializer.registerRpc("create_match", createMatchRpc);
}
