"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoyaltySummaryData = void 0;
const client_1 = require("@prisma/client");
const globals_1 = require("../utils/globals");
const prisma = new client_1.PrismaClient({});
const getRoyaltySummaryData = async (req, res) => {
    const authorId = parseInt(req.body.authorId);
    const result = {};
    const royaltySummary = {};
    royaltySummary["ebooks"] = {};
    royaltySummary["audiobooks"] = {};
    royaltySummary["paperback"] = {};
    royaltySummary["all"] = {};
    const dates = await prisma.site_config.findMany({
        where: {
            category: {
                equals: "FY",
            },
        },
    });
    const allChannelData = {};
    for (let j = 0; j < globals_1.BOOK_TYPES_ALL.length; j++) {
        const bookType = globals_1.BOOK_TYPES_ALL[j];
        const channelData = {};
        royaltySummary["paperback"]["data"] = {};
        for (let i = 0; i < dates.length; i++) {
            const fyData = dates[i];
            const fyDates = fyData.value.split(",");
            if (!allChannelData[fyData.key]) {
                allChannelData[fyData.key] = {};
            }
            allChannelData[fyData.key][bookType.name] = 0;
            channelData[fyData.key] = {};
            if (bookType.id === 1) {
                royaltySummary[bookType.name]["names"] = [
                    "Pustaka",
                    "Amazon",
                    "Scribd",
                    "Google Books",
                    "Storytel",
                    "Overdrive",
                ];
            }
            else {
                royaltySummary[bookType.name]["names"] = [
                    "Pustaka",
                    "Audible",
                    "Google Books",
                    "Storytel",
                    "Overdrive",
                ];
            }
            royaltySummary["all"]["names"] = ["eBooks", "Audiobooks", "Paperback"];
            royaltySummary["paperback"]["names"] = ["Pustaka"];
            {
                const pustakaEarnings = await prisma.author_transaction.aggregate({
                    _sum: {
                        book_final_royalty_value_inr: true,
                        converted_book_final_royalty_value_inr: true,
                    },
                    where: {
                        author_id: authorId,
                        order_date: {
                            gte: new Date(fyDates[0]),
                            lte: new Date(fyDates[1]),
                        },
                        order_type: {
                            in: bookType.id === 1
                                ? ["1", "2", "3"]
                                : bookType.id === 3
                                    ? ["4", "5", "6", "8"]
                                    : ["7", "9", "10", "11", "12"],
                        },
                    },
                });
                channelData[fyData.key]["pustaka"] = {};
                channelData[fyData.key]["pustaka"] =
                    (pustakaEarnings._sum.book_final_royalty_value_inr || 0) +
                        (pustakaEarnings._sum.converted_book_final_royalty_value_inr || 0);
                allChannelData[fyData.key][bookType.name] +=
                    (pustakaEarnings._sum.book_final_royalty_value_inr || 0) +
                        (pustakaEarnings._sum.converted_book_final_royalty_value_inr ||
                            0) || 0;
            }
            if (bookType.id !== 10) {
                {
                    const amazonEarnings = await prisma.amazon_transactions.aggregate({
                        _sum: {
                            final_royalty_value: true,
                        },
                        where: {
                            author_id: authorId,
                            invoice_date: {
                                gte: new Date(fyDates[0]),
                                lte: new Date(fyDates[1]),
                            },
                            book: {
                                type_of_book: bookType.id,
                            },
                        },
                    });
                    if (bookType.id === 1) {
                        channelData[fyData.key]["amazon"] = {};
                        channelData[fyData.key]["amazon"] =
                            amazonEarnings._sum.final_royalty_value;
                    }
                    else {
                        const audibleEarnings = await prisma.audible_transactions.aggregate({
                            _sum: {
                                final_royalty_value: true,
                            },
                            where: {
                                author_id: authorId,
                                transaction_date: {
                                    gte: new Date(fyDates[0]),
                                    lte: new Date(fyDates[1]),
                                },
                                book: {
                                    type_of_book: bookType.id,
                                },
                            },
                        });
                        channelData[fyData.key]["audible"] = {};
                        channelData[fyData.key]["audible"] =
                            audibleEarnings._sum.final_royalty_value;
                        allChannelData[fyData.key][bookType.name] +=
                            amazonEarnings._sum.final_royalty_value;
                    }
                    allChannelData[fyData.key][bookType.name] +=
                        amazonEarnings._sum.final_royalty_value;
                }
                {
                    if (bookType.id === 1) {
                        const scribdEarnings = await prisma.scribd_transaction.aggregate({
                            _sum: {
                                converted_inr: true,
                            },
                            where: {
                                author_id: authorId,
                                Payout_month: {
                                    gte: new Date(fyDates[0]),
                                    lte: new Date(fyDates[1]),
                                },
                                book: {
                                    type_of_book: bookType.id,
                                },
                            },
                        });
                        channelData[fyData.key]["scribd"] = {};
                        channelData[fyData.key]["scribd"] =
                            scribdEarnings._sum.converted_inr;
                        allChannelData[fyData.key][bookType.name] +=
                            scribdEarnings._sum.converted_inr;
                    }
                }
                {
                    const googleEarnings = await prisma.google_transactions.aggregate({
                        _sum: {
                            final_royalty_value: true,
                        },
                        where: {
                            author_id: authorId,
                            transaction_date: {
                                gte: new Date(fyDates[0]),
                                lte: new Date(fyDates[1]),
                            },
                            book: {
                                type_of_book: bookType.id,
                            },
                        },
                    });
                    channelData[fyData.key]["google"] = {};
                    channelData[fyData.key]["google"] =
                        googleEarnings._sum.final_royalty_value;
                    allChannelData[fyData.key][bookType.name] +=
                        googleEarnings._sum.final_royalty_value;
                }
                {
                    const storytelEarnings = await prisma.storytel_transactions.aggregate({
                        _sum: {
                            final_royalty_value: true,
                        },
                        where: {
                            author_id: authorId,
                            transaction_date: {
                                gte: new Date(fyDates[0]),
                                lte: new Date(fyDates[1]),
                            },
                            book: {
                                type_of_book: bookType.id,
                            },
                        },
                    });
                    channelData[fyData.key]["storytel"] = {};
                    channelData[fyData.key]["storytel"] =
                        storytelEarnings._sum.final_royalty_value;
                    allChannelData[fyData.key][bookType.name] +=
                        storytelEarnings._sum.final_royalty_value;
                }
                {
                    const overdriveEarnings = await prisma.overdrive_transactions.aggregate({
                        _sum: {
                            final_royalty_value: true,
                        },
                        where: {
                            author_id: authorId,
                            transaction_date: {
                                gte: new Date(fyDates[0]),
                                lte: new Date(fyDates[1]),
                            },
                            book: {
                                type_of_book: bookType.id,
                            },
                        },
                    });
                    channelData[fyData.key]["overdrive"] = {};
                    channelData[fyData.key]["overdrive"] =
                        overdriveEarnings._sum.final_royalty_value;
                    allChannelData[fyData.key][bookType.name] +=
                        overdriveEarnings._sum.final_royalty_value;
                }
            }
        }
        royaltySummary[bookType.name]["data"] = channelData;
        royaltySummary["all"]["data"] = allChannelData;
    }
    result["royaltySummary"] = royaltySummary;
    res.json(result);
};
exports.getRoyaltySummaryData = getRoyaltySummaryData;
//# sourceMappingURL=royalty.js.map