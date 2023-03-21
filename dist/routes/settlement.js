"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settlement_1 = require("./../controllers/settlement");
const router = express_1.default.Router();
router.post("/getSettlementDashboardData", settlement_1.getSettlementDashboardData);
exports.default = router;
//# sourceMappingURL=settlement.js.map