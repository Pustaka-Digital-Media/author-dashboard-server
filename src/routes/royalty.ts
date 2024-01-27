import express from "express";

import {
  getRoyaltySummaryData,
  getAllChannelSummaryData,
  getPreviousPaperbackRoyaltySummaryData,
  getPaymentsForMonth,
  preparePaperbackStockPagination,
  getPaginatedPaperbackStock,
  getPaperbackStockDetails,
} from "../controllers/royalty";

const router = express.Router();

router.post("/getRoyaltySummaryData", getRoyaltySummaryData);
router.post("/getAllChannelSummaryData", getAllChannelSummaryData);
router.post("/getPaymentsForMonth", getPaymentsForMonth);
router.post(
  "/getPreviousPaperbackRoyaltySummaryData",
  getPreviousPaperbackRoyaltySummaryData
);
router.post(
  "/preparePaperbackStockPagination",
  preparePaperbackStockPagination
);
router.post("/getPaginatedPaperbackStock", getPaginatedPaperbackStock);
router.post("/getPaperbackStockDetails", getPaperbackStockDetails);

export default router;
