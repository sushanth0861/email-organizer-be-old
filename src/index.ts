import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import routes from "../api";
import cookieParser from "cookie-parser";
import { handleNewUser } from "./service/user-ws-service";
// const SMTPServer = require("smtp-server").SMTPServer;
// const smtpServer = new SMTPServer({
//   allowInsecureAuth: true,
//   authOptional: true,
//   onConnect(session, cb) {
//     console.log("onConnect", session.id);
//     cb();
//   },
//   onMailFrom(address, session, cb) {
//     console.log("onMailfrom", address.address, session.id);
//     cb();
//   },
//   onRcptTo(address, session, cb) {
//     console.log("onRcptTo", address.address, session.id);
//     cb();
//   },
//   onData(stream, session, cb) {
//     stream.on("data", (data) => {
//       console.log(`onData ${data.toString()}`);
//     });
//     stream.on("end", cb);
//   },
// });
// smtpServer.listen(25, () => {
//   console.log("smtp server listning on 25");
// });
const port = process.env.PORT || 8000;

const app = express();

const server = http.createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("New client connected");
  handleNewUser(socket, io);

  socket.on("ping", () => {
    io.emit("pong");
  });
});

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,userId,agentid,adminid,skey"
  );
  next();
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  routes(app);
});
