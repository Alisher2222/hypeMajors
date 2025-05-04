import express from "express";
import { analyzeTikTok } from "../controllers/tiktok.controller.js";

const router = express.Router();
router.post("/analyze", analyzeTikTok);
export default router;
