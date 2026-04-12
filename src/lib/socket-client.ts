'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | undefined;

export const getSocket = (): Socket => {
  if (!socket) {
    // Note: in production this needs to point to the actual WSS URL
    // but Next.js custom server (server.js) runs io on the same port!
    socket = io();
  }
  return socket;
};
