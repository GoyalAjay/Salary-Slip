import xlsx from "xlsx";
import path from "path";
import fs from "fs";

/**
 * Generates an Excel file from salary data.
 * @param {Array} salaryData - Array of salary objects.
 * @returns {String} - Path to the generated Excel file.
 */
export const generateExcelFile = (data) => {
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Salaries");

    // Format the file name and path
    const timestamp = Date.now();
    const fileName = `salary_slips_${timestamp}.xlsx`;
    const filePath = path.join("exports", fileName);

    // Ensure the exports directory exists
    if (!fs.existsSync("exports")) {
        fs.mkdirSync("exports");
    }

    xlsx.writeFile(workbook, filePath);
    return filePath;
};

export const getSalarySlips = async (startDate, endDate) => {
    const filter = {};
    if (startDate && endDate) {
        filter.createdAt = {
            $gte: new Date(startDate), // Start date
            $lte: new Date(endDate), // End date
        };
    }

    return await SalarySlip.find(filter)
        .populate("employee") // Populate employee fields
        .sort({ createdAt: -1 }); // Sort by newest first
};
