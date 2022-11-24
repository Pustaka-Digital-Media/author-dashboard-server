"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboard_1 = require("../controllers/dashboard");
const router = express_1.default.Router();
router.post("/getBasicDetails", dashboard_1.getBasicDetails);
router.post("/getChannelBooks", dashboard_1.getChannelBooks);
exports.default = router;
//# sourceMappingURL=dashboard.js.map