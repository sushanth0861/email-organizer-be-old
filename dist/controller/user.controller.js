"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const db_1 = require("../lib/db");
const register = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await db_1.prisma.user.create({ data: { name, email, password } });
    res.send("user created");
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await db_1.prisma.user.findFirst({ where: { email, password } });
    res.send("user logged in");
};
exports.login = login;
//# sourceMappingURL=user.controller.js.map