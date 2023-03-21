import express from "express";

import { getRoyaltySummaryData } from "../controllers/royalty";

const router = express.Router();

router.post("/getRoyaltySummaryData", getRoyaltySummaryData);

export default router;
