import { PrismaClient } from "@prisma/client";

interface FyMonth {
  start: string;
  end: string;
  key: string;
}

const prisma = new PrismaClient();

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

const getMonthsForFy = async (fyYearKey: string) => {
  const result: FyMonth[] = [];
  const fyYear = await prisma.site_config.findFirst({
    where: {
      key: fyYearKey,
    },
  });

  const fyYearFull = fyYear?.value.split(",");
  const fyYears = [];

  if (fyYearFull) {
    fyYears[0] = fyYearFull[0].split("-")[0];
    fyYears[1] = fyYearFull[1].split("-")[0];
  }

  for (let i = 0; i < months.length; i++) {
    const monthData = months[i].split("-");
    const month = monthData[0];
    const numberOfDays = monthData[1];

    const dates: any = {};

    if (i > 8) {
      dates.id = i;
      dates.value = `${fyYears[1]}-${month}-01,${fyYears[1]}-${month}-${numberOfDays}`;
      const startDate = `${fyYears[1]}-${month}-01`;

      const dateObj = new Date(startDate);
      dates.key = dateObj.toLocaleString("en-us", {
        month: "long",
        year: "numeric",
      });
    } else {
      dates.id = i;
      dates.value = `${fyYears[0]}-${month}-01,${fyYears[0]}-${month}-${numberOfDays}`;
      const startDate = `${fyYears[0]}-${month}-01`;

      const dateObj = new Date(startDate);
      dates.key = dateObj.toLocaleString("en-us", {
        month: "long",
        year: "numeric",
      });
    }

    result.push(dates);
  }

  return result;
};

export const parseMonthString = async (monthStr: string) => {
  const dateObj = new Date(Date.parse(monthStr));
  const formattedDates = `${dateObj.getFullYear()}-${dateObj.getMonth()}-01,${dateObj.getFullYear()}-${dateObj.getMonth()}-31`;

  return {};
};

export default getMonthsForFy;
