import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import md5 from "md5";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  const userData = req.body;

  const authorUser = await prisma.users_tbl.findFirst({
    where: {
      email: userData.email,
      password: md5(userData.password),
    },
  });

  const authors = await prisma.author_tbl.findMany({
    where: {
      user_id: authorUser?.user_id,
    },
  });

  if (authors) {
    const authorIds = authors.map((item) => item.author_id);
    res.json({ status: 1, authorIds: authorIds });
  } else {
    res.json({ status: 0 });
  }
};