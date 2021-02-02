export function makeMove({ pgn }: { pgn: string }) {
    return JSON.stringify({
        type: 'game/move',
        pgn
    });
}

export function connectToGame({ id, orientation, isPlayer, pgn }: {
    id: string, orientation: string, isPlayer: boolean, pgn: string
}) {
    return JSON.stringify({
        type: 'game/connect',
        id,
        orientation,
        isPlayer,
        pgn
    });
}

export function error({ error }: { error: string }) {
    return JSON.stringify({
        type: 'game/error',
        error
    });
}
