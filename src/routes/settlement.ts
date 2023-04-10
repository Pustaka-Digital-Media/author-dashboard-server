import express from "express";

import { getSettlementDashboardData } from "../controllers/settlement";

const router = express.Router();

router.post("/getSettlementDashboardData", getSettlementDashboardData);

export default router;
