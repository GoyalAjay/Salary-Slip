import asyncHandler from "./asyncHandler.js";
import jwt from "jsonwebtoken";
import HR from "../model/HR.js";

// Protected Routes
const protect = asyncHandler(async (req, res, next) => {
    let token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.hr = await HR.findById(decoded.id).select("-password");

            if (!req.hr) {
                res.status(404);
                throw new Error("HR not found");
            }
            req.role = req.hr.empRole;
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not Authorized: Invalid token");
        }
    } else {
        res.status(403);
        throw new Error("Not Authorized!!! No token found");
    }
});

// Admin Route
const admin = (req, res, next) => {
    if (req.activeRole !== "admin") {
        res.status(401);
        throw new Error("Not Authorized as Admin!!");
    }
    next();
};

export { protect, admin };
