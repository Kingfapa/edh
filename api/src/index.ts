import express from "express";
import http from "http";
import { Server } from "socket.io";
import router from "./routes/v1";
import crypto from "crypto";
import { InMemorySessionStore } from "./lib/sessionstore";

// Initialize an Express app
const app = express();
app.use("/api/v1", router);

// Initialize a Socket.io server
const server = http.createServer(app);
const io = new Server<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
>(server);

const randomID = () => crypto.randomBytes(8).toString("hex");
const sessionStore = new InMemorySessionStore();

io.use(async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.data.sessionID = sessionID;
      socket.data.userID = session.userID;
      return next();
    }
  }

  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.data.username = username;
  socket.data.sessionID = randomID();
  socket.data.userID = randomID();
  next();
});

io.on("connection", (socket) => {
  // save the session
  sessionStore.saveSession(socket.data.sessionID, {
    userID: socket.data.userID,
    username: socket.data.username,
    connected: true,
  });

  // fetch existing users
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.data.username,
    });
  }
  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.data.username,
  });

  // forward the private message to the right recipient
  socket.on("private message", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });

  // notify users upon disconnection
  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.id);
  });
});

// Start the server
server.listen(3000, () => {
  console.log("Server listening on port 3000!");
});
