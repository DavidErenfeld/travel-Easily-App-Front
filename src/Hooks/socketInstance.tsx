import { io, Socket } from "socket.io-client";

const token = localStorage.getItem("accessToken");

const socket: Socket = io(
  "https://evening-bayou-77034-176dc93fb1e1.herokuapp.com",
  {
    transports: ["websocket"],
    autoConnect: false,
    auth: {
      token: token,
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
  }
);

socket.on("connect", () => {
  console.log("Socket connected:");
  const loggedUserId = localStorage.getItem("loggedUserId");
  if (loggedUserId) {
    socket.emit("join", { userId: loggedUserId });
  }
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

// מאזין חדש לטיפול באירוע disconnect
socket.on("disconnect", (reason) => {
  console.warn(`Socket disconnected: ${reason}`);
  if (reason === "io server disconnect") {
    console.log("Disconnected by the server, attempting to reconnect...");
    socket.connect(); // ניסיון להתחבר מחדש אם השרת ניתק את החיבור
  }
});

export default socket;
