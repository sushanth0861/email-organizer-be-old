import { Server, Socket } from "socket.io";
import { addUser, getUserBySocketId, removeUser } from "../utils/user-ws";
import { UserData } from "../types/user";

export const handleNewMail = (socket: Socket, io: Server) => {
  socket.on("send-mail", (data) => {
    const userData: UserData = getUserBySocketId(socket.id);
    const reciverSocketId = userData.socketId
    socket.to(reciverSocketId).emit("new-mail", data);
  });
};
