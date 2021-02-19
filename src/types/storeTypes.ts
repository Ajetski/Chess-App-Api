
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

export interface GameRequest {
	id: number,
	pgn?: string,
	white?: string,
	black?: string,
	date: Date,
};

export interface GameConnections {
	[id: number]: {
		white: WebSocket[],
		black: WebSocket[],
		spectators: WebSocket[]
	}
}
