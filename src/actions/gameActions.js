export function makeMove(payload = {}) {
    return JSON.stringify({
        type: 'game/move',
        pgn: payload.pgn
    });
}

export function connectToGame(payload = {}) {
    return JSON.stringify({
        type: 'game/connect',
        id: payload.id,
        orientation: payload.orientation,
        isPlayer: payload.isPlayer,
        pgn: payload.pgn
    });
}

export function error({ error }) {
    return JSON.stringify({
        type: 'game/error',
        error
    });
}
