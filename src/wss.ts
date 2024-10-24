import WebSocket, { WebSocketServer } from 'ws';
import { Request } from 'express';

import { broadcastState, getRooms, joinRoom, leaveRoom, rooms } from './rooms';
import { info } from './log';


export const connection = (ws: WebSocket, req: Request) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    info("WS", `Client connected from ${clientIp}`);
  
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
        info("WS", `Invalid message from ${clientIp}`);
        return;
      }
  
      if (data.action === 'joinRoom') {
        const roomId = data.roomId;
        const url = data.url;
        ws.roomId = roomId;
        const room = joinRoom(roomId, ws, url);
        if (!room) return;
        info("ROOM", `Joined room '${roomId}' (${room.length || 0} clients)`);
      } else if (['play', 'pause', 'seek'].includes(data.action)) {
        const roomId = data.roomId;
        info("ROOM STATUS", `${data.action} => '${roomId}'`);
        broadcastState(ws, roomId, data.action, (data.currentTime as number), (data.timestamp as number));
      }
    });
  
    ws.on('close', () => {
      info("WS", `Client disconnected from ${clientIp}`);
      leaveRoom(ws.roomId, ws);
    });
  }


export default { connection };