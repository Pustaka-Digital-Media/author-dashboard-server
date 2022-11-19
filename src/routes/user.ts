import express from "express";

import { login, getAuthorIdData } from "../controllers/user";

const router = express.Router();

router.post("/login", login);
router.post("/getAuthorIds", getAuthorIdData);

export default router;
