import mongoose from "mongoose";

const salarySlipSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
        },
        workingDays: {
            type: Number,
            default: 0,
        },
        numberOfDays: {
            type: Number,
            default: 0,
        },
        effectiveLeaves: {
            type: Number,
            default: 0,
        },
        baseSalary: {
            type: Number,
            default: 0,
        },
        payPerDay: {
            type: Number,
            set: (value) => {
                // Ensure the value is rounded to 3 decimal places
                return Number(value.toFixed(3));
            },
            get: (value) => {
                // Return the stored value rounded to 3 decimal places
                return Number(value.toFixed(3));
            },
        },
        deductions: {
            type: Number,
            default: 0,
        },
        inHandSalary: {
            type: Number,
            set: (value) => {
                // Ensure the value is rounded to 3 decimal places
                return Number(value.toFixed(3));
            },
            get: (value) => {
                // Return the stored value rounded to 3 decimal places
                return Number(value.toFixed(3));
            },
        },
        accountNo: {
            type: String,
        },
        ifscCode: {
            type: String,
        },
    },
    { timestamps: true }
);

const SalarySlip = mongoose.model("SalarySlip", salarySlipSchema);
export default SalarySlip;
