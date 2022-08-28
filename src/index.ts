import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";

import dashboardRouter from "./routes/dashboard";
import userRouter from "./routes/user";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use("/dashboard", dashboardRouter);
app.use("/user", userRouter);

app.listen(8080, () => {
  console.log(`⚡️ [server]: Server is running at http://localhost:${port}`);
});
