import express from "express";

import {
  getGenreGraphData,
  getLanguageGraphData,
  prepareBooksPublishedPagination,
  getPaginatedPublishedBooks,
  getBooksPublishedGraphData,
} from "../controllers/books";

const router = express.Router();

router.post("/getGenreGraphData", getGenreGraphData);
router.post("/getLanguageGraphData", getLanguageGraphData);
router.post(
  "/prepareBooksPublishedPagination",
  prepareBooksPublishedPagination
);
router.post("/getPaginatedPublishedBooks", getPaginatedPublishedBooks);
router.post("/getBooksPublishedGraphData", getBooksPublishedGraphData);

export default router;
