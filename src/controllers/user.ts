import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import md5 from "md5";

import getAuthorIds from "../utils/getAuthorIds";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  const userData = req.body;

  const authorUser = await prisma.users_tbl.findFirst({
    where: {
      email: userData.email,
      password: md5(userData.password),
      user_type: "2",
    },
    select: {
      user_id: true,
    },
  });

  if (authorUser) {
    res.json({ status: 1, copyrightOwner: authorUser.user_id });
  } else {
    res.json({ status: 0 });
  }
};

export const getAuthorIdData = async (req: Request, res: Response) => {
  const authorIds = await getAuthorIds(req.body.copyrightOwner);

  res.json(authorIds);
};
