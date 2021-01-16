import { updatePGN } from "../../utils";
import { makeMove, startGame } from "../actions/gameActions"

const initialState = {};

export default function gameReducer(state = initialState, action) {
	if (action.type === 'game/connect') {
		state[action.id].connections.add(action.connection)
		return state;
	}
	else if (action.type === 'game/newGame') {
		const id = Math.floor(Math.random() * 10000).toString();
		const newState = { ...state };
		newState[id] = {
			connections: [],
			pgn: '',
			//hostcolor,
			//gamemode,
			//btime,
			//wtime,
		};
		return newState;
	}
	else if (action.type === 'game/move') {
		state[action.id].pgn = updatePGN(action.move);
		state[action.id].connections.forEach(conn => {
			conn.send(makeMove(state[action.id].pgn))
		});
		return state;
	}
	// else if (action.type === 'game/flag') {
	// 	return state;
	// }
	return state;
}
