import { Server, Socket } from "socket.io";
import { addUser, getUserBySocketId, removeUser } from "../utils/user-ws";
import { UserData } from "../types/user";

export const handleNewUser = (socket: Socket, io: Server) => {
  socket.on("new-user", (data) => {
    const userData: UserData = {
      socketId: socket.id,
      ...data,
    };
    addUser(userData);
  });

  socket.on("disconnect", () => {
    const userData = getUserBySocketId(socket.id);
    if (!userData || !userData.userId) {
      console.log("First IF Block breaks");
      return;
    }
    removeUser(socket.id);
  });
};
