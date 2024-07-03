import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "../api"; // Adjust the import path if necessary

const port = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("New client connected");
  // Handle socket events if necessary
});

app.use(express.json());
app.use(cookieParser());
app.use(cors()); // Enable CORS for all routes

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Initialize routes
routes(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
