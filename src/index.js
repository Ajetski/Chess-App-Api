import WebSocket from 'ws';

import { gameReducer } from './reducers/gameReducer.js';

const wss = new WebSocket.Server({ port: 8080 });
let store = {};

wss.on('connection', ws => {
    ws.on('message', message => {
        console.log(message);
        const action = JSON.parse(message);
        store.games = gameReducer(store.games, action, ws);

    });
    console.log('client connected');
});

wss.on('close', ws => {
    // clean up 
});

console.log('WebSocket Server listening on port 8080...')
