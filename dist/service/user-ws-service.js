"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNewUser = void 0;
const user_ws_1 = require("../utils/user-ws");
const handleNewUser = (socket, io) => {
    socket.on("new-user", (data) => {
        const userData = Object.assign({ socketId: socket.id }, data);
        (0, user_ws_1.addUser)(userData);
    });
    socket.on("disconnect", () => {
        const userData = (0, user_ws_1.getUserBySocketId)(socket.id);
        if (!userData || !userData.userId) {
            console.log("First IF Block breaks");
            return;
        }
        (0, user_ws_1.removeUser)(socket.id);
    });
};
exports.handleNewUser = handleNewUser;
//# sourceMappingURL=user-ws-service.js.map