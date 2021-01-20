import { updatePGN } from '../utils.js';
import { makeMove, newGame, connectToGame } from '../actions/gameActions.js';
import { stat } from 'fs';

const initialState = {};
let gameCounter = 0;

export function gameReducer(state = initialState, action, ws) {
	if (action.type === 'game/connect') {
		ws.send(connectToGame({
			id: action.id,
			orientation: state[action.id].connections.length === 1
				? 'white' : 'black',
			isPlayer: state[action.id].connections.length < 2,
			pgn: state[action.id].pgn
		}));
		return {
			...state,
			[action.id]: {
				...state[action.id],
				connections: state[action.id].connections.concat(ws)
			}
		};
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
