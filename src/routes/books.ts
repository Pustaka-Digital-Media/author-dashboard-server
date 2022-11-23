import express from "express";

import {
  getGenreGraphData,
  getLanguageGraphData,
  prepareBooksPublishedPagination,
  getPaginatedPublishedBooks,
} from "../controllers/books";

const router = express.Router();

router.post("/getGenreGraphData", getGenreGraphData);
router.post("/getLanguageGraphData", getLanguageGraphData);
router.post(
  "/prepareBooksPublishedPagination",
  prepareBooksPublishedPagination
);
router.post("/getPaginatedPublishedBooks", getPaginatedPublishedBooks);

export default router;
