import express from 'express';
import ExpressWs from 'express-ws';
import cors from 'cors';
import bodyParser from 'body-parser';

import { gameReducer } from './reducers/gameReducer.js';
import { pgnToGameLength } from './utils.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());
const expressWs = ExpressWs(app);

const HTTP_PORT = process.env.PORT || 3001;

let store = { games: {} };
let gameCounter = 1;

app.ws('/', (ws, req) => {
    ws.on('message', message => {
        const action = JSON.parse(message);
        console.log('message recieved: ', action);
        store.games = gameReducer(store.games, action, ws);
    });
});

app.get('/', (req, res) => {
    return res.send(`hello world`);
});

app.get('/game', (req, res) => {
    return res.send(Object.keys(store.games).map(id => ({
        id,
        numMoves: pgnToGameLength(store.games[id].pgn)
    })));
});

app.post('/game', (req, res) => {
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

app.listen(HTTP_PORT, () => console.log(`Http Server is listening on port ${HTTP_PORT}...`));
