const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3007;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let rooms = {};

// Lorsque le client se connecte via WebSocket
wss.on('connection', (ws) => {
  // Lorsque le client envoie un message
  ws.on('message', (message) => {

    const data = JSON.parse(message);

    if (data.action === 'joinRoom') {
      const roomId = data.roomId;
      ws.roomId = roomId;

      if (!rooms[roomId]) {
        rooms[roomId] = [];
        console.log(`=> Created room ${roomId}`);
      }
      rooms[roomId].push(ws);

      console.log(`[${rooms[roomId].length}] Client joined room ${roomId}`);
    } else if (data.action === 'play' || data.action === 'pause' || data.action === 'seek') {
      const roomId = data.roomId;
      console.log(`Received ${data.action} event in room ${roomId}`);

      if (rooms[roomId]) {
        rooms[roomId].forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            console.log(`Sending ${data.action} event to client in room ${roomId}`);

            client.send(JSON.stringify({
              action: data.action,
              currentTime: data.currentTime,
              timestamp: data.timestamp,
            }));
          } 
        });
      }
    }
  });

  // Lorsque la connexion se ferme
  ws.on('close', () => {
    console.log('WebSocket client disconnected');

    if (ws.roomId) {
      const roomId = ws.roomId;
      delete rooms[roomId];
    }
  });
});

// Démarrer le serveur sur le port 3000
server.listen({port: PORT, host: HOST}, () => {
  console.log(`Server started on http://${HOST}:${PORT}`);
});
