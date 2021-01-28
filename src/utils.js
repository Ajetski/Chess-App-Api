import _Chess from 'chess.js';
const Chess = _Chess.Chess;

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

export function pgnToGameLength(pgn) {
    const chess = new Chess();
    chess.load_pgn(pgn);
    return chess.history().length;
}
