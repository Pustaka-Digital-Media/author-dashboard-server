import express from "express";

import { getBasicDetails } from "../controllers/dashboard";

const router = express.Router();

router.post("/getBasicDetails", getBasicDetails);

export default router;
