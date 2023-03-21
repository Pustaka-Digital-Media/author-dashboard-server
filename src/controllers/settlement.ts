import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Year {
  year_name: string;
}

export const getSettlementDashboardData = async (
  req: Request,
  res: Response
) => {
  const authorId = req.body.authorId;
  const copyrightOwner = req.body.copyrightOwner;
  const result: any = {};

  const years: Year[] =
    await prisma.$queryRaw`SELECT CASE WHEN MONTH(settlement_date)>=5 THEN
      concat('FY ', YEAR(settlement_date), '-',YEAR(settlement_date)+1) 
      ELSE concat('FY ', (YEAR(settlement_date)-1), '-',YEAR(settlement_date)) END AS year_name
    FROM 
      royalty_settlement 
    WHERE
      author_id = ${authorId}
    and copy_right_owner_id = ${copyrightOwner}
    GROUP BY year_name
    ORDER BY settlement_date DESC`;

  for (let i = 0; i < years.length; i++) {
    const year = years[i].year_name;
    let fyStartDate = "";
    let fyEndDate = "";

    if (year === "FY 2022-2023") {
      fyStartDate = "2022-05-01";
      fyEndDate = "2023-04-30";
    } else if (year === "FY 2021-2022") {
      fyStartDate = "2021-05-01";
      fyEndDate = "2022-04-30";
    } else if (year === "FY 2020-2021") {
      fyStartDate = "2020-05-01";
      fyEndDate = "2021-04-30";
    } else if (year === "FY 2019-2020") {
      fyStartDate = "2020-05-01";
      fyEndDate = "2019-04-30";
    } else if (year === "FY 2018-2019") {
      fyStartDate = "2018-05-01";
      fyEndDate = "2019-04-30";
    } else if (year === "FY 2017-20218") {
      fyStartDate = "2017-05-01";
      fyEndDate = "2018-04-30";
    } else if (year === "FY 2016-2017") {
      fyStartDate = "2016-05-01";
      fyEndDate = "2017-04-30";
    } else if (year === "FY 2015-2016") {
      fyStartDate = "2015-05-01";
      fyEndDate = "2016-04-30";
    } else if (year === "FY 2014-2015") {
      fyStartDate = "2014-05-01";
      fyEndDate = "2015-04-30";
    }

    (BigInt.prototype as any).toJSON = function () {
      const int = Number.parseInt(this.toString());
      return int ?? this.toString();
    };

    const settlementData = await prisma.$queryRaw`SELECT
      settlement_amount,
      YEAR(settlement_date) AS year_name,
      DATE_FORMAT(settlement_date, '%d %b, %Y') AS settlement_date,
      tds_amount,
      comments,
      payment_type,
      bank_transaction_details
    FROM
      royalty_settlement
    WHERE
      author_id = ${authorId}
    and copy_right_owner_id = ${copyrightOwner}
      AND settlement_date > ${fyStartDate}
      AND settlement_date < ${fyEndDate}
    ORDER BY royalty_settlement.settlement_date`;

    result[year] = settlementData;
  }

  res.json(result);
};
