"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token || req.headers['token'];
    // const token =req.body.token
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        res.locals.user = decoded;
        next();
    }
    catch (err) {
        res.status(400).send('Invalid token');
    }
};
exports.authenticateJWT = authenticateJWT;
//# sourceMappingURL=authenticate.js.map