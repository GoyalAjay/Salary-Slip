// Helper function for date comparison
export const isSameDay = (recordDate, comparisonDate) => {
    const recordDayStart = new Date(
        new Date(recordDate).setUTCHours(0, 0, 0, 0)
    );
    const comparisonDayStart = new Date(
        new Date(comparisonDate).setUTCHours(0, 0, 0, 0)
    );

    return recordDayStart.getTime() === comparisonDayStart.getTime();
};
