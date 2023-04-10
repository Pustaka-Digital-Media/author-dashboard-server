"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const user_1 = __importDefault(require("./routes/user"));
const books_1 = __importDefault(require("./routes/books"));
const profile_1 = __importDefault(require("./routes/profile"));
const royalty_1 = __importDefault(require("./routes/royalty"));
const settlement_1 = __importDefault(require("./routes/settlement"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Custom-Header");
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    return next();
});
app.get("/", (_, res) => {
    res.send("Pustaka Author Dashboard API");
});
app.use("/dashboard", dashboard_1.default);
app.use("/user", user_1.default);
app.use("/books", books_1.default);
app.use("/profile", profile_1.default);
app.use("/royalty", royalty_1.default);
app.use("/settlement", settlement_1.default);
const httpServer = http_1.default.createServer(app);
const httpsServer = https_1.default.createServer({
    key: fs_1.default.readFileSync(path_1.default.resolve(__dirname, "../certs/api.pustaka.co.in.key")),
    ca: fs_1.default.readFileSync(path_1.default.resolve(__dirname, "../certs/api.pustaka.co.in.ca-bundle")),
    passphrase: "Ebooks@123",
    cert: fs_1.default.readFileSync(path_1.default.resolve(__dirname, "../certs/api.pustaka.co.in.crt")),
}, app);
httpServer.listen(port || 8080, () => {
    console.log("HTTP Server running on port 80");
});
httpsServer.listen(443, () => {
    console.log("HTTPS Server running on port 443");
});
//# sourceMappingURL=index.js.map