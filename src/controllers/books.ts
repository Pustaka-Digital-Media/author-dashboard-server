import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import getAuthorName from "../utils/getAuthorName";

import { COLOR_PALETTE } from "../utils/globals";

const prisma = new PrismaClient();

export const getLanguageGraphData = async (req: Request, res: Response) => {
  const graphData: any = {};
  const authorId = parseInt(req.body.authorId);
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
            language: language.language_id,
            type_of_book: 1,
            paper_back_flag: 1,
          },
        });
      } else {
        languageCount = await prisma.book_tbl.count({
          where: {
            author_name: authorId,
            language: language.language_id,
            type_of_book: typeOfBook,
          },
        });
      }
    } else {
      languageCount = await prisma.book_tbl.count({
        where: {
          author_name: authorId,
          language: language.language_id,
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
            genre_id: genre.genre_id,
            type_of_book: 1,
            paper_back_flag: 1,
          },
        });
      } else {
        genreCount = await prisma.book_tbl.count({
          where: {
            author_name: authorId,
            genre_id: genre.genre_id,
            type_of_book: typeOfBook,
          },
        });
      }
    } else {
      genreCount = await prisma.book_tbl.count({
        where: {
          author_name: authorId,
          genre_id: genre.genre_id,
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
