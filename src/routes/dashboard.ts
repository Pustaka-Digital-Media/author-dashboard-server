import express from "express";

import {
  getBasicDetails,
  getChannelBooks,
  getTransactionStatusSummary,
} from "../controllers/dashboard";

const router = express.Router();

router.post("/getBasicDetails", getBasicDetails);
router.post("/getChannelBooks", getChannelBooks);
router.post("/getTransactionStatusSummary", getTransactionStatusSummary);

export default router;
