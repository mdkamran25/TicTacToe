import express from "express";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";
import "./src/db/dbConnection.js";
import CombinedRouter from "./src/routes/index.js";
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});

const PORT = 5001;

app.use(bodyParser.json());
app.use(cors());

app.use('/', CombinedRouter);

io.on("connection", (socket) => {
  console.log("A user connected");

//   socket.on("join-room", (roomCode) => {
//     socket.join(roomCode);
//     console.log(`User joined room ${roomCode}`);
//   });

  socket.on("gameData", (gameData) => {
    socket.broadcast.emit("recieveGameData", gameData);
  });

  socket.on("updateGameData", (gameData) => {
    socket.broadcast.emit("recieveUpdateGameData", gameData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});
