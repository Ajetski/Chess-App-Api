import express from 'express';
import ExpressWs from 'express-ws';
import cors from 'cors';

import { gameReducer } from './reducers/gameReducer.js';
import { pgnToGameLength } from './utils.js';

const app = express();
app.use(cors());
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
        connections: [],
        pgn: '',
        //hostcolor,
        //gamemode,
        //btime,
        //wtime,
    };
    res.send({ id });
});

app.listen(HTTP_PORT, () => console.log(`Http Server is listening on port ${HTTP_PORT}...`));
