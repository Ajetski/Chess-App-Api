export function makeMove({ pgn }: { pgn: string }) {
	return JSON.stringify({
		type: 'game/move',
		pgn
	});
}

export function connectToGame({ id, orientation, isPlayer, pgn }: {
	id: number, orientation: string, isPlayer: boolean, pgn: string
}) {
	return JSON.stringify({
		type: 'game/connect',
		id,
		orientation,
		isPlayer,
		pgn
	});
}

export function stayConnected() {
	return JSON.stringify({
		type: 'game/pong'
	});
}

export function error({ error }: { error: string }) {
	return JSON.stringify({
		type: 'game/error',
		error
	});
}
