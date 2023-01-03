"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const user_1 = __importDefault(require("./routes/user"));
const books_1 = __importDefault(require("./routes/books"));
const profile_1 = __importDefault(require("./routes/profile"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Custom-Header");
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    return next();
});
app.get("/", (req, res) => {
    res.send("Pustaka Author Dashboard API");
});
app.use("/dashboard", dashboard_1.default);
app.use("/user", user_1.default);
app.use("/books", books_1.default);
app.use("/profile", profile_1.default);
app.listen(process.env.PORT || 8080, () => {
    console.log(`⚡️ [server]: Server is running at http://localhost:${port}`);
});
module.exports = app;
//# sourceMappingURL=index.js.map