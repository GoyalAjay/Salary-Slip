import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
    {
        empId: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        mobile: {
            type: Number,
            required: true,
        },
        companyName: {
            type: String,
            required: true,
        },
        department: {
            type: String,
        },
        empRole: {
            type: String,
        },
        dateOfJoining: {
            type: Date,
        },
        totalNoOfLeaves: {
            type: Number,
            required: true,
        },
        noOfLeavesThisMonth: {
            type: Number,
            required: true,
        },
        totalNoOfPresents: {
            type: Number,
            required: true,
        },
        noOfPresentsThisMonth: {
            type: Number,
            required: true,
        },
        today: {
            type: String,
            enum: ["", "present", "absent", "halfDay"],
        },
        base: { type: Number, default: 0 },
        accountNo: {
            type: String,
        },
        ifscCode: {
            type: String,
        },
        lastUpdated: {
            type: Date,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
