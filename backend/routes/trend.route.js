import express from "express";
import {
  getInstagramTrends,
  getTiktokTrends,
} from "../controllers/trend.controller.js";

const router = express.Router();

router.post("/instagram", getInstagramTrends);
router.post("/tiktok", getTiktokTrends);

export default router;
