export function makeMove(payload = {}) {
    return {
        type: 'game/move',
        pgn: payload.pgn
    };
}

export function startGame(payload = {}) {

}