export function makeMove(payload = {}) {
    return JSON.stringify({
        type: 'game/move',
        pgn: payload.pgn
    });
}

export function newGame(payload = {}) {
    return JSON.stringify({
        type: 'game/newGame',
        id: payload.id
    });
}

export function connectToGame(payload = {}) {
    return JSON.stringify({
        type: 'game/connect',
        id: payload.id,
        isWhite: payload.isWhite,
        isPlayer: payload.isPlayer
    });
}
