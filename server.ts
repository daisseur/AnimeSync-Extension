import chalk from 'chalk';
import "./app.d.ts"
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { debug, info } from './src/log';
import app from './src/app';
import { connection } from './src/wss';


const server = http.createServer(app);
const wss = new WebSocketServer({ server });
wss.on('connection', connection);


// Démarrer le serveur
server.listen({ port: app.port, host: app.host }, () => {
  info("SERVER", chalk.green(`Server started on http://${app.host}:${app.port}`));
});

