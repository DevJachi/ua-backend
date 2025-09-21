import express from "express";
import { totalpoints } from "../controllers/totalpoints.controller.js";
import { useCheckerMiddleware } from "../middleware/userChecker.middleware.js";

const router = express.Router();

router.post("/:examId/totalPoints", useCheckerMiddleware, totalpoints);
export default router;
