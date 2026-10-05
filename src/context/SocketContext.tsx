import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Connect to same origin
    const socketIo = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketIo.on('connect', () => {
      setIsConnected(true);
      if (user?._id) {
        socketIo.emit('join_user_room', user._id);
      }
    });

    socketIo.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(socketIo);

    return () => {
      if (user?._id) {
        socketIo.emit('leave_user_room', user._id);
      }
      socketIo.disconnect();
    };
  }, []);

  // Update room subscription if user changes
  useEffect(() => {
    if (socket && socket.connected && user?._id) {
      socket.emit('join_user_room', user._id);
    }
  }, [user?._id, socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export function useSocket() {
  return useContext(SocketContext);
}
