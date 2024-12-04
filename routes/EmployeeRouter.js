import express from "express";
const router = express.Router();
import {
    addEmployees,
    getAllEmployees,
    getAnEmployee,
} from "../controller/employee.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/").get(protect, getAllEmployees);
router.route("/:id").get(protect, getAnEmployee);

// Route to add a new employee
router.route("/add").post(protect, addEmployees);
export default router;
