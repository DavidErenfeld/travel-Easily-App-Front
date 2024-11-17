// useSocket.ts
import { useEffect, useCallback } from "react";
import socket from "./socketInstance";

const useSocket = (event?: string, onEvent?: (data: any) => void) => {
  useEffect(() => {
    if (!event || !onEvent) return;

    const handleEvent = (data: any) => {
      console.log(`Received data for event ${event}:`, data);
      onEvent(data);
    };

    if (socket.connected) {
      socket.on(event, handleEvent);
      console.log(`Listening to event: ${event}`);
    } else {
      socket.once("connect", () => {
        socket.on(event, handleEvent);
        console.log(`Listening to event after connect: ${event}`);
      });
    }

    return () => {
      socket.off(event, handleEvent);
      console.log(`Stopped listening to event: ${event}`);
    };
  }, [event, onEvent]);

  const send = useCallback((event: string, data: any) => {
    if (socket.connected) {
      console.log(`Sending event: ${event}`, data);
      socket.emit(event, data);
    } else {
      console.warn("Socket is not connected. Cannot send event:", event);
    }
  }, []);

  return { send };
};

export default useSocket;
