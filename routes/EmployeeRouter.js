import express from "express";
import {
    addEmployees,
    getAllEmployees,
    getAnEmployee,
} from "../controller/employee.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getAllEmployees);
router.route("/:empId").get(protect, getAnEmployee);

// Route to add a new employee
router.route("/add").post(protect, addEmployees);
export default router;
