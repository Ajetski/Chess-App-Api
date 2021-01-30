import { updatePGN, pgnToColor } from '../utils.js';
import { makeMove, connectToGame, error } from '../actions/gameActions.js';

const initialState = {};

export function gameReducer(state = initialState, action, ws) {
	if (action.type === 'game/connect') {
		if (state[action.id]) {
			// connect to existing game
			const resConnect = (color) => ws.send(connectToGame({
				id: action.id,
				orientation: color,
				pgn: state[action.id].pgn
			}));

			const calcStateForColor = (color) => {
				return ({
					...state,
					[action.id]: {
						...state[action.id],
						[color]: {
							...state[action.id][color],
							userId: action.userId,
							connections: state[action.id][color].connections.concat(ws)
						},
					}
				})
			};

			if (!action.isPlayer) {
				resConnect('white');
				return {
					...state,
					[action.id]: {
						...state[action.id],
						spectators: state[action.id].spectators.concat(ws)
					}
				};
			} else if (state[action.id].black.userId === action.userId) {
				resConnect('black');
				return calcStateForColor('black');
			} else if (state[action.id].white.userId === action.userId
				|| (state[action.id].black.userId && !state[action.id].white.userId)) {
				resConnect('white');
				return calcStateForColor('white');
			} else if (!state[action.id].black.userId) {
				resConnect('black');
				return calcStateForColor('black');
			} else {
				ws.send(error({
					error: `Game ${action.id} is full.`
				}));
			}
		} else {
			// connect to non-existent game
			ws.send(error({
				error: `Game ${action.id} does not exist`
			}));
		}
	} else if (action.type === 'game/move' && state[action.id]) {
		const pgn = updatePGN(state[action.id].pgn, action.move);
		state[action.id][pgnToColor(pgn)].connections
			.filter(conn => conn.readyState === 1)
			.forEach(conn => conn.send(makeMove({ pgn })));
		state[action.id].spectators
			.filter(conn => conn.readyState === 1)
			.forEach(conn => conn.send(makeMove({ pgn })));
		return {
			...state,
			[action.id]: {
				...state[action.id],
				pgn
			}
		};
	}
	return state;
}
