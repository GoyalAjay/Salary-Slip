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
            if (!req.hr.isActive) {
                res.status(401);
                throw new Error("Your account is deactivated");
            }
            const rolesHierarchy = {
                hr: ["hr", "admin"],
            };
            const hrRoles = req.hr.empRole;
            req.roles = new Set();
            Object.values(rolesHierarchy).forEach((hierarchy) => {
                hrRoles.forEach((role) => {
                    const roleIndex = hierarchy.indexOf(role);
                    if (roleIndex !== -1) {
                        hierarchy.slice(0, roleIndex + 1).forEach((role) => {
                            req.roles.add(role);
                        });
                    }
                });
            });

            const requestedRole = req.query?.role;
            if (!requestedRole || !req.roles.has(requestedRole)) {
                res.status(403);
                throw new Error(
                    "You don't have the required permission for this role!!"
                );
            }
            req.activeRole = requestedRole;
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
