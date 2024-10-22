import { WebSocket } from 'ws';
import * as Express from 'express';

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
    interface Request {
      [key: string]: any;
    }
    interface Response {
      [key: string]: any;
    }
  }
}

export {};