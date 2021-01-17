import Chess from 'chess.js';

export function copyChess(chess) {
    const copy = new Chess();
    copy.load_pgn(chess.pgn());
    return copy;
}

export function updatePGN(pgn, move) {
    const chess = new Chess();
    chess.load_pgn(pgn);
    chess.move(move);
    return chess.pgn();
}
