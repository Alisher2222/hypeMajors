import express from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import { authentication } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", authentication, logout);

export default router;
