import express from "express";
import { addExam } from "../controllers/exam.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/addExam", authMiddleware, addExam);

export default router;
