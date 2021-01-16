// https://www.npmjs.com/package/ws#api-docs

import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 8080 });

let connections = [];
let store = {};


wss.on('connection', ws => {
    ws.on('message', message => {
        const action = JSON.parse(message);
        store.games = gameReducer(action);

    });
});

wss.on('close', ws => {
    connections = connections.filter(elem => elem !== ws);
});

// if (action.type === 'newGame') {

//     connections.filter(conn => conn !== ws).forEach(conn => conn.send(message));
// }