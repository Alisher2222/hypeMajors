import express from "express";
import {
  getInstagramTrends,
  getTiktokTrends,
  generateVideoTemplate,
  generateVideoFromTemplate,
  generateImageVideo,
} from "../controllers/video.controller.js";

const router = express.Router();

router.post("/instagram", getInstagramTrends);
router.post("/tiktok", getTiktokTrends);

router.post("/generate-template", generateVideoTemplate);
router.post("/generate-video", generateVideoFromTemplate);
router.post("/generate-image-video", generateImageVideo);

export default router;
