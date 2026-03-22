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
        reason: null,
        initialStateSent: false,
    };
}
// 🔥 BROADCAST
function broadcastState(dispatcher, state) {
    var payload = JSON.stringify({
        type: "state_update",
        state: state,
    });
    dispatcher.broadcastMessage(2, payload); // OP_STATE
}
// =====================
// MATCH FUNCTIONS
// =====================
function matchInit(ctx, logger, nk, params) {
    logger.info("🚀 MATCH INIT CALLED 🚀");
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
    logger.info("DEBUG PRESENCES: " + JSON.stringify(presences));
    // ⚠️ IMPORTANT: do NOT assume only 1 presence
    for (var _i = 0, presences_1 = presences; _i < presences_1.length; _i++) {
        var p = presences_1[_i];
        var userId = p.userId;
        if (!state.players.player1) {
            state.players.player1 = userId;
            logger.info("Player 1 joined: " + userId);
        }
        else if (!state.players.player2 && userId !== state.players.player1) {
            state.players.player2 = userId;
            logger.info("Player 2 joined: " + userId);
        }
    }
    // ✅ START GAME ONLY WHEN BOTH PRESENT
    if (state.players.player1 && state.players.player2) {
        state.status = "playing";
        state.turn = state.players.player1;
        logger.info("Game started");
        state.reason = null;
    }
    // 🔥 CRITICAL: send state ONLY to active presences
    return { state: state };
}
function matchLeave(ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function (presence) {
        var userId = presence.userId;
        logger.info("❌ Player left: " + userId);
        // If game is still ongoing
        if (state.status === "playing") {
            var winner = userId === state.players.player1
                ? state.players.player2
                : state.players.player1;
            state.status = "finished";
            state.winner = winner;
            state.reason = "disconnect";
            dispatcher.broadcastMessage(1, JSON.stringify({
                type: "state_update",
                state: state,
            }));
        }
    });
    return { state: state };
}
// ✅ Controlled loop (NOT spammy, but keeps sync)
function matchLoop(ctx, logger, nk, dispatcher, tick, state, messages) {
    if (state.status === "playing" && !state.initialStateSent) {
        logger.info("📡 Sending initial state to all players");
        dispatcher.broadcastMessage(1, JSON.stringify({
            type: "state_update",
            state: state,
        }));
        state.initialStateSent = true;
    }
    // 🔥 HANDLE PLAYER MOVES HERE
    for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
        var message = messages_1[_i];
        logger.info("🔥 MESSAGE RECEIVED 🔥");
        logger.info("opCode: " + message.opCode);
        if (message.opCode !== 1)
            continue;
        var userId = message.sender.userId;
        var data = void 0;
        try {
            data = JSON.parse(nk.binaryToString(message.data));
        }
        catch (_a) {
            logger.info("❌ Invalid data");
            continue;
        }
        logger.info("Move from: " + userId + " index: " + data.index);
        // ❌ GAME NOT STARTED
        if (state.status !== "playing")
            continue;
        if (state.status === "playing" && !state.initialStateSent) {
            logger.info("📡 Sending initial state to all players");
            dispatcher.broadcastMessage(1, JSON.stringify({
                type: "state_update",
                state: state,
            }));
            state.initialStateSent = true;
        }
        // ❌ NOT PLAYER TURN
        if (state.turn !== userId) {
            logger.info("❌ Not your turn");
            dispatcher.broadcastMessage(2, JSON.stringify({
                type: "error",
                message: "Not your turn",
                userId: userId,
            }));
            continue;
        }
        var index = data.index;
        // ❌ INVALID MOVE
        if (index < 0 || index > 8) {
            dispatcher.broadcastMessage(2, JSON.stringify({
                type: "error",
                message: "Invalid Cell Selection",
                userId: userId,
            }));
            continue;
        }
        if (state.board[index] !== "") {
            dispatcher.broadcastMessage(2, JSON.stringify({
                type: "error",
                message: "Cell already filled",
                userId: userId,
            }));
            continue;
        }
        var symbol = state.players.player1 === userId ? "X" : "O";
        state.board[index] = symbol;
        // 🏆 WIN CHECK
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
        for (var _b = 0, winPatterns_1 = winPatterns; _b < winPatterns_1.length; _b++) {
            var p = winPatterns_1[_b];
            var a = p[0], b = p[1], c = p[2];
            if (state.board[a] &&
                state.board[a] === state.board[b] &&
                state.board[a] === state.board[c]) {
                state.winner = userId;
                state.status = "finished";
                logger.info("🏆 Winner: " + userId);
            }
        }
        if (!state.winner) {
            var isBoardFull = state.board.every(function (cell) { return cell !== ""; });
            if (isBoardFull) {
                state.status = "finished";
                logger.info("🤝 Game Draw");
            }
        }
        // 🔁 SWITCH TURN
        if (!state.winner && state.status !== "finished") {
            state.turn =
                state.turn === state.players.player1
                    ? state.players.player2
                    : state.players.player1;
        }
        // 📡 BROADCAST UPDATED STATE
        if (messages.length > 0) {
            dispatcher.broadcastMessage(1, JSON.stringify({
                type: "state_update",
                state: state,
            }));
        }
    }
    return { state: state };
}
function matchTerminate(ctx, logger, nk, dispatcher, tick, state) {
    return { state: state };
}
function matchSignal(ctx, logger, nk, dispatcher, tick, state, data) {
    return { state: state, data: data };
}
function createMatchRpc(ctx, logger, nk, payload) {
    var matchId = nk.matchCreate("tic-tac-toe", {});
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
    });
    initializer.registerRpc("create_match", createMatchRpc);
}
