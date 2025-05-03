import express from "express";
import {
  createBusiness,
  getBusiness,
  updateBusiness,
  deleteBusiness,
} from "../controllers/business.controller.js";
import { authentication } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", authentication, createBusiness);
router.get("/:userId", getBusiness);
router.put("/:userId", authentication, updateBusiness);
router.delete("/:businessId", authentication, deleteBusiness);

export default router;
