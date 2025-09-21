import express from "express";
import { createQuestion } from "../controllers/question.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:examId/createQuestion", authMiddleware, createQuestion);

export default router;
