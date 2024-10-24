import { config } from "dotenv";
import express, { Request, Response } from 'express';
import { debug, info } from './log';
import { getRooms } from './rooms';

config();
const PORT = process.env.PORT || 3007;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();
app.port = PORT;
app.host = HOST;

app.getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'] as string;
  const ip = forwarded ? forwarded.split(",")[0].trim() : req.ip;
  return ip || "unknown";
};

app.use(express.static('public'));

app.use((req: Request, res: Response, next) => {
  debug("API", `[${app.getClientIp(req)}] ${req.method} => ${req.url}`);
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




export default app;