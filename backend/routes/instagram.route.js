import express from "express";
import { analyzeInstagram } from "../controllers/instagram.controller.js";

const router = express.Router();

router.post("/analyze", analyzeInstagram);

export default router;
