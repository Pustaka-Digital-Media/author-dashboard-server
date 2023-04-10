"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextSettlement = exports.getRecentSettlements = exports.getSettlementDashboardData = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getSettlementDashboardData = async (req, res) => {
    const authorId = req.body.authorId;
    const copyrightOwner = req.body.copyrightOwner;
    const result = {};
    const finyears = await prisma.site_config.findMany({
        where: {
            category: {
                equals: "FY",
            },
        },
    });
    for (let i = 0; i < finyears.length; i++) {
        const finYear = finyears[i];
        console.log(finYear);
        const fyDates = finYear.value.split(",");
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
exports.getSettlementDashboardData = getSettlementDashboardData;
const getRecentSettlements = async (req, res) => {
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
exports.getRecentSettlements = getRecentSettlements;
const getNextSettlement = async (req, res) => {
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
exports.getNextSettlement = getNextSettlement;
//# sourceMappingURL=settlement.js.map