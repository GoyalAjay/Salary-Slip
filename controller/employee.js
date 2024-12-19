import asyncHandler from "../middleware/asyncHandler.js";
// import Admin from "../models/Admin.js";
import Employee from "../model/Employees.js";
import HR from "../model/HR.js";
import { generateToken } from "../utils/generateToken.js";

// @desc Add Employee
// @route POST /api/employee/add
//@access Private
export const addEmployees = asyncHandler(async (req, res) => {
    if (req.activeRole && req.activeRole === "admin") {
        const {
            empId,
            name,
            email,
            mobile,
            companyName,
            department,
            empRole,
            doj,
            totalNoOfLeaves,
            noOfLeavesThisMonth,
            totalNoOfPresents,
            noOfPresentsThisMonth,
            base,
            accountNo,
            ifscCode,
        } = req.body;

        const existingUser = await Employee.findOne({ email });

        if (existingUser) {
            res.status(400);
            throw new Error("Employee already exists!!!");
        }

        // const empId = generateEmpId();
        const employee = await Employee.create({
            empId,
            fullName: name,
            email,
            mobile,
            companyName,
            department,
            empRole,
            dateOfJoining: doj,
            totalNoOfLeaves,
            noOfLeavesThisMonth,
            totalNoOfPresents,
            noOfPresentsThisMonth,
            base,
            accountNo,
            ifscCode,
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
    // if (req.role && req.role === "HR") {
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
    // } else {
    //     // If user is not an HR, deny access
    //     res.status(403);
    //     throw new Error("Not authorized to register employees");
    // }
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
    const employeesGroupedByCompany = await Employee.aggregate([
        {
            $group: {
                _id: "$companyName", // Group by the company field
                employees: { $push: "$$ROOT" }, // Push the entire document to the group
            },
        },
        {
            $project: {
                _id: 0, // Exclude _id field from the result
                company: "$_id", // Rename _id to company
                employees: 1, // Include the employees array
            },
        },
    ]);

    // Send the grouped data as an array
    return res.json(employeesGroupedByCompany);
});

// @desc Get a particular employee
// @route GET /api/employee/:id
// @access Private
export const getAnEmployee = asyncHandler(async (req, res) => {
    let { empId } = req.params;

    // if (req.params.id === "me") {
    //     employeeId = req.employee._id.toString();
    // } else {
    //     employeeId = req.params.id;
    // }

    const employee = await Employee.findOne({ empId: empId });

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
    let id = req.hr._id.toString();
    const hr = await HR.findOne({ _id: id }).select("-password");

    if (hr) {
        return res.json(hr);
    }
    res.stauts(400);
    throw new Error("HR not found!!");
});

// @desc Update the attendance
// @route PATCH /api/admin/update-attendance/:empId
// @access Private
export const attendanceUpdate = asyncHandler(async (req, res) => {
    if (req.activeRole === "admin") {
        let { empId } = req.params;
        const { attendanceStatus } = req.body;

        const employee = await Employee.findOne({ empId: empId });
        if (!employee) {
            res.status(404);
            throw new Error("No Employee found!!");
        }

        // Check if the month has changed
        const currentMonth = new Date().getMonth();
        const lastUpdatedMonth = new Date(employee.lastUpdated).getMonth();

        if (currentMonth !== lastUpdatedMonth) {
            // Reset working days count if it's a new month
            employee.noOfPresentsThisMonth = 0;
            employee.noOfLeavesThisMonth = 0;
        }

        // Check the current `today` status and reverse its effects
        switch (employee.today) {
            case "present":
                employee.totalNoOfPresents -= 1;
                employee.noOfPresentsThisMonth -= 1;
                break;
            case "absent":
                employee.totalNoOfLeaves -= 1;
                employee.noOfLeavesThisMonth -= 1;
                break;
            // case "halfDay":
            //     employee.totalNoOfHalfDays -= 1;
            //     employee.noOfHalfDaysThisMonth -= 1;
            //     break;
            default:
                break; // No action if `today` is empty or invalid
        }

        // Update the employee's attendance based on the new status
        employee.today = attendanceStatus;
        switch (attendanceStatus) {
            case "present":
                employee.totalNoOfPresents += 1;
                employee.noOfPresentsThisMonth += 1;
                break;
            case "absent":
                employee.totalNoOfLeaves += 1;
                employee.noOfLeavesThisMonth += 1;
                break;
            // case "halfDay":
            //     employee.totalNoOfHalfDays += 1;
            //     employee.noOfHalfDaysThisMonth += 1;
            //     break;
            default:
                employee.today = ""; // Clear today if invalid status
                break;
        }

        // Update the last updated date
        employee.lastUpdated = new Date().toISOString();

        await employee.save();
        res.json({ success: true });
    }
    res.status(401);
    throw new Error("Unauthorized!!");
});
