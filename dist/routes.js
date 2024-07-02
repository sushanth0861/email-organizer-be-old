"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("./controller/user.controller");
const upstox_auth_1 = require("./controller/upstox-auth");
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
function routes(app) {
    //health check
    app.get("/api/test", async (req, res) => {
        res.send("Server is healthy");
    });
    app.post("/api/register", user_controller_1.register);
    app.post("/api/login", user_controller_1.login);
    app.post("/api/test", async (req, res) => {
        const worker = new worker_threads_1.Worker(path_1.default.resolve(__dirname, `worker.${process.env.NODE_ENV === 'production' ? 'js' : 'ts'}`));
        worker.on('error', (error) => {
            console.error(`Worker error: ${error.message}`);
            // Log the error but don't send another response as it might have already been sent
        });
        worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker stopped with exit code ${code}`);
            }
        });
        res.send('Worker started');
    });
    app.get("/auth", async (req, res) => {
        const authcode = req.query.code;
        const email = req.query.state;
        console.log(email);
        const user = await (0, upstox_auth_1.GetAccessToken)(email, authcode);
        if (user) {
            console.log("data added");
            res.status(201).json({
                message: "Access token saved successfully",
                success: true,
            });
        }
    });
}
exports.default = routes;
//# sourceMappingURL=routes.js.map