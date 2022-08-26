import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getBasicDetails = async (req: Request, res: Response) => {
  const result: any = { ebooks: {}, audiobooks: {}, paperback: {} };
  const authorId = parseInt(req.body.authorId);

  // Author Name
  const authorNameData = await prisma.author_tbl.findFirst({
    where: {
      author_id: authorId,
    },
    select: {
      author_name: true,
    },
  });
  result.authorName = authorNameData?.author_name;

  // eBook Count and Pages
  const authorEbookCount = await prisma.book_tbl.count({
    where: {
      author_name: authorId,
      type_of_book: 1,
    },
  });
  const authorEbookPages = await prisma.book_tbl.aggregate({
    _sum: {
      number_of_page: true,
    },
    where: {
      author_name: authorId,
      type_of_book: 1,
    },
  });
  result.ebooks.ebook_count = authorEbookCount;
  result.ebooks.ebook_pages = authorEbookPages._sum.number_of_page;

  // Audiobook Count and Pages
  const authorAudiobookCount = await prisma.book_tbl.count({
    where: {
      author_name: authorId,
      type_of_book: 3,
    },
  });
  const authorAudiobookPages = await prisma.book_tbl.aggregate({
    _sum: {
      number_of_page: true,
    },
    where: {
      author_name: authorId,
      type_of_book: 3,
    },
  });
  result.audiobooks.audiobook_count = authorAudiobookCount;
  result.audiobooks.audiobook_pages = authorAudiobookPages._sum.number_of_page;

  // Paperback Count and Pages
  const authorPaperbackCount = await prisma.book_tbl.count({
    where: {
      author_name: authorId,
      type_of_book: 1,
      paper_back_flag: 1,
    },
  });
  const authorPaperbackPages = await prisma.book_tbl.aggregate({
    _sum: {
      number_of_page: true,
    },
    where: {
      author_name: authorId,
      type_of_book: 1,
      paper_back_flag: 1,
    },
  });
  result.paperback.ebook_count = authorPaperbackCount;
  result.paperback.ebook_pages = authorPaperbackPages._sum.number_of_page;

  res.json(result);
};
