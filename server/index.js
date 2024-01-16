import express from "express";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";
import "./src/db/dbConnection.js";
import CombinedRouter from "./src/routes/index.js";
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 5001;

app.use(bodyParser.json());
app.use(cors('*'));
app.use('/', CombinedRouter);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join-room", (roomCode) => {
    socket.join(roomCode);
    console.log(`User joined room ${roomCode}`);
  });

  socket.on("update-game", (roomCode, gameData) => {
    io.to(roomCode).emit("game-updated", gameData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});