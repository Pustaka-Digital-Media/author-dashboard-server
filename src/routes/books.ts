import express from "express";

import { getGenreGraphData, getLanguageGraphData } from "../controllers/books";

const router = express.Router();

router.post("/getGenreGraphData", getGenreGraphData);
router.post("/getLanguageGraphData", getLanguageGraphData);

export default router;
