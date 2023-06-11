import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAuthorIds = async (copyrightOwner: string) => {
  const copyrightOwnerInt = parseInt(copyrightOwner);

  const authorIds = await prisma.copyright_mapping.findMany({
    where: {
      copyright_owner: copyrightOwnerInt,
      author: {
        status: {
          equals: "1",
        },
      },
    },
    select: {
      author_id: true,
      author: {
        select: {
          status: true,
        },
      },
    },
  });

  const result: number[] = [];
  for (let i = 0; i < authorIds.length; i++) {
    const authorIdData = authorIds[i];

    result.push(authorIdData.author_id!);
  }

  return result;
};

export default getAuthorIds;
