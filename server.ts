import chalk from 'chalk';
import express, { Request, Response } from 'express';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import {broadcastState, getRooms, joinRoom, leaveRoom, rooms } from './src/rooms';
import { debug, info } from './src/log';


const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'] as string;
  const ip = forwarded ? forwarded.split(",")[0].trim() : req.ip;
  return ip || "unknown";
};

const PORT = process.env.PORT || 3007;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();

app.use((req: Request, res: Response, next) => {
  debug("API", `[${getClientIp(req)}] ${req.method} => ${req.url}`);
  next();
});

app.get("/listRooms", (req: Request, res: Response) => {
  const url = req.query.url as string;
  if (url) {
    res.json(getRooms().filter((room) => room.url === url));
  } else {
    const returnRooms = getRooms().map((room) => ({ roomId: room.roomId, url: room.url }));
    res.json(Array.from(returnRooms));
  }
});


const server = http.createServer(app);
const wss = new WebSocketServer({ server });



// Lorsque le client se connecte via WebSocket
wss.on('connection', (ws: WebSocket, req: Request) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  info("WS", chalk.blue(`[${clientIp}] Client connected`));

  // Lorsque le client envoie un message
  ws.on('message', (message: string) => {
    let data;
    try {
      data = JSON.parse(message) as {
        action: 'joinRoom' | 'play' | 'pause' | 'seek';
        roomId: string;
        url: string;
        currentTime?: number;
        timestamp?: number;
      };
    } catch (error) {
      info("WS", chalk.red(`[${clientIp}] Invalid message`));
      return;
    }

    if (data.action === 'joinRoom') {
      const roomId = data.roomId;
      const url = data.url;
      ws.roomId = roomId;
      const room = joinRoom(roomId, ws, url);
      info("ROOM", chalk.yellow(`[${clientIp}] joined room '${roomId}' (${room.length || 0} clients)`));
    } else if (['play', 'pause', 'seek'].includes(data.action)) {
      const roomId = data.roomId;
      info("ROOM STATUS", chalk.magenta(`[${clientIp}] ${data.action} => '${roomId}'`));
      broadcastState(ws, roomId, data.action, (data.currentTime as number), (data.timestamp as number));
    }
  });

  // Lorsque la connexion se ferme
  ws.on('close', () => {
    info("WS", chalk.red(`[${clientIp}] Client disconnected`));
    leaveRoom(ws.roomId, ws);
  });
});

// Démarrer le serveur
server.listen({ port: PORT, host: HOST }, () => {
  info("SERVER", chalk.green(`Server started on http://${HOST}:${PORT}`));
});

