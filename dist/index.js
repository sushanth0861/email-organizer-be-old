"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_ws_service_1 = require("./service/user-ws-service");
const SMTPServer = require("smtp-server").SMTPServer;
const smtpServer = new SMTPServer({
    allowInsecureAuth: true,
    authOptional: true,
    onConnect(session, cb) {
        console.log("onConnect", session.id);
        cb();
    },
    onMailFrom(address, session, cb) {
        console.log("onMailfrom", address.address, session.id);
        cb();
    },
    onRcptTo(address, session, cb) {
        console.log("onRcptTo", address.address, session.id);
        cb();
    },
    onData(stream, session, cb) {
        stream.on("data", (data) => {
            console.log(`onData ${data.toString()}`);
        });
        stream.on("end", cb);
    },
});
smtpServer.listen(25, () => {
    console.log("smtp server listning on 25");
});
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
io.on("connection", (socket) => {
    console.log("New client connected");
    (0, user_ws_service_1.handleNewUser)(socket, io);
    socket.on("ping", () => {
        io.emit("pong");
    });
});
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,userId,agentid,adminid,skey");
    next();
});
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    (0, routes_1.default)(app);
});
//# sourceMappingURL=index.js.map