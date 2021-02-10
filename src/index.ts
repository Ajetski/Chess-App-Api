import * as express from 'express';
import * as ExpressWs from 'express-ws';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

require('dotenv').config();
import './db';
import { gameReducer } from './reducers/gameReducer';
import { pgnToGameLength, getUptime } from './utils';
import { Action, Store } from './types/storeTypes';
import { User } from './types/userTypes';
import { User as UserModel } from './models/User';

const app: any = express();
app.use(cors());
app.use(bodyParser.json());
const expressWs = ExpressWs(app);

const HTTP_PORT = process.env.PORT || 3001;

let store: Store = { games: {} };
let gameCounter = 1;

const startUpTime = new Date();

app.ws('/', (ws: any, req: express.Request) => {
	ws.on('message', (message: string) => {
		const action: Action = JSON.parse(message);
		console.log('message recieved: ', action);
		store.games = gameReducer(store.games, action, ws);
	});
});

app.get('/', (req: express.Request, res: express.Response) => {
	return res.send({
		uptime: getUptime(startUpTime)
	});
});

app.get('/game', (req: express.Request, res: express.Response) => {
	return res.send(Object.keys(store.games).map((id: string) => ({
		id,
		numMoves: pgnToGameLength(store.games[parseInt(id)].pgn)
	})));
});

app.post('/game', (req: express.Request<{}, {}, {
	color?: 'white' | 'black' | 'random',
	userId?: string
}>, res: express.Response) => {
	const id = gameCounter++;
	store.games[id] = {
		pgn: '',
		white: {
			userId: null,
			connections: []
		},
		black: {
			userId: null,
			connections: []
		},
		spectators: []
	};
	if (req.body.userId) {
		if (req.body.color === 'random') {
			if (Math.floor(Math.random() * 10000) % 2 === 1) {
				store.games[id].white.userId = req.body.userId;
			} else {
				store.games[id].black.userId = req.body.userId;
			}
		} else if (req.body.color === 'white' || req.body.color === 'black') {
			store.games[id][req.body.color].userId = req.body.userId;
		}
	}
	res.send({ id });
});

app.post('/user', async (req: express.Request<{}, {}, User>, res: express.Response) => {
	try {
		console.log(req.body);
		const user = new UserModel(req.body);
		await user.save();
		res.send(req.body);
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

app.listen(HTTP_PORT, () => console.log(`Http Server is listening on port ${HTTP_PORT}...`));
