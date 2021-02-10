
export interface GameConnectAction {
	isPlayer: boolean;
	userId: string;
	type: 'game/connect'
	id: number
}

export interface GameMoveAction {
	type: 'game/move',
	id: number,
	move: string
}

export interface GamePingAction {
	type: 'game/ping'
};

export type GameAction = GameConnectAction | GameMoveAction | GamePingAction;

export type Action = GameAction;

export type Color = 'white' | 'black';

export interface Game {
	pgn: string,
	white: {
		userId: string,
		connections: WebSocket[]
	},
	black: {
		userId: string,
		connections: WebSocket[]
	},
	spectators: WebSocket[]
};

export interface Games {
	[id: number]: Game
}

export interface Store {
	games: Games
};
