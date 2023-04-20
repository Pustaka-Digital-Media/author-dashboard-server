import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import md5 from "md5";

import getAuthorIds from "../utils/getAuthorIds";
import { getAuthorName } from "../utils/getAuthorInfo";

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

  if (authorUser && authorUser.user_id) {
    const authorIdData = [];
    const authorIds = await getAuthorIds(authorUser!.user_id.toString());

    for (let i = 0; i < authorIds.length; i++) {
      const authorId = authorIds[i];
      const authorName = await getAuthorName(authorId);

      authorIdData.push({
        author_id: authorId,
        author_name: authorName,
      });
    }

    res.json({
      status: 1,
      copyrightOwner: authorUser.user_id,
      authorIds: authorIdData,
    });
  } else {
    res.json({ status: 0 });
  }
};
