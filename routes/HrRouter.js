import express from "express";
import { login, logout, addHR, getHRProfile } from "../controller/employee.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/add").post(addHR);
router.route("/profile/:id").get(protect, getHRProfile);

// Route to login
router.route("/login").post(login);
router.route("/logout").post(logout);

export default router;
