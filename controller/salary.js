import asyncHandler from "../middleware/asyncHandler.js";
import SalarySlip from "../model/SalarySlip.js";
import Employee from "../model/Employees.js";
import {
    validateAndCalculateSalaries,
    generateExcelFile,
    getSalarySlips,
} from "../utils/excelUtils.js";

// @desc Create salary slip
// @route POST /api/salary-slip/
// @access Private
export const salarySlip = asyncHandler(async (req, res) => {
    const salaryData = req.body;

    const data = validateAndCalculateSalaries(salaryData);

    const insertedData = await SalarySlip.insertMany(data);
    return res.json({ insertedData });
});

// @desc Fetch employee details
// @route POST /api/employee/:empId
// @access Private
export const fetchEmployeeDetails = asyncHandler(async (req, res) => {
    const { empId } = req.params;

    const employee = await Employee.findOne({ empId: empId });

    if (!employee) {
        res.status(404);
        throw new Error("No employee found!!");
    }

    return res.json({ employee: employee });
});

// @desc Fetch employee details
// @route POST /api/employee/:empId
// @access Private
export const salarySlipExport = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    const salarySlips = await getSalarySlips(startDate, endDate);

    const filePath = generateExcelFile(
        salarySlips.map((slip) => ({
            "Employee Id": `${slip.employee.empId}`,
            Name: `${slip.employee.fName}${
                slip.employee.mName && ` ${slip.employee.mName}`
            }${slip.employee.lName && ` ${slip.employee.lName}`}`,
            "Date Of Joining": `${slip.employee.dateOfJoining}`,
            "Number Of Days": `${slip.numberOfDays}`,
            "Working Days": slip.workingDays,
            "Effective Leaves": slip.effectiveLeaves,
            "Base Salary": slip.baseSalary,
            "Pay Per Day": slip.payPerDay,
            Deductions: slip.deductions,
            "In Hand Salary": slip.inHandSalary,
            "A/C No.": slip.accountNo,
            "IFSC Code": slip.ifscCode,
            "Created At": slip.createdAt,
        }))
    );
    res.download(filePath, (err) => {
        if (err) {
            console.error("Error while sending the file: ", err);
            res.status(500).send("Failed to download the file.");
        }
    });
});
