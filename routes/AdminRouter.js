import express from "express";
import { attendanceUpdate } from "../controller/employee.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/update-attendance/:empId").patch(protect, attendanceUpdate);

export default router;
