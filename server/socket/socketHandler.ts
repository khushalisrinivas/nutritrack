import { Server, Socket } from 'socket.io';

let ioInstance: Server | null = null;

export function initSocketIO(io: Server) {
  ioInstance = io;

  io.on('connection', (socket: Socket) => {
    socket.on('join_user_room', (userId: string) => {
      if (userId) {
        socket.join(`user_${userId}`);
      }
    });

    socket.on('leave_user_room', (userId: string) => {
      if (userId) {
        socket.leave(`user_${userId}`);
      }
    });

    socket.on('disconnect', () => {
      // client disconnected
    });
  });
}

export function emitUserEvent(userId: string, eventName: string, data: any) {
  if (ioInstance) {
    ioInstance.to(`user_${userId}`).emit(eventName, data);
    // Also emit broadcast on the main event channel for single-client updates
    ioInstance.emit(`user_broadcast_${userId}`, { event: eventName, data });
  }
}
