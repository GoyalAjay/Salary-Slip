import SalarySlip from "../model/SalarySlip";

// Validate and calculate salary data.
// salaryData - Array of salary objects.
// Array of validated and calculated salary objects.
export const validateAndCalculateSalaries = (salaryData) => {
    return salaryData.map((data) => {
        const payPerDay = data.baseSalary / data.numberOfDays;
        const deductions = data.effectiveLeaves * payPerDay;
        const inHandSalary = data.baseSalary - deductions;

        return {
            ...data,
            payPerDay: parseFloat(payPerDay.toFixed(3)),
            deductions: parseFloat(deductions.toFixed(3)),
            inHandSalary: parseFloat(inHandSalary.toFixed(3)),
        };
    });
};

/**
 * Bulk inserts salary data into MongoDB.
 * @param {Array} salaryData - Array of salary objects.
 * @returns {Promise<Array>} - Array of inserted documents.
 */
export const bulkInsertSalaries = async (salaryData) => {
    const validatedData = validateAndCalculateSalaries(salaryData);
    return await SalarySlip.insertMany(validatedData);
};
