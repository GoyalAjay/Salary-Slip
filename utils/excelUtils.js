import XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Generates an Excel file from salary data.
 * @param {Array} salaryData - Array of salary objects.
 * @returns {String} - Path to the generated Excel file.
 */
export const generateExcelFile = (salaryData) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
        salaryData.map((slip) => ({
            "Employee Id": `${slip.employee.fName}`,
            "Date Of Joining": `${slip.employee.dateOfJoining}`,
            "Number Of Days": `${item.numberOfDays}`,
            "Working Days": item.workingDays,
            "Effective Leaves": item.effectiveLeaves,
            "Base Salary": item.baseSalary,
            "Pay Per Day": item.payPerDay,
            Deductions: item.deductions,
            "In Hand Salary": item.inHandSalary,
            "A/C No.": item.accountNo,
            "IFSC Code": item.ifscCode,
        }))
    );

    XLSX.utils.book_append_sheet(workbook, worksheet, "Salaries");

    const filePath = path.join(
        __dirname,
        "../output",
        `salaries_${Date.now()}.xlsx`
    );
    XLSX.writeFile(workbook, filePath);
    return filePath;
};
