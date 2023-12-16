"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMonthString = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const months = [
    "04-30",
    "05-31",
    "06-30",
    "07-31",
    "08-31",
    "09-30",
    "10-31",
    "11-30",
    "12-31",
    "01-31",
    "02-28",
    "03-31",
];
const getMonthsForFy = async (fyYearKey) => {
    const result = [];
    const fyYear = await prisma.site_config.findFirst({
        where: {
            key: fyYearKey,
        },
    });
    const prevMonthDate = await prisma.site_config.findFirst({
        where: {
            category: "prevmonth",
        },
    });
    const fyYearFull = fyYear === null || fyYear === void 0 ? void 0 : fyYear.value.split(",");
    const fyYears = [];
    if (fyYearFull) {
        fyYears[0] = fyYearFull[0].split("-")[0];
        fyYears[1] = fyYearFull[1].split("-")[0];
    }
    for (let i = 0; i < months.length; i++) {
        const monthData = months[i].split("-");
        const month = monthData[0];
        const numberOfDays = monthData[1];
        const dates = {};
        if (i > 8) {
            dates.id = i;
            dates.value = `${fyYears[1]}-${month}-01,${fyYears[1]}-${month}-${numberOfDays}`;
            const startDate = `${fyYears[1]}-${month}-01`;
            const dateObj = new Date(startDate);
            dates.key = dateObj.toLocaleString("en-us", {
                month: "long",
                year: "numeric",
            });
        }
        else {
            dates.id = i;
            dates.value = `${fyYears[0]}-${month}-01,${fyYears[0]}-${month}-${numberOfDays}`;
            const startDate = `${fyYears[0]}-${month}-01`;
            const dateObj = new Date(startDate);
            dates.key = dateObj.toLocaleString("en-us", {
                month: "long",
                year: "numeric",
            });
        }
        if (new Date(new Date(dates.value.split(",")[1])) <=
            new Date(prevMonthDate.value))
            result.push(dates);
    }
    return result;
};
const parseMonthString = async (monthStr) => {
    let dateObj = new Date(Date.parse(monthStr));
    dateObj = new Date(dateObj.setDate(dateObj.getDate() + 1));
    const formattedDates = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-01,${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-31`;
    return formattedDates;
};
exports.parseMonthString = parseMonthString;
exports.default = getMonthsForFy;
//# sourceMappingURL=getMonthsForFy.js.map