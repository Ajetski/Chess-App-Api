import { updatePGN } from '../utils.js';
import { makeMove, newGame } from '../actions/gameActions.js';

const initialState = {};
let gameCounter = 0;

export function gameReducer(state = initialState, action, ws) {
	if (action.type === 'game/connect') {
		state[action.id].connections.add(ws)
		return state;
	}
	else if (action.type === 'game/newGame') {
		ws.send(newGame({ id: gameCounter }));
		return {
			...state,
			[gameCounter++]: {
				connections: [],
				pgn: '',
				//hostcolor,
				//gamemode,
				//btime,
				//wtime,
			}
		};
	}
	else if (action.type === 'game/move') {
		state[action.id].connections.forEach(conn => {
			conn.send(makeMove(updatePGN(action.move)))
		});
		return {
			...state,
			[action.id]: {
				...state[action.id],
				pgn: updatePGN(action.move)
			}
		};
	}
	// else if (action.type === 'game/flag') {
	// 	return state;
	// }
	return state;
}
