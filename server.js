const chalk = require('chalk');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');


const winston = require('winston');

// Configuration des logs
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'server.log' })
  ]
});

const PORT = process.env.PORT || 3007;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let rooms = {};

// Fonction utilitaire pour récupérer l'IP du client
const getClientIp = (req) => req.headers['x-forwarded-for'] || req.connection.remoteAddress;

// Lorsque le client se connecte via WebSocket
wss.on('connection', (ws, req) => {
  const clientIp = getClientIp(req);
  logger.info(chalk.blue(`Client connected from IP: ${clientIp}`));

  // Lorsque le client envoie un message
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.action === 'joinRoom') {
      const roomId = data.roomId;
      ws.roomId = roomId;

      if (!rooms[roomId]) {
        rooms[roomId] = [];
        logger.info(chalk.green(`Created room ${roomId}`));
      }

      rooms[roomId].push(ws);
      logger.info(chalk.yellow(`[${rooms[roomId].length}] Client from IP ${clientIp} joined room ${roomId}`));
    } else if (['play', 'pause', 'seek'].includes(data.action)) {
      const roomId = data.roomId;
      logger.info(chalk.magenta(`STATUS (${clientIp}) ${data.action} event in room ${roomId}`));

      if (rooms[roomId]) {
        rooms[roomId].forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {

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
    logger.info(chalk.red(`Client from IP ${clientIp} disconnected`));

    if (ws.roomId) {
      const roomId = ws.roomId;
      rooms[roomId] = rooms[roomId].filter((client) => client !== ws);

      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
        logger.info(chalk.gray(`Room ${roomId} deleted`));
      } else {
        logger.info(chalk.gray(`[${rooms[roomId].length}] Clients remaining in room ${roomId}`));
      }
    }
  });
});

// Démarrer le serveur
server.listen({ port: PORT, host: HOST }, () => {
  logger.info(chalk.green(`Server started on http://${HOST}:${PORT}`));
});
