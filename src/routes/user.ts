import express from "express";

import { login } from "../controllers/user";

const router = express.Router();

router.post("/login", login);

export default router;
