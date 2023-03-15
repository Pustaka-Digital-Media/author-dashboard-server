import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAuthorName = async (authorId: number) => {
  const authorNameData = await prisma.author_tbl.findFirst({
    where: {
      author_id: authorId,
    },
    select: {
      author_name: true,
    },
  });

  if (authorNameData && authorNameData.author_name) {
    return authorNameData.author_name;
  }
  return "";
};

export default getAuthorName;
