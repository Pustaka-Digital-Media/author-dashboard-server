import { Request, Response } from "express";
import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

export const getProfileData = async (req: Request, res: Response) => {
  const authorId = parseInt(req.body.authorId);

  const profileData: any = await prisma.author_tbl.findFirst({
    where: {
      author_id: authorId,
    },
  });

  const regionalNameData = await prisma.author_language.findMany({
    where: {
      author_id: authorId,
    },
    select: {
      regional_author_name: true,
      language: {
        select: {
          language_name: true,
        },
      },
    },
  });
  profileData.regional_name_data = regionalNameData;

  res.json(profileData);
};
