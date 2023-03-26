import express from "express";

import {
  getRoyaltySummaryData,
  getAllChannelSummaryData,
  getPaymentsForMonth,
} from "../controllers/royalty";

const router = express.Router();

router.post("/getRoyaltySummaryData", getRoyaltySummaryData);
router.post("/getAllChannelSummaryData", getAllChannelSummaryData);
router.post("/getPaymentsForMonth", getPaymentsForMonth);

export default router;
