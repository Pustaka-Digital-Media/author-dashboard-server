import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

export const getAuthorName = async (authorId: number) => {
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

export const getAuthorChannelLinks = async (authorId: number) => {
  const authorChannelData = await prisma.author_tbl.findFirst({
    where: {
      author_id: authorId,
    },
    select: {
      url_name: true,
      amazon_link: true,
      odilo_link: true,
      scribd_link: true,
      audible_link: true,
      storytel_link: true,
      overdrive_link: true,
      googlebooks_link: true,
      pratilipi_link: true,
    },
  });

  if (authorChannelData) {
    return authorChannelData;
  }
  return undefined;
};
