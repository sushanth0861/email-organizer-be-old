"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNewMail = void 0;
const user_ws_1 = require("../utils/user-ws");
const handleNewMail = (socket, io) => {
    socket.on("send-mail", (data) => {
        const userData = (0, user_ws_1.getUserBySocketId)(socket.id);
        const reciverSocketId = userData.socketId;
        socket.to(reciverSocketId).emit("new-mail", data);
    });
};
exports.handleNewMail = handleNewMail;
//# sourceMappingURL=mail-ws-service.js.map