"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
// import deserializeUser from "./middleware/deserializeUser";
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
// app.use(deserializeUser);
app.listen(port, async () => {
    console.log(`App is running at http://localhost:${port}`);
    (0, routes_1.default)(app);
});
//# sourceMappingURL=index.js.map