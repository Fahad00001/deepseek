import express from "express";
import { sendprompt } from "../controllers/prompt.controller.js";
import userMiddleware from "../middleware/prompt.middleware.js";
// import { login, logout, signup } from "..controllers/user.controller.js";

const router = express.Router();
router.post("/prompt", userMiddleware, sendprompt);

export default router;
