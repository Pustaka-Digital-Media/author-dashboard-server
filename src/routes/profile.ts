import express from "express";

import { getProfileData } from "../controllers/profile";

const router = express.Router();

router.post("/getProfileData", getProfileData);

export default router;
