import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import getAuthorIds from "../utils/getAuthorIds";
import getAuthorName from "../utils/getAuthorName";

import { bookTypes } from "../utils/globals";

const prisma = new PrismaClient();

export const getBasicDetails = async (req: Request, res: Response) => {
  const authorIds = await getAuthorIds(req.body.copyrightOwner);

  let result: any = [];

  for (let i = 0; i < authorIds.length; i++) {
    const authorId = authorIds[i];
    let authorData: any = { ebooks: {}, audiobooks: {}, paperback: {} };

    // Author Name
    const authorName = getAuthorName(authorId);
    authorData.authorName = authorName;

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
    authorData.ebooks.ebook_count = authorEbookCount;
    authorData.ebooks.ebook_pages = authorEbookPages._sum.number_of_page;

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
    authorData.audiobooks.audiobook_count = authorAudiobookCount;
    authorData.audiobooks.audiobook_pages =
      authorAudiobookPages._sum.number_of_page;

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
    authorData.paperback.ebook_count = authorPaperbackCount;
    authorData.paperback.ebook_pages = authorPaperbackPages._sum.number_of_page;

    result.push({
      name: authorName,
      data: authorData,
    });
  }

  res.json(result);
};

export const getChannelBooks = async (req: Request, res: Response) => {
  const authorIds = await getAuthorIds(req.body.copyrightOwner);

  const result: any = [];

  for (let i = 0; i < authorIds.length; i++) {
    const authorId = authorIds[i];

    let booksData: any = {};
    booksData["ebooks"] = {};
    booksData["audiobooks"] = {};

    // Author Name
    const authorName = getAuthorName(authorId);

    for (let i = 0; i < bookTypes.length; i++) {
      const bookType = bookTypes[i];

      // Amazon
      const amazonBooksCount = await prisma.amazon_books.count({
        where: {
          author_id: authorId,
          book: {
            type_of_book: bookType.id,
          },
        },
      });
      booksData[bookType.name]["amazon"] = amazonBooksCount;

      // Scribd
      const scribdBooksCount = await prisma.scribd_books.count({
        where: {
          author_id: authorId,
          book: {
            type_of_book: bookType.id,
          },
        },
      });
      booksData[bookType.name]["scribd"] = scribdBooksCount;

      // Google Books
      const googleBooksCount = await prisma.google_books.count({
        where: {
          author_id: authorId,
          book: {
            type_of_book: bookType.id,
          },
        },
      });
      booksData[bookType.name]["google"] = googleBooksCount;

      // Storytel
      const storytelBooksCount = await prisma.storytel_books.count({
        where: {
          author_id: authorId,
          book: {
            type_of_book: bookType.id,
          },
        },
      });
      booksData[bookType.name]["storytel"] = storytelBooksCount;

      // Overdrive
      const overdriveBooksCount = await prisma.overdrive_books.count({
        where: {
          author_id: authorId,
          book: {
            type_of_book: bookType.id,
          },
        },
      });
      booksData[bookType.name]["overdrive"] = overdriveBooksCount;
    }

    // Pustaka
    const pustakaEBooksCount = await prisma.book_tbl.count({
      where: {
        author_name: authorId,
        type_of_book: 1,
      },
    });
    booksData["ebooks"]["pustaka"] = pustakaEBooksCount;

    const pustakaAudiobooksCount = await prisma.book_tbl.count({
      where: {
        author_name: authorId,
        type_of_book: 3,
      },
    });
    booksData["audiobooks"]["pustaka"] = pustakaAudiobooksCount;

    const paperbackCount = await prisma.book_tbl.count({
      where: {
        author_name: authorId,
        paper_back_flag: 1,
      },
    });
    booksData["paperback"] = paperbackCount;

    result.push({
      name: authorName,
      data: booksData,
    });
  }

  res.json(result);
};
