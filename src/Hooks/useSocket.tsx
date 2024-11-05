import { useEffect, useCallback } from "react";
import io from "socket.io-client";

// חיבור Socket.IO
const token = localStorage.getItem("accessToken");
const socket = io("https://evening-bayou-77034-176dc93fb1e1.herokuapp.com", {
  transports: ["websocket"],
  auth: {
    token,
  },
});

console.log("Socket initialized"); // לוג בעת אתחול החיבור

const useSocket = (event?: string, onEvent?: (data: any) => void) => {
  // האזנה לאירועים ספציפיים
  useEffect(() => {
    if (event && onEvent) {
      console.log(`Listening to event: ${event}`); // לוג בעת התחלת האזנה לאירוע ספציפי
      socket.on(event, (data) => {
        console.log(`Received data for event ${event}:`, data); // לוג עם הנתונים המתקבלים
        onEvent(data);
      });

      return () => {
        console.log(`Stopped listening to event: ${event}`); // לוג בעת הפסקת האזנה לאירוע
        socket.off(event);
      };
    }
  }, [event, onEvent]);

  // האזנה כללית לאירוע מחיקת משתמש
  useEffect(() => {
    socket.on("userDeleted", () => {
      console.log("User account was deleted - logging out"); // לוג למחיקת חשבון
      logoutUser(); // קריאה לפונקציית ההתנתקות
    });

    return () => {
      socket.off("userDeleted"); // הפסקת האזנה לאירוע בעת הסרת ה-hook
    };
  }, []);

  // פונקציה לשליחת אירועים
  const send = useCallback((event: string, data: any) => {
    console.log(`Sending event: ${event} with data:`, data); // לוג בעת שליחת אירוע עם הנתונים
    socket.emit(event, data);
  }, []);

  return { send, socket };
};

// פונקציה להתנתקות מלאה
const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("loggedUserId");
  window.location.href = "/login";
};

export default useSocket;
