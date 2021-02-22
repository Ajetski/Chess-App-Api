import express from 'express';
import { Server } from 'ws';
import cors from 'cors';
import bodyParser from 'body-parser';

require('dotenv').config();
import './db';
import { getUptime } from './utils';
import { router as userRouter } from './routers/userRoutes';
import { router as gameRouter, handleAction as handleGameAction, handleAction } from './routers/gameRoutes';
import { Action } from './types/storeTypes';
import { router as contactRouter } from './routers/contactRoutes';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(userRouter);
app.use(gameRouter);
app.use(contactRouter);

const HTTP_PORT = process.env.PORT || 3001;
const wss = new Server({ noServer: true });
const startUpTime = new Date();

app.get('/', (req: express.Request, res: express.Response) => {
	return res.send({
		uptime: getUptime(startUpTime)
	});
});

wss.on('connection', (ws: any) => {
	ws.on('message', (message: string) => {
		const action: Action = JSON.parse(message);
		console.log('message recieved: ', action);
		handleAction(action, ws);
	});
});



const server = app.listen(HTTP_PORT, () => console.log(`Http Server is listening on port ${HTTP_PORT}...`));

server.on('upgrade', (request, socket, head) => {
	wss.handleUpgrade(request, socket, head, socket => {
		wss.emit('connection', socket, request);
	});
});
