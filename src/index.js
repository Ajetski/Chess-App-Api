import express from 'express';
import ExpressWs from 'express-ws';

import { gameReducer } from './reducers/gameReducer.js';

const app = express();
const expressWs = ExpressWs(app);

const HTTP_PORT = process.env.PORT || 3001;

let store = {};

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

app.listen(HTTP_PORT, () => console.log(`Http Server is listening on port ${HTTP_PORT}...`));
