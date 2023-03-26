"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentsForMonth = exports.getAllChannelSummaryData = exports.getRoyaltySummaryData = void 0;
const client_1 = require("@prisma/client");
const globals_1 = require("../utils/globals");
const getMonthsForFy_1 = __importStar(require("../utils/getMonthsForFy"));
const prisma = new client_1.PrismaClient({});
const getRoyaltySummaryData = async (req, res) => {
    const authorId = parseInt(req.body.authorId);
    const copyrightOwner = parseInt(req.body.copyrightOwner);
    const typeId = parseInt(req.body.typeId);
    const type = req.body.type;
    const result = {};
    const royaltySummary = {};
    let dates = {};
    if (type === "year") {
        dates = await prisma.site_config.findMany({
            where: {
                category: {
                    equals: "FY",
                },
            },
        });
    }
    else {
        const fyYearKey = req.body.fyYearKey;
        dates = await (0, getMonthsForFy_1.default)(fyYearKey);
    }
    let bookType = {};
    if (typeId === 1) {
        bookType = globals_1.BOOK_TYPES[0];
    }
    else {
        bookType = globals_1.BOOK_TYPES[1];
    }
    for (let i = 0; i < dates.length; i++) {
        const fyData = dates[i];
        const fyDates = fyData.value.split(",");
        const channelData = {};
        channelData["total"] = 0;
        let channelDataOrder = {};
        if (typeId === 1) {
            channelDataOrder = {
                pustaka: null,
                amazon: null,
                scribd: null,
                google: null,
                storytel: null,
                overdrive: null,
                total: null,
            };
        }
        else if (typeId === 3) {
            channelDataOrder = {
                pustaka: null,
                audible: null,
                google: null,
                storytel: null,
                overdrive: null,
                total: null,
            };
        }
        else if (typeId === 4) {
            channelDataOrder = {
                pustakaOnline: null,
                pustakaBookFair: null,
                amazon: null,
                total: null,
            };
        }
        if (typeId !== 4) {
            {
                const pustakaEarnings = await prisma.author_transaction.aggregate({
                    _sum: {
                        book_final_royalty_value_inr: true,
                        converted_book_final_royalty_value_inr: true,
                    },
                    where: {
                        author_id: authorId,
                        copyright_owner: copyrightOwner,
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
                channelData["pustaka"] =
                    (pustakaEarnings._sum.book_final_royalty_value_inr || 0) +
                        (pustakaEarnings._sum.converted_book_final_royalty_value_inr || 0);
                channelData["total"] +=
                    (pustakaEarnings._sum.book_final_royalty_value_inr || 0) +
                        (pustakaEarnings._sum.converted_book_final_royalty_value_inr || 0);
            }
            {
                const amazonEarnings = await prisma.amazon_transactions.aggregate({
                    _sum: {
                        final_royalty_value: true,
                    },
                    where: {
                        author_id: authorId,
                        copyright_owner: copyrightOwner,
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
                    channelData["amazon"] = amazonEarnings._sum.final_royalty_value;
                    channelData["total"] += amazonEarnings._sum.final_royalty_value;
                }
                else {
                    const audibleEarnings = await prisma.audible_transactions.aggregate({
                        _sum: {
                            final_royalty_value: true,
                        },
                        where: {
                            author_id: authorId,
                            copyright_owner: copyrightOwner,
                            transaction_date: {
                                gte: new Date(fyDates[0]),
                                lte: new Date(fyDates[1]),
                            },
                            book: {
                                type_of_book: bookType.id,
                            },
                        },
                    });
                    channelData["audible"] = audibleEarnings._sum.final_royalty_value;
                    channelData["total"] += audibleEarnings._sum.final_royalty_value;
                }
            }
            {
                if (bookType.id === 1) {
                    const scribdEarnings = await prisma.scribd_transaction.aggregate({
                        _sum: {
                            converted_inr: true,
                        },
                        where: {
                            author_id: authorId,
                            copyright_owner: copyrightOwner,
                            Payout_month: {
                                gte: new Date(fyDates[0]),
                                lte: new Date(fyDates[1]),
                            },
                            book: {
                                type_of_book: bookType.id,
                            },
                        },
                    });
                    channelData["scribd"] = scribdEarnings._sum.converted_inr;
                    channelData["total"] += scribdEarnings._sum.converted_inr;
                }
            }
            {
                const googleEarnings = await prisma.google_transactions.aggregate({
                    _sum: {
                        final_royalty_value: true,
                    },
                    where: {
                        author_id: authorId,
                        copyright_owner: copyrightOwner,
                        transaction_date: {
                            gte: new Date(fyDates[0]),
                            lte: new Date(fyDates[1]),
                        },
                        book: {
                            type_of_book: bookType.id,
                        },
                    },
                });
                channelData["google"] = googleEarnings._sum.final_royalty_value;
                channelData["total"] += googleEarnings._sum.final_royalty_value;
            }
            {
                const storytelEarnings = await prisma.storytel_transactions.aggregate({
                    _sum: {
                        final_royalty_value: true,
                    },
                    where: {
                        author_id: authorId,
                        copyright_owner: copyrightOwner,
                        transaction_date: {
                            gte: new Date(fyDates[0]),
                            lte: new Date(fyDates[1]),
                        },
                        book: {
                            type_of_book: bookType.id,
                        },
                    },
                });
                channelData["storytel"] = storytelEarnings._sum.final_royalty_value;
                channelData["total"] += storytelEarnings._sum.final_royalty_value;
            }
            {
                const overdriveEarnings = await prisma.overdrive_transactions.aggregate({
                    _sum: {
                        final_royalty_value: true,
                    },
                    where: {
                        author_id: authorId,
                        copyright_owner: copyrightOwner,
                        transaction_date: {
                            gte: new Date(fyDates[0]),
                            lte: new Date(fyDates[1]),
                        },
                        book: {
                            type_of_book: bookType.id,
                        },
                    },
                });
                channelData["overdrive"] = overdriveEarnings._sum.final_royalty_value;
                channelData["total"] += overdriveEarnings._sum.final_royalty_value;
            }
            if (type === "year" && typeId === 3 && i >= 6) {
                royaltySummary[fyData.key] = Object.assign(channelDataOrder, channelData);
            }
            else if (type === "year" && typeId === 1) {
                royaltySummary[fyData.key] = Object.assign(channelDataOrder, channelData);
            }
            else if (type === "month") {
                royaltySummary[fyData.key] = Object.assign(channelDataOrder, channelData);
            }
        }
        else {
            for (let k = 0; k < globals_1.PAPERBACK_BOOK_TYPES.length; k++) {
                const bookTypeData = globals_1.PAPERBACK_BOOK_TYPES[k];
                const paperbackEarnings = await prisma.author_transaction.aggregate({
                    _sum: {
                        book_final_royalty_value_inr: true,
                        converted_book_final_royalty_value_inr: true,
                    },
                    where: {
                        author_id: authorId,
                        copyright_owner: copyrightOwner,
                        order_date: {
                            gte: new Date(fyDates[0]),
                            lte: new Date(fyDates[1]),
                        },
                        order_type: {
                            equals: bookTypeData.id.toString(),
                        },
                    },
                });
                channelData[bookTypeData.name] =
                    (paperbackEarnings._sum.book_final_royalty_value_inr || 0) +
                        (paperbackEarnings._sum.converted_book_final_royalty_value_inr || 0);
                channelData["total"] +=
                    (paperbackEarnings._sum.book_final_royalty_value_inr || 0) +
                        (paperbackEarnings._sum.converted_book_final_royalty_value_inr || 0);
                if (type === "year" && i >= 8) {
                    royaltySummary[fyData.key] = Object.assign(channelDataOrder, channelData);
                }
                else if (type === "month") {
                    royaltySummary[fyData.key] = Object.assign(channelDataOrder, channelData);
                }
            }
        }
    }
    result["data"] = royaltySummary;
    if (typeId === 1) {
        result["names"] = [
            "Pustaka",
            "Amazon",
            "Scribd",
            "Google Books",
            "Storytel",
            "Overdrive",
            "Total",
        ];
    }
    else if (typeId === 3) {
        result["names"] = [
            "Pustaka",
            "Audible",
            "Google Books",
            "Storytel",
            "Overdrive",
            "Total",
        ];
    }
    else {
        result["names"] = [
            "Pustaka (Online/Whatsapp)",
            "Pustaka (Book Fair)",
            "Amazon",
            "Total",
        ];
    }
    let totalEarnings = 0;
    for (const fyYear in royaltySummary) {
        totalEarnings += royaltySummary[fyYear]["total"];
    }
    result["totalEarnings"] = totalEarnings;
    res.json(result);
};
exports.getRoyaltySummaryData = getRoyaltySummaryData;
const getAllChannelSummaryData = async (req, res) => {
    const authorId = req.body.authorId;
    const copyrightOwner = req.body.copyrightOwner;
    const type = req.body.type;
    const summaryData = {};
    const result = {};
    let dates = [];
    if (type === "year") {
        dates = await prisma.site_config.findMany({
            where: {
                category: {
                    equals: "FY",
                },
            },
        });
    }
    else {
        const fyYearKey = req.body.fyYearKey;
        dates = await (0, getMonthsForFy_1.default)(fyYearKey);
    }
    for (let i = 0; i < dates.length; i++) {
        const channelData = {};
        channelData["ebooks"] = 0;
        channelData["audiobooks"] = 0;
        channelData["total"] = 0;
        const fyData = dates[i];
        const fyDates = fyData.value.split(",");
        for (let j = 0; j < globals_1.BOOK_TYPES.length; j++) {
            const bookType = globals_1.BOOK_TYPES[j];
            {
                const pustakaEarnings = await prisma.author_transaction.aggregate({
                    _sum: {
                        book_final_royalty_value_inr: true,
                        converted_book_final_royalty_value_inr: true,
                    },
                    where: {
                        author_id: authorId,
                        copyright_owner: copyrightOwner,
                        order_date: {
                            gte: new Date(fyDates[0]),
                            lte: new Date(fyDates[1]),
                        },
                        order_type: {
                            in: bookType.id === 1 ? ["1", "2", "3"] : ["4", "5", "6", "8"],
                        },
                    },
                });
                channelData[bookType.name] +=
                    (pustakaEarnings._sum.book_final_royalty_value_inr || 0) +
                        (pustakaEarnings._sum.converted_book_final_royalty_value_inr || 0);
                channelData["total"] +=
                    (pustakaEarnings._sum.book_final_royalty_value_inr || 0) +
                        (pustakaEarnings._sum.converted_book_final_royalty_value_inr || 0);
            }
            {
                const googleEarnings = await prisma.google_transactions.aggregate({
                    _sum: {
                        final_royalty_value: true,
                    },
                    where: {
                        author_id: authorId,
                        copyright_owner: copyrightOwner,
                        transaction_date: {
                            gte: new Date(fyDates[0]),
                            lte: new Date(fyDates[1]),
                        },
                        book: {
                            type_of_book: bookType.id,
                        },
                    },
                });
                channelData[bookType.name] += googleEarnings._sum.final_royalty_value;
                channelData["total"] += googleEarnings._sum.final_royalty_value;
            }
            {
                const storytelEarnings = await prisma.storytel_transactions.aggregate({
                    _sum: {
                        final_royalty_value: true,
                    },
                    where: {
                        author_id: authorId,
                        copyright_owner: copyrightOwner,
                        transaction_date: {
                            gte: new Date(fyDates[0]),
                            lte: new Date(fyDates[1]),
                        },
                        book: {
                            type_of_book: bookType.id,
                        },
                    },
                });
                channelData[bookType.name] += storytelEarnings._sum.final_royalty_value;
                channelData["total"] += storytelEarnings._sum.final_royalty_value;
            }
            {
                const overdriveEarnings = await prisma.overdrive_transactions.aggregate({
                    _sum: {
                        final_royalty_value: true,
                    },
                    where: {
                        author_id: authorId,
                        copyright_owner: copyrightOwner,
                        transaction_date: {
                            gte: new Date(fyDates[0]),
                            lte: new Date(fyDates[1]),
                        },
                        book: {
                            type_of_book: bookType.id,
                        },
                    },
                });
                channelData[bookType.name] +=
                    overdriveEarnings._sum.final_royalty_value;
                channelData["total"] += overdriveEarnings._sum.final_royalty_value;
            }
            if (bookType.id !== 3) {
                {
                    const amazonEarnings = await prisma.amazon_transactions.aggregate({
                        _sum: {
                            final_royalty_value: true,
                        },
                        where: {
                            author_id: authorId,
                            copyright_owner: copyrightOwner,
                            invoice_date: {
                                gte: new Date(fyDates[0]),
                                lte: new Date(fyDates[1]),
                            },
                            book: {
                                type_of_book: bookType.id,
                            },
                        },
                    });
                    channelData[bookType.name] += amazonEarnings._sum.final_royalty_value;
                    channelData["total"] += amazonEarnings._sum.final_royalty_value;
                }
                {
                    const scribdEarnings = await prisma.scribd_transaction.aggregate({
                        _sum: {
                            converted_inr: true,
                        },
                        where: {
                            author_id: authorId,
                            copyright_owner: copyrightOwner,
                            Payout_month: {
                                gte: new Date(fyDates[0]),
                                lte: new Date(fyDates[1]),
                            },
                            book: {
                                type_of_book: bookType.id,
                            },
                        },
                    });
                    channelData[bookType.name] += scribdEarnings._sum.converted_inr;
                    channelData["total"] += scribdEarnings._sum.converted_inr;
                }
            }
            else {
                {
                    const audibleEarnings = await prisma.audible_transactions.aggregate({
                        _sum: {
                            final_royalty_value: true,
                        },
                        where: {
                            author_id: authorId,
                            copyright_owner: copyrightOwner,
                            transaction_date: {
                                gte: new Date(fyDates[0]),
                                lte: new Date(fyDates[1]),
                            },
                            book: {
                                type_of_book: bookType.id,
                            },
                        },
                    });
                    channelData[bookType.name] +=
                        audibleEarnings._sum.final_royalty_value;
                    channelData["total"] += audibleEarnings._sum.final_royalty_value;
                }
            }
        }
        {
            const pustakaPaperbackEarnings = await prisma.author_transaction.aggregate({
                _sum: {
                    book_final_royalty_value_inr: true,
                    converted_book_final_royalty_value_inr: true,
                },
                where: {
                    author_id: authorId,
                    copyright_owner: copyrightOwner,
                    order_date: {
                        gte: new Date(fyDates[0]),
                        lte: new Date(fyDates[1]),
                    },
                    order_type: {
                        in: ["7", "9", "10", "11", "12"],
                    },
                },
            });
            channelData["paperback"] =
                (pustakaPaperbackEarnings._sum.book_final_royalty_value_inr || 0) +
                    (pustakaPaperbackEarnings._sum.converted_book_final_royalty_value_inr ||
                        0);
            channelData["total"] +=
                (pustakaPaperbackEarnings._sum.book_final_royalty_value_inr || 0) +
                    (pustakaPaperbackEarnings._sum.converted_book_final_royalty_value_inr ||
                        0);
        }
        const channelDataOrder = {
            ebooks: null,
            audiobooks: null,
            paperback: null,
            total: null,
        };
        summaryData[fyData.key] = Object.assign(channelDataOrder, channelData);
    }
    result["data"] = summaryData;
    result["names"] = ["eBooks", "Audio Books", "Paperback", "Total"];
    let totalEarnings = 0;
    for (const fyYear in summaryData) {
        totalEarnings += summaryData[fyYear]["total"] || 0;
    }
    result["totalEarnings"] = totalEarnings;
    res.json(result);
};
exports.getAllChannelSummaryData = getAllChannelSummaryData;
const getPaymentsForMonth = async (req, res) => {
    const authorId = parseInt(req.body.authorId);
    const copyrightOwner = parseInt(req.body.copyrightOwner);
    const typeId = parseInt(req.body.typeId);
    const monthKey = req.body.monthKey;
    const result = {};
    const royaltySummary = {};
    let bookType = {};
    if (typeId === 1) {
        bookType = globals_1.BOOK_TYPES[0];
    }
    else {
        bookType = globals_1.BOOK_TYPES[1];
    }
    const dateParse = await (0, getMonthsForFy_1.parseMonthString)(monthKey);
};
exports.getPaymentsForMonth = getPaymentsForMonth;
//# sourceMappingURL=royalty.js.map