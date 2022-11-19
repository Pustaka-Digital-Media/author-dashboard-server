import express, { Express } from "express";
import dotenv from "dotenv";
// const cors = require("cors");

import dashboardRouter from "./routes/dashboard";
import userRouter from "./routes/user";
import booksRouter from "./routes/books";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

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

app.use("/dashboard", dashboardRouter);
app.use("/user", userRouter);
app.use("/books", booksRouter);

app.listen(8080, () => {
  console.log(`⚡️ [server]: Server is running at http://localhost:${port}`);
});
