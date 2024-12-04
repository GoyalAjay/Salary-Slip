import express from "express";
const router = express.Router();
import { login, logout, addHR, getHRProfile } from "../controller/employee.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/add").post(protect, addHR);
router.route("/profile/:id").get(protect, getHRProfile);

// Route to login
router.route("/login").post(login);
router.route("/logout").post(logout);

export default router;
