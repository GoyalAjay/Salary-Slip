import mongoose from "mongoose";
import bcrypt from "bcrypt";

const humanResourcesSchema = new mongoose.Schema(
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
        password: {
            type: String,
            required: true,
        },
        mobile: {
            type: Number,
            required: true,
        },
        empRole: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

humanResourcesSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
humanResourcesSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

const HR = mongoose.model("HR", humanResourcesSchema);
export default HR;
