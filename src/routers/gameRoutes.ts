import { Router, Request, Response } from 'express';

import { makeMove, connectToGame, stayConnected, error } from '../actions/gameActions';
import { Game as GameModel } from '../models/Game';
import { updatePGN, pgnToColor, colorToPlay, pgnToGameLength } from '../utils';
import { GameConnections, GameRequest, Color, GameConnectAction, GameAction, GameMoveAction } from '../types/storeTypes';

export const router = Router();

let gameConns: GameConnections = {};

router.get('/game', async (req: Request, res: Response) => {
    try {
        const gameQuery = await GameModel.find({});
        return res.send(gameQuery.map(game => ({
            id: game.get('id'),
            numMoves: pgnToGameLength(game.get('pgn'))
        })
        ));
    }
    catch (err) {
        return res.sendStatus(500).send(err);
    }
});

router.post('/game', async (req: Request<{}, {}, {
    color?: 'white' | 'black' | 'random',
    userId?: string
}>, res: Response) => {
    try {
        const numGames = await GameModel.countDocuments();
        const userColor = colorToPlay(req.body.color);
        const creationDate = new Date();
        const gameRequest: GameRequest = {
            id: numGames,
            white: (userColor === 'white' ? req.body.userId : null),
            black: (userColor === 'black' ? req.body.userId : null),
            date: creationDate
        };

        const newGame = new GameModel(gameRequest);
        newGame.save().then(() => {
            gameConns[numGames] = {
                white: [],
                black: [],
                spectators: []
            };

            return res.send({ id: gameRequest.id });
        })
            .catch(() => {
                throw new Error('Failed to create new game');
            })
    }
    catch (err) {
        return res.sendStatus(500).send(err);
    }
});


export async function handleAction(action: GameAction, socket: WebSocket) {
    try {
        if (action.type === 'game/ping') {
            socket.send(stayConnected());
        }
        if (action.type === 'game/move') {
            handleMove(action, socket);
        }
        if (action.type === 'game/connect') {
            gameConns = await handleConnection(action, socket);
        }
    }
    catch (err) {
        console.error(err);
    }
};

export async function handleConnection(action: GameConnectAction, socket: WebSocket): Promise<GameConnections> {

    try {
        const game = await GameModel.findOne({ id: action.id });

        if (!game || !gameConns[action.id]) {
            socket.send(error({
                error: `Game ${action.id} does not exist`
            }));
            return;
        }

        // connect to existing game
        const resConnect = (color: Color) => socket.send(connectToGame({
            id: action.id,
            orientation: color,
            isPlayer: action.isPlayer,
            pgn: game.get('pgn')
        }));

        const calcConnsForColor = (color: Color) => {
            return ({
                ...gameConns,
                [action.id]: {
                    ...gameConns[action.id],
                    [color]: gameConns[action.id][color].concat(socket)
                }
            })
        };

        if (!action.isPlayer) {
            resConnect('white');
            return {
                ...gameConns,
                [action.id]: {
                    ...gameConns[action.id],
                    spectators: gameConns[action.id].spectators.concat(socket)
                }
            };
        } else if (game.get('black') === action.userId) {
            resConnect('black');
            return calcConnsForColor('black');
        } else if (game.get('white') === action.userId) {
            resConnect('white');
            return calcConnsForColor('white');
        } else if (game.get('black') && !game.get('white')) {
            await game.updateOne({ white: action.userId });
            resConnect('white');
            return calcConnsForColor('white');
        } else if (!game.get('black)')) {
            await game.updateOne({ black: action.userId });
            resConnect('black');
            return calcConnsForColor('black');
        } else {
            socket.send(error({
                error: `Game ${action.id} is full.`
            }));
        }
    }
    catch (err) {
        socket.send(error({
            error: `Error connection to Game ${action.id}: ${err}`
        }))
    }
};

export async function handleMove(action: GameMoveAction, socket: WebSocket) {
    try {
        const game = await GameModel.findOne({ id: action.id });
        if (!game || !gameConns[action.id]) {
            socket.send(error({
                error: `Game ${action.id} does not exist`
            }));
            return;
        }
        const pgn = updatePGN(game.get('pgn'), action.move);
        await game.updateOne({ pgn });
        gameConns[action.id].white
            .filter((conn: WebSocket) => conn !== socket && conn.readyState === 1)
            .forEach((conn: WebSocket) => conn.send(makeMove({ pgn })));
        gameConns[action.id].black
            .filter((conn: WebSocket) => conn.readyState === 1)
            .forEach((conn: WebSocket) => conn.send(makeMove({ pgn })));
        gameConns[action.id].spectators
            .filter((conn: WebSocket) => conn.readyState === 1)
            .forEach((conn: WebSocket) => conn.send(makeMove({ pgn })));
    }
    catch (err) {
        socket.send(error({
            error: `Error sending move to game ${action.id}: ${err}`
        }));
    }
};