"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getUserBySocketId = exports.getUserById = exports.removeUser = exports.addUser = void 0;
let connectedUsers = [];
const addUser = (user) => {
    connectedUsers.push(user);
};
exports.addUser = addUser;
const removeUser = (socketId) => {
    connectedUsers = connectedUsers.filter((user) => user.socketId !== socketId);
};
exports.removeUser = removeUser;
const getUserById = (userId) => {
    return connectedUsers.find((user) => user.userId === userId);
};
exports.getUserById = getUserById;
const getUserBySocketId = (socketId) => {
    return connectedUsers.find((user) => user.socketId === socketId);
};
exports.getUserBySocketId = getUserBySocketId;
const getAllUsers = () => {
    return connectedUsers;
};
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=user-ws.js.map