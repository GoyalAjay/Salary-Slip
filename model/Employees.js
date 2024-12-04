import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
    {
        empId: {
            type: String,
            required: true,
            unique: true,
        },
        fName: {
            type: String,
            required: true,
        },
        mName: {
            type: String,
        },
        lName: {
            type: String,
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
        department: {
            type: String,
        },
        empRole: {
            type: String,
        },
        dateOfJoining: {
            type: Date,
        },
        base: { type: Number, default: 0 },
        accountNo: {
            type: String,
        },
        ifscCode: {
            type: String,
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
