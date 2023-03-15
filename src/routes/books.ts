import express from "express";

import {
  getGenreGraphData,
  getLanguageGraphData,
  prepareBooksPublishedPagination,
  getPaginatedPublishedBooks,
  getBooksPublishedGraphData,
  prepareGiftBooksPagination,
  getPaginatedGiftBooks,
  getGiftBookDetails,
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
router.post("/prepareGiftBooksPagination", prepareGiftBooksPagination);
router.post("/getPaginatedGiftBooks", getPaginatedGiftBooks);
router.post("/getGiftBookDetails", getGiftBookDetails);

export default router;
