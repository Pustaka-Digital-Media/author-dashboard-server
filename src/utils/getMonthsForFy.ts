import { PrismaClient } from "@prisma/client";

interface FyMonth {
  start: string;
  end: string;
  key: string;
}

const prisma = new PrismaClient();

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

  for (let i = 0; i < months.length; i++) {
    const monthData = months[i].split("-");
    const month = monthData[0];
    const numberOfDays = monthData[1];

    const dates: any = {};

    if (i > 8) {
      dates.start = `${fyYears[1]}-${month}-01`;
      dates.end = `${fyYears[1]}-${month}-${numberOfDays}`;

      const dateObj = new Date(dates.start);
      dates.key = dateObj.toLocaleString("en-us", {
        month: "long",
        year: "numeric",
      });
    } else {
      dates.start = `${fyYears[0]}-${month}-01`;
      dates.end = `${fyYears[0]}-${month}-${numberOfDays}`;

      const dateObj = new Date(dates.start);
      dates.key = dateObj.toLocaleString("en-us", {
        month: "long",
        year: "numeric",
      });
    }

    result.push(dates);
  }

  console.log(result);
  return result;
};

export default getMonthsForFy;
