import express from "express";

import {
  getSettlementDashboardData,
  getRecentSettlements,
  getNextSettlement,
} from "./../controllers/settlement";

const router = express.Router();

router.post("/getSettlementDashboardData", getSettlementDashboardData);
router.post("/getRecentSettlements", getRecentSettlements);
router.post("/getNextSettlement", getNextSettlement);

export default router;
