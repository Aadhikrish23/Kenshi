function createInitialState() {
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
    dispatcher.broadcastMessage(1, JSON.stringify({
        type: "state_update",
        state: state,
    }), null // ✅ THIS IS CORRECT IN JS RUNTIME
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
    return { state: state, accept: true };
}
function matchJoin(ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function (p) {
        if (!state.players.player1) {
            state.players.player1 = p.userId;
            logger.error("Player1 joined: " + p.userId);
        }
        else if (!state.players.player2) {
            state.players.player2 = p.userId;
            logger.error("Player2 joined: " + p.userId);
        }
    });
    broadcastState(dispatcher, state);
    return { state: state };
}
function matchLeave(ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function (p) {
        var userId = p.userId;
        logger.error("❌ Player left: " + userId);
        if (state.status === "playing") {
            var winner = userId === state.players.player1
                ? state.players.player2
                : state.players.player1;
            state.status = "finished";
            state.winner = winner;
            state.reason = "disconnect";
            broadcastState(dispatcher, state);
        }
    });
    return { state: state };
}
function matchLoop(ctx, logger, nk, dispatcher, tick, state, messages) {
    var stateChanged = false;
    // 🎮 Start game
    if (state.players.player1 &&
        state.players.player2 &&
        state.status === "waiting") {
        state.status = "playing";
        state.turn = state.players.player1;
        stateChanged = true;
        logger.error("🎮 GAME STARTED");
    }
    // 🎯 Moves
    for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
        var msg = messages_1[_i];
        if (msg.opCode !== 1)
            continue;
        var userId = msg.sender.userId;
        var data = JSON.parse(nk.binaryToString(msg.data));
        var index = data.index;
        if (state.status !== "playing")
            continue;
        if (state.turn !== userId)
            continue;
        if (state.board[index] !== "")
            continue;
        var symbol = state.players.player1 === userId ? "X" : "O";
        state.board[index] = symbol;
        stateChanged = true;
        // ✅ WIN CHECK
        var winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];
        for (var _a = 0, winPatterns_1 = winPatterns; _a < winPatterns_1.length; _a++) {
            var _b = winPatterns_1[_a], a = _b[0], b = _b[1], c = _b[2];
            if (state.board[a] &&
                state.board[a] === state.board[b] &&
                state.board[a] === state.board[c]) {
                state.winner = userId;
                state.status = "finished";
            }
        }
        // draw
        if (!state.winner && state.board.every(function (c) { return c !== ""; })) {
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
    return { state: state };
}
function matchTerminate(ctx, logger, nk, dispatcher, tick, state) {
    return { state: state };
}
function matchSignal(ctx, logger, nk, dispatcher, tick, state, data) {
    return { state: state, data: data };
}
function matchmakerMatched(ctx, logger, nk, entries) {
    return nk.matchCreate("tic-tac-toe", {});
}
function createMatchRpc(ctx, logger, nk, payload) {
    var matchId = nk.matchCreate("tic-tac-toe", {});
    logger.error("MATCH CREATED: " + matchId);
    return JSON.stringify({ matchId: matchId });
}
function InitModule(ctx, logger, nk, initializer) {
    initializer.registerMatch("tic-tac-toe", {
        matchInit: matchInit,
        matchJoinAttempt: matchJoinAttempt,
        matchJoin: matchJoin,
        matchLeave: matchLeave,
        matchLoop: matchLoop,
        matchTerminate: matchTerminate,
        matchSignal: matchSignal,
    });
    initializer.registerMatchmakerMatched(matchmakerMatched);
    initializer.registerRpc("create_match", createMatchRpc);
}
