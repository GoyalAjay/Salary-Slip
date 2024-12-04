import asyncHandler from "../middleware/asyncHandler.js";
import SalarySlip from "../model/SalarySlip.js";
import Employee from "../model/Employees.js";

// Validate and calculate salary data.
// salaryData - Array of salary objects.
// Array of validated and calculated salary objects.
const validateAndCalculateSalaries = (salaryData) => {
    return salaryData.map((data) => {
        const payPerDay = data.baseSalary / data.numberOfDays;
        const deductions = data.effectiveLeaves * payPerDay;
        const inHandSalary = data.baseSalary - deductions;

        // Add calculated fields
        return {
            ...data,
            payPerDay: parseFloat(payPerDay.toFixed(3)),
            deductions: parseFloat(deductions.toFixed(3)),
            inHandSalary: parseFloat(inHandSalary.toFixed(3)),
        };
    });
};

// @desc Create salary slip
// @route POST /api/salary-slip/:employeeId
// @access Private
export const salarySlip = asyncHandler(async (req, res) => {
    const salaryData = req.body;

    const salaryInHand = payPerDay * workingDays - deductions;

    const insertedData = await Salary.insertMany(salaryData);

    const newSalarySlip = await SalarySlip.create({
        employee: employeeId,
        baseSalary,
        payPerDay,
        inHandSalary,
        accountNo,
        ifscCode,
    });
    return res.json({ newSalarySlip });
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
