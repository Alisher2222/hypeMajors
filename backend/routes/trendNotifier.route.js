import express from "express";
import { scheduleTrendNotifications } from "../controllers/trendNotifier.controller.js";

const router = express.Router();

router.post("/notify", scheduleTrendNotifications);

export default router;
