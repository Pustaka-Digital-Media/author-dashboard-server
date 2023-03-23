import express from "express";

import {
  getRoyaltySummaryData,
  getFyRoyaltySummary,
} from "../controllers/royalty";

const router = express.Router();

router.post("/getRoyaltySummaryData", getRoyaltySummaryData);
router.post("/getFyRoyaltySummary", getFyRoyaltySummary);

export default router;
