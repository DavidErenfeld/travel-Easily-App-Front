// // socketInstance.ts
// import { io, Socket } from "socket.io-client";

// const token = localStorage.getItem("accessToken"); // או מאיפה שאתה שומר את הטוקן

// const socket: Socket = io("https://your-server-url", {
//   transports: ["websocket"],
//   autoConnect: false,
//   auth: {
//     token: token,
//   },
// });

// // מאזין לאירוע connect
// socket.on("connect", () => {
//   console.log("Socket connected:", socket.id);
//   const loggedUserId = localStorage.getItem("loggedUserId");
//   if (loggedUserId) {
//     socket.emit("join", { userId: loggedUserId });
//     console.log(`Joined room with userId: ${loggedUserId}`);
//   }
// });

// // מאזין לשגיאות התחברות
// socket.on("connect_error", (err) => {
//   console.error("Socket connection error:", err.message);
// });

// export default socket;
