import * as Chess from 'chess.js';

export function copyChess(chess: Chess.ChessInstance) {
	const copy = new Chess.Chess();
	copy.load_pgn(chess.pgn());
	return copy;
}

export function updatePGN(pgn: string, move: string) {
	const chess = new Chess.Chess();
	chess.load_pgn(pgn);
	chess.move(move);
	return chess.pgn();
}

export function pgnToColor(pgn: string) {
	const chess = new Chess.Chess();
	chess.load_pgn(pgn);
	return chess.turn() === 'w' ? 'white' : 'black';
}

export function pgnToGameLength(pgn: string) {
	const chess = new Chess.Chess();
	chess.load_pgn(pgn);
	return chess.history().length;
}

export function getUptime(startTime: Date) {
	const currTime = new Date();
	return Math.round((currTime.getTime() - startTime.getTime()) / 1000);
}

export function colorToPlay(color: 'white' | 'black' | 'random') {
	if (color === 'random') {
		if (Math.floor(Math.random() * 10000) % 2 === 1) {
			return 'white';
		} else {
			return 'black';
		}
	} else if (color === 'white' || color === 'black') {
		return color;
	}
};
