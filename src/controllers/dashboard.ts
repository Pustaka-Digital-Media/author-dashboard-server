import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import getAuthorName from "../utils/getAuthorName";

import { BOOK_TYPES, S3_URL } from "../utils/globals";

const prisma = new PrismaClient();

export const getBasicDetails = async (req: Request, res: Response) => {
  const authorId = parseInt(req.body.authorId);
  let authorData: any = { ebooks: {}, audiobooks: {}, paperback: {} };

  // Author Name
  const authorName = await getAuthorName(authorId);
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
  authorData.ebooks.count = authorEbookCount;
  authorData.ebooks.pages = authorEbookPages._sum.number_of_page;

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
  authorData.audiobooks.count = authorAudiobookCount;
  authorData.audiobooks.pages = authorAudiobookPages._sum.number_of_page || 0;

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
  authorData.paperback.count = authorPaperbackCount;
  authorData.paperback.pages = authorPaperbackPages._sum.number_of_page || 0;

  res.json({
    name: authorName,
    data: authorData,
  });
};

export const getChannelBooks = async (req: Request, res: Response) => {
  const authorId = parseInt(req.body.authorId);
  const includeTypes = req.body.includeTypes || [1, 3, 4];

  let booksData: any = {};
  booksData["ebooks"] = {};
  booksData["audiobooks"] = {};
  booksData["paperback"] = {};

  // Author Name
  const authorName = await getAuthorName(authorId);

  // Pustaka
  if (includeTypes.includes(1)) {
    const pustakaEBooksCount = await prisma.book_tbl.count({
      where: {
        author_name: authorId,
        type_of_book: 1,
      },
    });
    booksData["ebooks"]["pustaka"] = {};
    booksData["ebooks"]["pustaka"]["name"] = "Pustaka";
    booksData["ebooks"]["pustaka"]["count"] = pustakaEBooksCount;
    booksData["ebooks"]["pustaka"]["url"] = S3_URL + "/pustaka-icon.svg";
  }

  if (includeTypes.includes(3)) {
    const pustakaAudiobooksCount = await prisma.book_tbl.count({
      where: {
        author_name: authorId,
        type_of_book: 3,
      },
    });
    booksData["audiobooks"]["pustaka"] = {};
    booksData["audiobooks"]["pustaka"]["name"] = "Pustaka";
    booksData["audiobooks"]["pustaka"]["count"] = pustakaAudiobooksCount;
    booksData["audiobooks"]["pustaka"]["url"] = S3_URL + "/pustaka-icon.svg";
  }

  if (includeTypes.includes(4)) {
    const paperbackCount = await prisma.book_tbl.count({
      where: {
        author_name: authorId,
        paper_back_flag: 1,
      },
    });
    booksData["paperback"]["pustaka"] = {};
    booksData["paperback"]["pustaka"]["name"] = "Pustaka";
    booksData["paperback"]["pustaka"]["count"] = paperbackCount;
    booksData["paperback"]["pustaka"]["url"] = S3_URL + "/pustaka-icon.svg";
  }

  for (let i = 0; i < BOOK_TYPES.length; i++) {
    const bookType = BOOK_TYPES[i];

    if (includeTypes.includes(bookType.id)) {
      if (bookType.id === 3) {
        // Audible
        const audibleBooksCount = await prisma.audible_books.count({
          where: {
            author_id: authorId,
            book: {
              type_of_book: bookType.id,
            },
          },
        });
        booksData[bookType.name]["audible"] = {};
        booksData[bookType.name]["audible"]["name"] = "Audible";
        booksData[bookType.name]["audible"]["count"] = audibleBooksCount;
        booksData[bookType.name]["audible"]["url"] =
          S3_URL + "/audible-icon.svg";
      } else {
        // Amazon
        const amazonBooksCount = await prisma.amazon_books.count({
          where: {
            author_id: authorId,
            book: {
              type_of_book: bookType.id,
            },
          },
        });
        booksData[bookType.name]["amazon"] = {};
        booksData[bookType.name]["amazon"]["name"] = "Amazon";
        booksData[bookType.name]["amazon"]["count"] = amazonBooksCount;
        booksData[bookType.name]["amazon"]["url"] = S3_URL + "/amazon-icon.svg";
      }

      // Scribd
      const scribdBooksCount = await prisma.scribd_books.count({
        where: {
          author_id: authorId,
          book: {
            type_of_book: bookType.id,
          },
        },
      });
      booksData[bookType.name]["scribd"] = {};
      booksData[bookType.name]["scribd"]["name"] = "Scribd";
      booksData[bookType.name]["scribd"]["count"] = scribdBooksCount;
      booksData[bookType.name]["scribd"]["url"] = S3_URL + "/scrib-icon.svg";

      // Google Books
      const googleBooksCount = await prisma.google_books.count({
        where: {
          author_id: authorId,
          book: {
            type_of_book: bookType.id,
          },
        },
      });
      booksData[bookType.name]["google"] = {};
      booksData[bookType.name]["google"]["name"] = "Google";
      booksData[bookType.name]["google"]["count"] = googleBooksCount;
      booksData[bookType.name]["google"]["url"] =
        S3_URL + "/google-books-icon.svg";

      // Storytel
      const storytelBooksCount = await prisma.storytel_books.count({
        where: {
          author_id: authorId,
          book: {
            type_of_book: bookType.id,
          },
        },
      });
      booksData[bookType.name]["storytel"] = {};
      booksData[bookType.name]["storytel"]["name"] = "Storytel";
      booksData[bookType.name]["storytel"]["count"] = storytelBooksCount;
      booksData[bookType.name]["storytel"]["url"] =
        S3_URL + "/storytel-icon.svg";

      // Overdrive
      const overdriveBooksCount = await prisma.overdrive_books.count({
        where: {
          author_id: authorId,
          book: {
            type_of_book: bookType.id,
          },
        },
      });
      booksData[bookType.name]["overdrive"] = {};
      booksData[bookType.name]["overdrive"]["name"] = "Overdrive";
      booksData[bookType.name]["overdrive"]["count"] = overdriveBooksCount;
      booksData[bookType.name]["overdrive"]["url"] =
        S3_URL + "/overdrive-icon.svg";
    }
  }

  res.json({
    name: authorName,
    data: booksData,
  });
};
