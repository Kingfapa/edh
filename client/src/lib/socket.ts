import { io } from "socket.io-client";

const socket = io({
  autoConnect: false,
});

// socket.onAny((event, ...args) => {
//   console.log(event, args);
// });

// socket.on("connect_error", (err) => {
//   console.log(err instanceof Error); // true
//   console.log(err.message); // not authorized
// });

export { socket };
