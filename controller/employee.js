import asyncHandler from "../middleware/asyncHandler.js";
// import Admin from "../models/Admin.js";
import Employee from "../model/Employees.js";
import HR from "../model/HR.js";
import { generateToken } from "../utils/generateToken.js";

// @desc Add Employee
// @route POST /api/employee/add
//@access Private
export const addEmployees = asyncHandler(async (req, res) => {
    if (req.role && req.role === "HR") {
        const { empId, name, email, mobile, department, empRole } = req.body;

        const splitName = name.split(" ");
        const existingUser = await Employee.findOne({ email });

        if (existingUser) {
            res.status(400);
            throw new Error("Employee already exists!!!");
        }

        // const empId = generateEmpId();
        const employee = await Employee.create({
            fName: splitName[0],
            mName: splitName.length === 3 ? splitName[1] : "",
            lName:
                splitName.length === 3
                    ? splitName[2]
                    : splitName.length === 2
                    ? splitName[1]
                    : "",
            email,
            mobile,
            department,
            empRole,
            empId,
        });
        if (employee) {
            return res.status(201).json({
                success: true,
                message: "Employee has been added!!",
            });
        }
    } else {
        // If user is not an HR, deny access
        res.status(403);
        throw new Error("Not authorized to add employees");
    }
});

// @desc Auth user & get token
// @route POST /api/hr/login
// @access Public
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const hr = await HR.findOne({ email });
    if (hr && (await hr.matchPassword(password))) {
        generateToken(res, hr._id);

        res.status(200).json({
            _id: hr._id,
            name: `${hr.fName}${hr.mName && ` ${hr.mName}`}${
                hr.lName && ` ${hr.lName}`
            }`,
            email: hr.email,
            empRole: hr.empRole,
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// @desc Register HR
// @route POST /api/hr/add
//@access Private
export const addHR = asyncHandler(async (req, res) => {
    if (req.role && req.role === "HR") {
        const { empId, name, email, password, confPassword, mobile, empRole } =
            req.body;

        const splitName = name.split(" ");
        const existingHR = await HR.findOne({ email });

        if (existingHR) {
            res.status(400);
            throw new Error("HR already exists!!!");
        }

        if (password !== confPassword) {
            res.status(400);
            throw new Error("Passwords do not match");
        }

        // const empId = generateEmpId();
        const newHR = await HR.create({
            fName: splitName[0],
            mName: splitName.length === 3 ? splitName[1] : "",
            lName:
                splitName.length === 3
                    ? splitName[2]
                    : splitName.length === 2
                    ? splitName[1]
                    : "",
            email,
            password,
            mobile,
            empRole,
            empId,
        });
        if (newHR) {
            generateToken(res, newHR._id);
            return res.status(201).json({
                _id: newHR._id,
                name: `${newHR.fName}${newHR.mName && ` ${newHR.mName}`}${
                    newHR.lName && ` ${newHR.lName}`
                }`,
                email: newHR.email,
                empRole: newHR.empRole,
            });
        }
    } else {
        // If user is not an HR, deny access
        res.status(403);
        throw new Error("Not authorized to register employees");
    }
});

// @desc Logout Employee / clear cookie
// @route POST /api/hr/logout
// @access Private
export const logout = (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" });
};

// @desc Get all employees
// @route GET /api/employee/
// @access Private
export const getAllEmployees = asyncHandler(async (req, res) => {
    if (req.role === "HR") {
        const employees = await Employee.find({});
        return res.json(employees);
    }
});

// @desc Get a particular employee
// @route GET /api/employee/:id
// @access Private
export const getAnEmployee = asyncHandler(async (req, res) => {
    let employeeId;

    if (req.params.id === "me") {
        employeeId = req.employee._id.toString();
    } else {
        employeeId = req.params.id;
    }

    const employee = await Employee.findOne({ _id: employeeId }).select(
        "-password"
    );

    if (employee) {
        return res.json(employee);
    }
    res.stauts(400);
    throw new Error("Employee not found!!");
});

// @desc Get a HR profile
// @route GET /api/hr/profile/:id
// @access Private
export const getHRProfile = asyncHandler(async (req, res) => {
    let employeeId = req.hr._id.toString();
    const hr = await HR.findOne({ _id: employeeId }).select("-password");

    if (hr) {
        return res.json(hr);
    }
    res.stauts(400);
    throw new Error("HR not found!!");
});
