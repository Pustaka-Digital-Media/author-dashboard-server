import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

import dashboardRouter from "./routes/dashboard";
import userRouter from "./routes/user";
import booksRouter from "./routes/books";
import profileRouter from "./routes/profile";
import royaltyRouter from "./routes/royalty";
import settlementRouter from "./routes/settlement";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use(function (req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  // Set custom headers for CORS
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Custom-Header"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return next();
});

app.get("/", (_, res) => {
  res.send("Pustaka Author Dashboard API");
});

app.use("/dashboard", dashboardRouter);
app.use("/user", userRouter);
app.use("/books", booksRouter);
app.use("/profile", profileRouter);
app.use("/royalty", royaltyRouter);
app.use("/settlement", settlementRouter);

// Listen both http & https ports
const httpServer = http.createServer(app);
const httpsServer = https.createServer(
  {
    // key: fs.readFileSync(path.resolve(__dirname, "../certs/privatekey.key")),
    cert: fs.readFileSync(
      path.resolve(__dirname, "../certs/ssl_certificate.crt")
    ),
  },
  app
);

httpServer.listen(port || 8080, () => {
  console.log("HTTP Server running on port 80");
});

httpsServer.listen(443, () => {
  console.log("HTTPS Server running on port 443");
});
// app.listen(8080, () => {
//   console.log("⚡ server running on port 8080");
// });
