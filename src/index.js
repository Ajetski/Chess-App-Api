import WebSocket from 'ws';

import { gameReducer } from './reducers/gameReducer.js';

const wss = new WebSocket.Server({ port: 3001 });
let store = {};

wss.on('connection', ws => {
    ws.on('message', message => {
        const action = JSON.parse(message);
        console.log('message recieved: ', action);
        store.games = gameReducer(store.games, action, ws);
    });
});

wss.on('close', ws => {
    // clean up 
});

console.log('WebSocket Server listening on port 3001...');
