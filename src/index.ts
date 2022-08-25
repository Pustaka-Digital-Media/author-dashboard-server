import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", async (_: Request, res: Response) => {
  const allBooksByAuthor = await prisma.book_tbl.findMany({
    where: {
      author_name: 4,
    },
  });

  res.json(allBooksByAuthor);
});

app.listen(port, () => {
  console.log(`⚡️ [server]: Server is running at http://localhost:${port}`);
});
