// useSocket.ts
import { useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface SocketAuth {
  token?: string | null;
  [key: string]: any;
}

interface SocketWithAuth extends Socket {
  auth: SocketAuth;
}

// אתחול הסוקט מיד בעת הגדרתו
const token = localStorage.getItem("accessToken") || null;
const socket: SocketWithAuth = io(
  "https://evening-bayou-77034-176dc93fb1e1.herokuapp.com",
  {
    transports: ["websocket"],
    auth: {
      token,
    },
  }
) as SocketWithAuth;

console.log("Socket initialized");

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
  const loggedUserId = localStorage.getItem("loggedUserId") || null;
  if (loggedUserId) {
    socket.emit("join", { userId: loggedUserId });
    console.log(`Socket emitted join event with userId: ${loggedUserId}`);
  }
});

socket.on("reconnect", () => {
  console.log("Socket reconnected");
  const token = localStorage.getItem("accessToken") || null;
  socket.auth.token = token;
  const loggedUserId = localStorage.getItem("loggedUserId") || null;
  if (loggedUserId) {
    socket.emit("join", { userId: loggedUserId });
    console.log(`Socket emitted join event with userId: ${loggedUserId}`);
  }
});

const useSocket = (event?: string, onEvent?: (data: any) => void) => {
  // פונקציה לעדכון הטוקן והתחברות מחדש
  const updateTokenAndReconnect = useCallback(() => {
    const token = localStorage.getItem("accessToken") || null;
    socket.auth.token = token;
    socket.connect();
  }, []);

  // האזנה לאירועים
  useEffect(() => {
    if (event && onEvent) {
      console.log(`Listening to event: ${event}`);
      socket.on(event, (data) => {
        console.log(`Received data for event ${event}:`, data);
        onEvent(data);
      });

      return () => {
        console.log(`Stopped listening to event: ${event}`);
        socket.off(event);
      };
    }
  }, [event, onEvent]);

  // פונקציה לשליחת אירועים
  const send = useCallback((event: string, data: any) => {
    console.log(`Sending event: ${event} with data:`, data);
    socket.emit(event, data);
  }, []);

  return { send, updateTokenAndReconnect };
};

export { socket };
export default useSocket;
