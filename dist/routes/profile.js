"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profile_1 = require("../controllers/profile");
const router = express_1.default.Router();
router.post("/getProfileData", profile_1.getProfileData);
exports.default = router;
//# sourceMappingURL=profile.js.map