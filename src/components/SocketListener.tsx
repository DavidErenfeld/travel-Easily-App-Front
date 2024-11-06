// SocketListener.js
import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { socket } from "../Hooks/useSocket";

function SocketListener() {
  const { logout } = useAuth();

  useEffect(() => {
    console.log("SocketListener mounted");

    if (!socket) return;

    // האזנה לאירוע disconnectUser
    socket.on("disconnectUser", () => {
      console.log("Received disconnectUser event");
      logout();
    });

    // ניקוי בעת הסרת הקומפוננטה
    return () => {
      console.log("SocketListener unmounted");
      socket.off("disconnectUser");
    };
  }, [logout]);

  return null;
}

export default SocketListener;
