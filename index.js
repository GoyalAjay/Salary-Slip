import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"; // Import cors
import connectDB from "./config/db.js";
import "dotenv/config.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import adminRouter from "./routes/AdminRouter.js";
import hrRouter from "./routes/HrRouter.js";
import employeeRouter from "./routes/EmployeeRouter.js";
import morgan from "morgan";

const PORT = process.env.PORT || 8080;
connectDB();

const app = express();

// Middleware
// CORS configuration
var corsOption = {
    origin: [
        "http://localhost:3000",
        "https://salary-slip-frontend-cdrxe1bxe-ajay-goyals-projects.vercel.app",
        "https://salary-slip-frontend-ajay-goyals-projects.vercel.app",
        "https://salary-slip-frontend.vercel.app",
        "https://salary-slip-frontend-git-main-ajay-goyals-projects.vercel.app",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOption));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //cookie parser middlerware

// Logging middleware
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
    res.send("API is running.......");
});

app.use("/api/admin", adminRouter); //Use the admin routes
app.use("/api/employee", employeeRouter); // Use the employee routes
app.use("/api/hr", hrRouter); // Use the HR routes

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
