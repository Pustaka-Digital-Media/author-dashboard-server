import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { getAuthorName } from "../utils/getAuthorInfo";

import { COLOR_PALETTE, S3_URL } from "../utils/globals";

const prisma = new PrismaClient();

export const getLanguageGraphData = async (req: Request, res: Response) => {
  const graphData: any = {};
  const authorId = parseInt(req.body.authorId);
  const copyrightOwner = parseInt(req.body.copyrightOwner);
  const typeOfBook = parseInt(req.body.typeOfBook);

  const authorName = await getAuthorName(authorId);

  const languages = await prisma.language_tbl.findMany({
    where: {
      language_id: {
        not: 0,
      },
    },
    select: {
      language_id: true,
      language_name: true,
    },
  });

  let colorIndex = 0;
  for (let j = 0; j < languages.length; j++) {
    const language = languages[j];

    let languageCount: number;
    if (typeOfBook && typeOfBook > 0) {
      if (typeOfBook === 4) {
        languageCount = await prisma.book_tbl.count({
          where: {
            author_name: authorId,
            copyright_owner: copyrightOwner,
            language: language.language_id,
            type_of_book: 1,
            paper_back_flag: 1,
            status: true,
          },
        });
      } else {
        languageCount = await prisma.book_tbl.count({
          where: {
            author_name: authorId,
            copyright_owner: copyrightOwner,
            language: language.language_id,
            type_of_book: typeOfBook,
            status: true,
            cost: {
              not: 3,
            },
          },
        });
      }
    } else {
      languageCount = await prisma.book_tbl.count({
        where: {
          author_name: authorId,
          copyright_owner: copyrightOwner,
          language: language.language_id,
          status: true,
        },
      });
    }

    if (languageCount > 0) {
      graphData[language.language_name] = {};
      graphData[language.language_name]["name"] = language.language_name;
      graphData[language.language_name]["count"] = languageCount;
      graphData[language.language_name]["bg_color"] =
        COLOR_PALETTE[colorIndex % COLOR_PALETTE.length];

      colorIndex++;
    }
  }

  res.json({
    name: authorName,
    data: graphData,
  });
};

export const getGenreGraphData = async (req: Request, res: Response) => {
  const graphData: any = {};
  const authorId = parseInt(req.body.authorId);
  const copyrightOwner = parseInt(req.body.copyrightOwner);
  const typeOfBook = parseInt(req.body.typeOfBook);

  const authorName = await getAuthorName(authorId);

  const genres = await prisma.genre_details_tbl.findMany({
    select: {
      genre_id: true,
      genre_name: true,
    },
  });

  let colorIndex = 0;
  for (let j = 0; j < genres.length; j++) {
    const genre = genres[j];

    let genreCount: number;
    if (typeOfBook && typeOfBook > 0) {
      if (typeOfBook === 4) {
        genreCount = await prisma.book_tbl.count({
          where: {
            author_name: authorId,
            copyright_owner: copyrightOwner,
            genre_id: genre.genre_id,
            type_of_book: 1,
            paper_back_flag: 1,
            status: true,
          },
        });
      } else {
        genreCount = await prisma.book_tbl.count({
          where: {
            author_name: authorId,
            copyright_owner: copyrightOwner,
            genre_id: genre.genre_id,
            type_of_book: typeOfBook,
            status: true,
            cost: {
              not: 3,
            },
          },
        });
      }
    } else {
      genreCount = await prisma.book_tbl.count({
        where: {
          author_name: authorId,
          copyright_owner: copyrightOwner,
          genre_id: genre.genre_id,
          status: true,
        },
      });
    }

    if (genreCount > 0) {
      graphData[genre.genre_name] = {};
      graphData[genre.genre_name]["name"] = genre.genre_name;
      graphData[genre.genre_name]["count"] = genreCount;
      graphData[genre.genre_name]["bg_color"] =
        COLOR_PALETTE[colorIndex % COLOR_PALETTE.length];

      colorIndex++;
    }
  }

  res.json({
    name: authorName,
    data: graphData,
  });
};

export const prepareBooksPublishedPagination = async (
  req: Request,
  res: Response
) => {
  const result: any = {};

  const authorId = parseInt(req.body.authorId);
  const copyrightOwner = parseInt(req.body.copyrightOwner);
  const typeOfBook = parseInt(req.body.typeOfBook);
  const limit = parseInt(req.body.limit);

  let booksCount: number;
  if (typeOfBook && typeOfBook > 0) {
    booksCount = await prisma.book_tbl.count({
      where: {
        author_name: authorId,
        copyright_owner: copyrightOwner,
        type_of_book: typeOfBook,
        status: true,
      },
    });
  } else {
    booksCount = await prisma.book_tbl.count({
      where: {
        author_name: authorId,
      },
    });
  }

  result.totalPages = Math.floor(booksCount / limit) || 1;
  result.totalBooks = booksCount;

  res.json(result);
};

export const getPaginatedPublishedBooks = async (
  req: Request,
  res: Response
) => {
  const authorId = parseInt(req.body.authorId);
  const copyrightOwner = parseInt(req.body.copyrightOwner);
  const typeOfBook = parseInt(req.body.typeOfBook);
  const currentPage = parseInt(req.body.currentPage);
  const limit = parseInt(req.body.limit);

  const result: any = [];

  const whereClause: any = {
    author_name: authorId,
    copyright_owner: copyrightOwner,
    status: true,
  };
  if (typeOfBook) {
    if (typeOfBook === 4) {
      whereClause.type_of_book = 1;
      whereClause.paper_back_flag = 1;
    } else {
      whereClause.type_of_book = typeOfBook;
    }
  }

  const books = await prisma.book_tbl.findMany({
    skip: currentPage === 1 ? 0 : currentPage * limit,
    take: limit,
    where: whereClause,
    select: {
      book_id: true,
      book_title: true,
      url_name: true,
      royalty: true,
      number_of_page: true,
      activated_at: true,
      type_of_book: true,
      genre: {
        select: {
          genre_name: true,
        },
      },
      language_tbl_relation: {
        select: {
          language_name: true,
        },
      },
    },
    orderBy: {
      activated_at: "desc",
    },
  });

  const linkData: any = {};
  for (let i = 0; i < books.length; i++) {
    const book: any = books[i];

    linkData["pustaka"] = {};
    linkData["pustaka"]["url"] =
      "https://www.pustaka.co.in/home/" +
      (book.type_of_book === 3 ? "audiobooks" : "ebook") +
      "/" +
      book.language_tbl_relation.language_name.toLowerCase() +
      "/" +
      book.url_name;
    linkData["pustaka"]["image_url"] = S3_URL + "/pustaka-table-icon.svg";

    if (typeOfBook !== 4) {
      if (typeOfBook !== 3) {
        const amazonLinkData = await prisma.amazon_books.findUnique({
          where: {
            book_id: book.book_id,
          },
          select: {
            asin: true,
          },
        });
        linkData["amazon"] = {};
        linkData["amazon"]["url"] =
          amazonLinkData?.asin &&
          "https://amazon.in/dp/" + amazonLinkData?.asin;
        linkData["amazon"]["image_url"] = S3_URL + "/kindle-table-icon.svg";
      }

      if (typeOfBook !== 3) {
        const scribdLinkData = await prisma.scribd_books.findUnique({
          where: {
            book_id: book.book_id,
          },
          select: {
            doc_id: true,
          },
        });
        linkData["scribd"] = {};
        linkData["scribd"]["url"] =
          scribdLinkData?.doc_id &&
          "https://scribd.com/book/" + scribdLinkData?.doc_id;
        linkData["scribd"]["image_url"] = S3_URL + "/scrib-table-icon.svg";
      }

      if (typeOfBook !== 3) {
        const pratilipiLinkData = await prisma.pratilipi_books.findUnique({
          where: {
            book_id: book.book_id,
          },
          select: {
            series_url: true,
          },
        });
        if (pratilipiLinkData != null) {
          linkData["pratilipi"] = {};
          linkData["pratilipi"]["url"] = pratilipiLinkData?.series_url;
          linkData["pratilipi"]["image_url"] = S3_URL + "/pratilipi-icon.png";
        }
      }

      const googleLinkData = await prisma.google_books.findUnique({
        where: {
          book_id: book.book_id,
        },
        select: {
          play_store_link: true,
        },
      });
      linkData["google"] = {};
      linkData["google"]["url"] = googleLinkData?.play_store_link;
      linkData["google"]["image_url"] = S3_URL + "/google-table-icon.svg";

      const storytelLinkData = await prisma.storytel_books.findUnique({
        where: {
          book_id: book.book_id,
        },
        select: {
          title: true,
        },
      });
      linkData["storytel"] = {};
      linkData["storytel"]["url"] = "javascript:void(0)";
      linkData["storytel"]["image_url"] = S3_URL + "/storytel-table-icon.svg";

      if (typeOfBook !== 3) {
        const overdriveLinkData = await prisma.overdrive_books.findUnique({
          where: {
            book_id: book.book_id,
          },
          select: {
            sample_link: true,
          },
        });
        linkData["overdrive"] = {};
        linkData["overdrive"]["url"] = overdriveLinkData?.sample_link;
        linkData["overdrive"]["image_url"] =
          S3_URL + "/overdrive-table-icon.svg";
      }
    } else {
      const amazonPaperbackLinkData =
        await prisma.amazon_paperback_books.findUnique({
          where: {
            book_id: book.book_id,
          },
          select: {
            asin: true,
          },
        });
      if (amazonPaperbackLinkData?.asin) {
        linkData["amazonpaperback"] = {};
        linkData["amazonpaperback"]["url"] =
          "https://amazon.in/dp/" + amazonPaperbackLinkData?.asin;
        linkData["amazonpaperback"]["image_url"] =
          S3_URL + "/amazon-paperback-icon.svg";
      }
    }

    book.channel_links = linkData;

    result.push(book);
  }

  res.json(result);
};

export const getBooksPublishedGraphData = async (
  req: Request,
  res: Response
) => {
  const authorId = parseInt(req.body.authorId);
  const copyrightOwner = parseInt(req.body.copyrightOwner);

  (BigInt.prototype as any).toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
  };

  const graphData = await prisma.$queryRaw`
    SELECT
      COUNT(*) AS book_count,
      DATE_FORMAT(book_tbl.activated_at, '%b, %y') AS published_date,
      book_tbl.activated_at as raw_date
    FROM
      book_tbl
    WHERE
      book_tbl.author_name = ${authorId}
      book_tbl.copyrightOwner = ${copyrightOwner}
      AND book_tbl.activated_at IS NOT NULL
      AND book_tbl.status = 1
    GROUP BY published_date
    ORDER BY book_tbl.activated_at ASC
  `;

  res.json(graphData);
};

export const prepareGiftBooksPagination = async (
  req: Request,
  res: Response
) => {
  const result: any = {};

  const authorId = parseInt(req.body.authorId);
  const copyrightOwner = parseInt(req.body.copyrightOwner);
  const limit = parseInt(req.body.limit);

  let booksCount: number;
  booksCount = await prisma.book_tbl.count({
    where: {
      author_name: authorId,
      copyright_owner: copyrightOwner,
      status: true,
    },
  });

  result.totalPages = Math.floor(booksCount / limit) || 1;
  result.totalBooks = booksCount;

  res.json(result);
};

export const getPaginatedGiftBooks = async (req: Request, res: Response) => {
  const authorId = parseInt(req.body.authorId);
  const copyrightOwner = parseInt(req.body.copyrightOwner);
  const currentPage = parseInt(req.body.currentPage);
  const limit = parseInt(req.body.limit);

  const result: any = [];

  const books = await prisma.book_tbl.findMany({
    skip: currentPage === 1 ? 0 : currentPage * limit,
    take: limit,
    where: {
      author_name: authorId,
      copyright_owner: copyrightOwner,
      status: true,
    },
    select: {
      book_id: true,
      book_title: true,
      url_name: true,
      number_of_page: true,
      type_of_book: true,
      paper_back_flag: true,
      genre: {
        select: {
          genre_name: true,
        },
      },
      language_tbl_relation: {
        select: {
          language_name: true,
        },
      },
    },
    orderBy: {
      activated_at: "desc",
    },
  });

  for (let i = 0; i < books.length; i++) {
    let book: any = books[i];

    const giftCount = await prisma.author_gift_books.count({
      where: {
        book_id: book.book_id,
      },
    });

    book.gift_count = giftCount;

    if (book.type_of_book === 3) {
      book.type = "Audiobook";
    } else {
      book.type = "eBook";
    }

    result.push(book);
  }

  res.json(result);
};

export const getGiftBookDetails = async (req: Request, res: Response) => {
  const bookId = parseInt(req.body.bookId);

  const bookDetails: any = await prisma.book_tbl.findFirst({
    where: {
      book_id: bookId,
    },
    select: {
      book_title: true,
      genre: {
        select: {
          genre_name: true,
        },
      },
    },
  });
  const giftBooks = await prisma.author_gift_books.findMany({
    where: {
      book_id: bookId,
    },
    select: {
      book_id: true,
      user: {
        select: {
          user_id: true,
          username: true,
          email: true,
        },
      },
    },
  });
  bookDetails.giftUsers = giftBooks;

  res.json(bookDetails);
};
