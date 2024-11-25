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

export default socket;
