"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const royalty_1 = require("../controllers/royalty");
const router = express_1.default.Router();
router.post("/getRoyaltySummaryData", royalty_1.getRoyaltySummaryData);
router.post("/getAllChannelSummaryData", royalty_1.getAllChannelSummaryData);
router.post("/getPaymentsForMonth", royalty_1.getPaymentsForMonth);
exports.default = router;
//# sourceMappingURL=royalty.js.map