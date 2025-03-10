import { WebSocket } from "ws";
import { debug, info } from "./log";
import chalk from "chalk";

export const rooms = new Map<string, Room>();

export function createRoom(roomId: string, url: string) {
    if (!rooms.has(roomId)) {
        info("ROOM", chalk.gray(`Room ${roomId} created`));
        rooms.set(roomId, {
            clients: [],
            roomId: roomId,
            url: url
        });
    }
    return rooms.get(roomId);
}

export function getRooms() {
    // replace client in room.client by empty string
    return Array.from(rooms.values()).map((room) => ({
        roomId: room.roomId,
        url: room.url,
        clients: room.clients.length
    }));
}

export function joinRoom(roomId: string, ws: WebSocket, url: string) {
    const room = createRoom(roomId, url);
    if (room?.clients.includes(ws)) return;
    rooms.get(roomId)?.clients.push(ws);
    debug("all rooms", JSON.stringify(getRooms(), null, 2));
    return room?.clients;
}

export function broadcastState(ws: WebSocket, roomId: string, action: string, currentTime: number, timestamp: number) {
    rooms.get(roomId)?.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client !== ws) {
            client.send(JSON.stringify({
                action,
                currentTime,
                timestamp
            }));
        }
    });
}

export function leaveRoom(roomId: string, ws: WebSocket) {
    const room = rooms.get(roomId);
    if (room) {
        room.clients = room.clients.filter((client) => client !== ws);
        if (room.clients.length === 0) {
            rooms.delete(roomId);
            info("ROOM", chalk.gray(`Room ${roomId} deleted`));
        } else {
            info("ROOM", chalk.gray(`${room.clients.length || 0} clients remaining in room ${roomId}`));
        }
    }
}
