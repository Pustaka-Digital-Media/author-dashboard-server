import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import getMonthsForFy from "../utils/getMonthsForFy";

const prisma = new PrismaClient();

export const getSettlementDashboardData = async (
  req: Request,
  res: Response
) => {
  const authorId = req.body.authorId;
  const copyrightOwner = req.body.copyrightOwner;
  const result: any = {};

  const finyears = await prisma.site_config.findMany({
    where: {
      category: {
        equals: "FY",
      },
    },
  });
  //const allSettlementData: any = {};
  for (let i = 0; i < finyears.length; i++) {
    const finYear = finyears[i];
    console.log(finYear);
    const fyDates: string[] = finYear.value.split(",");
    const year = fyDates[0].split("-")[0];
    let fyStartDate = fyDates[0];
    let fyEndDate = fyDates[1];
    const settlementData = await prisma.royalty_settlement.aggregate({
      _sum: {
        settlement_amount: true,
      },
      where: {
        author_id: authorId,
        copy_right_owner_id: copyrightOwner,
        settlement_date: {
          gte: new Date(fyStartDate),
          lte: new Date(fyEndDate),
        },
      },
    });
    result[year] = settlementData;
  }
  return res.json(result);
};

export const getRecentSettlements = async (req: Request, res: Response) => {
  const authorId = req.body.authorId;
  const copyrightOwner = req.body.copyrightOwner;
  const recentSettlementData = await prisma.royalty_settlement.findMany({
    where: {
      author_id: {
        equals: authorId,
      },
      copy_right_owner_id: {
        equals: copyrightOwner,
      },
    },
    orderBy: { id: "desc" },
    take: 3,
  });
  res.json(recentSettlementData);
};

export const getNextSettlement = async (req: Request, res: Response) => {
  const authorId = req.body.authorId;
  const copyrightOwner = req.body.copyrightOwner;
  const recentSettlementData = await prisma.royalty_settlement.findMany({
    where: {
      author_id: {
        equals: authorId,
      },
      copy_right_owner_id: {
        equals: copyrightOwner,
      },
    },
    orderBy: { id: "desc" },
    take: 3,
  });
  res.json(recentSettlementData);
};
