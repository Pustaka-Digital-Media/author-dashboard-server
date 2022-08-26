import express, { Express } from "express";
import dotenv from "dotenv";

import dashboardRouter from "./routes/dashboard";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/dashboard", dashboardRouter);

app.listen(8080, () => {
  console.log(`⚡️ [server]: Server is running at http://localhost:${port}`);
});
