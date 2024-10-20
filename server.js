const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let rooms = {};

// Lorsque le client se connecte via WebSocket
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');

  // Lorsque le client envoie un message
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.action === 'joinRoom') {
      const roomId = data.roomId;
      ws.roomId = roomId;
      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }
      rooms[roomId].push(ws);
      console.log(`Client joined room ${roomId}`);
    } else if (data.action === 'play' || data.action === 'pause' || data.action === 'seek') {
      const roomId = data.roomId;
      console.log(`Received ${data.action} event in room ${roomId}`);
      if (rooms[roomId]) {
        rooms[roomId].forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              action: data.action,
              currentTime: data.currentTime
            }));
          }
        });
      }
    }
  });

  // Lorsque la connexion se ferme
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Démarrer le serveur sur le port 3000
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
