import { WebSocket } from 'ws';
import Express from 'express';

declare module 'ws' {
  interface WebSocket {
    roomId: string;

  }
}

declare global {
    interface Room {
        clients: WebSocket[],
        roomId: string,
        url: string
    }

  namespace NodeJS {
    interface Global {
      [key: string]: any;
    }
  }
  
  namespace Express {
    interface Application {
      getClientIp(req: Request): string;
      port: number | string;
      host: string;
    }
    interface Request {
      [key: string]: any;
    }
    interface Response {
      [key: string]: any;
    }
  }
}

export {};