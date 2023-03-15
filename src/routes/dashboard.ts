import express from "express";

import { getBasicDetails, getChannelBooks } from "../controllers/dashboard";

const router = express.Router();

router.post("/getBasicDetails", getBasicDetails);
router.post("/getChannelBooks", getChannelBooks);

export default router;
