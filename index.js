import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"; // Import cors
import connectDB from "./config/db.js";
import "dotenv/config.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import hrRouter from "./routes/HrRouter.js";
import employeeRouter from "./routes/EmployeeRouter.js";

const PORT = process.env.PORT || 8080;
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //cookie parser middlerware

// CORS configuration
var corsOption = {
    origin: ["http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOption));

// Routes
app.get("/", (req, res) => {
    res.send("API is running.......");
});

app.use("/api/employee", employeeRouter); // Use the account routes
app.use("/api/hr", hrRouter); // Use the application routes

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
