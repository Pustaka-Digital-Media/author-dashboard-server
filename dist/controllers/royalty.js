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
        const startDate = new Date(fyDates[0]);
        const endDateOld = new Date(fyDates[1]);
        const endDate = new Date(endDateOld.getTime() + Math.abs(endDateOld.getTimezoneOffset() * 60000));
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
                kobo: null,
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
                pustakaOnlineWhatsapp: null,
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
                            gte: startDate,
                            lte: endDate,
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
                            gte: startDate,
                            lte: endDate,
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
                                gte: startDate,
                                lte: endDate,
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
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    });
                    channelData["scribd"] = scribdEarnings._sum.converted_inr;
                    channelData["total"] += scribdEarnings._sum.converted_inr;
                    const koboEarnings = await prisma.kobo_transaction.aggregate({
                        _sum: {
                            paid_inr: true,
                        },
                        where: {
                            author_id: authorId,
                            copyright_owner: copyrightOwner,
                            transaction_date: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    });
                    channelData["kobo"] = koboEarnings._sum.paid_inr;
                    channelData["total"] += koboEarnings._sum.paid_inr;
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
                            gte: startDate,
                            lte: endDate,
                        },
                        type_of_book: bookType.id,
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
                            gte: startDate,
                            lte: endDate,
                        },
                        type_of_book: bookType.id,
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
                            gte: startDate,
                            lte: endDate,
                        },
                        type_of_book: bookType.id,
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
                            gte: startDate,
                            lte: endDate,
                        },
                        order_type: {
                            in: bookTypeData.id,
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
            "Kobo",
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
        const startDate = new Date(fyDates[0]);
        const endDateOld = new Date(fyDates[1]);
        const endDate = new Date(endDateOld.getTime() + Math.abs(endDateOld.getTimezoneOffset() * 60000));
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
                            gte: startDate,
                            lte: endDate,
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
                            gte: startDate,
                            lte: endDate,
                        },
                        type_of_book: bookType.id,
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
                            gte: startDate,
                            lte: endDate,
                        },
                        type_of_book: bookType.id,
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
                            gte: startDate,
                            lte: endDate,
                        },
                        type_of_book: bookType.id,
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
                                gte: startDate,
                                lte: endDate,
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
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    });
                    channelData[bookType.name] += scribdEarnings._sum.converted_inr;
                    channelData["total"] += scribdEarnings._sum.converted_inr;
                }
                {
                    const koboEarnings = await prisma.kobo_transaction.aggregate({
                        _sum: {
                            paid_inr: true,
                        },
                        where: {
                            author_id: authorId,
                            copyright_owner: copyrightOwner,
                            transaction_date: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    });
                    channelData[bookType.name] += koboEarnings._sum.paid_inr;
                    channelData["total"] += koboEarnings._sum.paid_inr;
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
                                gte: startDate,
                                lte: endDate,
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
                        gte: startDate,
                        lte: endDate,
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
    var _a, _b, _c, _d;
    const authorId = parseInt(req.body.authorId);
    const copyrightOwner = parseInt(req.body.copyrightOwner);
    const typeId = parseInt(req.body.typeId);
    const monthKey = req.body.monthKey;
    const result = {};
    const channelData = {};
    let bookType = {};
    if (typeId === 1) {
        bookType = globals_1.BOOK_TYPES[0];
    }
    else {
        bookType = globals_1.BOOK_TYPES[1];
    }
    const dateParse = await (0, getMonthsForFy_1.parseMonthString)(monthKey);
    const fyDates = dateParse.split(",");
    const dateFormatConfig = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };
    if (typeId !== 4) {
        {
            const pustakaEarnings = await prisma.author_transaction.findMany({
                select: {
                    book_final_royalty_value_inr: true,
                    converted_book_final_royalty_value_inr: true,
                    order_date: true,
                    order_type: true,
                    pay_status: true,
                    book: {
                        select: {
                            book_title: true,
                            language_tbl_relation: {
                                select: {
                                    language_name: true,
                                },
                            },
                        },
                    },
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
            channelData["pustaka"] = {};
            channelData["pustaka"]["title"] = "Pustaka";
            channelData["pustaka"]["headers"] = [
                "Order Date",
                "Title",
                "Language",
                "Purchase Type",
                "Royalty",
                "Status",
            ];
            channelData["pustaka"]["totalEarnings"] = 0;
            channelData["pustaka"]["data"] = [];
            for (const dataItem of pustakaEarnings) {
                const insertItem = {
                    orderDate: new Date(dataItem.order_date).toLocaleDateString("en-US", dateFormatConfig),
                    title: dataItem.book.book_title,
                    language: dataItem.book.language_tbl_relation.language_name,
                    purchaseType: dataItem.order_type,
                    royalty: (dataItem.book_final_royalty_value_inr +
                        dataItem.converted_book_final_royalty_value_inr).toFixed(2),
                    status: dataItem.pay_status === "O" ? "Pending" : "Paid",
                };
                channelData["pustaka"]["data"].push(insertItem);
                channelData["pustaka"]["totalEarnings"] += parseInt(insertItem.royalty);
            }
        }
        {
            const amazonEarnings = await prisma.amazon_transactions.findMany({
                select: {
                    final_royalty_value: true,
                    invoice_date: true,
                    units_purchased: true,
                    payment_currency: true,
                    status: true,
                    book: {
                        select: {
                            book_title: true,
                            language_tbl_relation: {
                                select: {
                                    language_name: true,
                                },
                            },
                        },
                    },
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
                channelData["amazon"] = {};
                channelData["amazon"]["title"] = "Amazon";
                channelData["amazon"]["headers"] = [
                    "Order Date",
                    "Title",
                    "Language",
                    "Units",
                    "Currency",
                    "Royalty",
                    "Status",
                ];
                channelData["amazon"]["totalEarnings"] = 0;
                channelData["amazon"]["data"] = [];
                for (const dataItem of amazonEarnings) {
                    const insertItem = {
                        orderDate: new Date(dataItem.invoice_date).toLocaleDateString("en-US", dateFormatConfig),
                        title: dataItem.book.book_title,
                        language: dataItem.book.language_tbl_relation.language_name,
                        units: dataItem.units_purchased,
                        currency: dataItem.payment_currency,
                        royalty: dataItem.final_royalty_value.toFixed(2),
                        status: dataItem.status === "R" ? "Pending" : "Paid",
                    };
                    channelData["amazon"]["data"].push(insertItem);
                    channelData["amazon"]["totalEarnings"] += parseInt(insertItem.royalty);
                }
            }
            else {
                const audibleEarnings = await prisma.audible_transactions.findMany({
                    select: {
                        final_royalty_value: true,
                        transaction_date: true,
                        status: true,
                        book: {
                            select: {
                                book_title: true,
                                language_tbl_relation: {
                                    select: {
                                        language_name: true,
                                    },
                                },
                            },
                        },
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
                channelData["audible"] = {};
                channelData["audible"]["title"] = "Audible";
                channelData["audible"]["headers"] = [
                    "Order Date",
                    "Title",
                    "Language",
                    "Royalty",
                    "Status",
                ];
                channelData["audible"]["totalEarnings"] = 0;
                channelData["audible"]["data"] = [];
                for (const dataItem of audibleEarnings) {
                    const insertItem = {
                        orderDate: new Date(dataItem.transaction_date).toLocaleDateString("en-US", dateFormatConfig),
                        title: dataItem.book.book_title,
                        language: dataItem.book.language_tbl_relation.language_name,
                        royalty: (_a = dataItem.final_royalty_value) === null || _a === void 0 ? void 0 : _a.toFixed(2),
                        status: dataItem.status === "O" ? "Pending" : "Paid",
                    };
                    channelData["audible"]["data"].push(insertItem);
                    channelData["audible"]["totalEarnings"] += parseInt(insertItem.royalty);
                }
            }
        }
        {
            if (bookType.id === 1) {
                const scribdEarnings = await prisma.scribd_transaction.findMany({
                    select: {
                        converted_inr: true,
                        Payout_month: true,
                        status: true,
                        book: {
                            select: {
                                book_title: true,
                                language_tbl_relation: {
                                    select: {
                                        language_name: true,
                                    },
                                },
                            },
                        },
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
                channelData["scribd"] = {};
                channelData["scribd"]["title"] = "Scribd";
                channelData["scribd"]["headers"] = [
                    "Order Date",
                    "Title",
                    "Language",
                    "Royalty",
                    "Status",
                ];
                channelData["scribd"]["totalEarnings"] = 0;
                channelData["scribd"]["data"] = [];
                for (const dataItem of scribdEarnings) {
                    const insertItem = {
                        orderDate: new Date(dataItem.Payout_month).toLocaleDateString("en-US", dateFormatConfig),
                        title: dataItem.book.book_title,
                        language: dataItem.book.language_tbl_relation.language_name,
                        royalty: dataItem.converted_inr.toFixed(2),
                        status: dataItem.status === "O" ? "Pending" : "Paid",
                    };
                    channelData["scribd"]["data"].push(insertItem);
                    channelData["scribd"]["totalEarnings"] += parseInt(insertItem.royalty);
                }
            }
        }
        {
            const googleEarnings = await prisma.google_transactions.findMany({
                select: {
                    final_royalty_value: true,
                    transaction_date: true,
                    status: true,
                    book: {
                        select: {
                            book_title: true,
                            language_tbl_relation: {
                                select: {
                                    language_name: true,
                                },
                            },
                        },
                    },
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
            channelData["google"] = {};
            channelData["google"]["title"] = "Google Books";
            channelData["google"]["headers"] = [
                "Order Date",
                "Title",
                "Language",
                "Royalty",
                "Status",
            ];
            channelData["google"]["totalEarnings"] = 0;
            channelData["google"]["data"] = [];
            for (const dataItem of googleEarnings) {
                const insertItem = {
                    orderDate: new Date(dataItem.transaction_date).toLocaleDateString("en-US", dateFormatConfig),
                    title: dataItem.book.book_title,
                    language: dataItem.book.language_tbl_relation.language_name,
                    royalty: dataItem.final_royalty_value.toFixed(2),
                    status: dataItem.status === "O" ? "Pending" : "Paid",
                };
                channelData["google"]["data"].push(insertItem);
                channelData["google"]["totalEarnings"] += parseInt(insertItem.royalty);
            }
        }
        {
            const storytelEarnings = await prisma.storytel_transactions.findMany({
                select: {
                    final_royalty_value: true,
                    transaction_date: true,
                    status: true,
                    book: {
                        select: {
                            book_title: true,
                            language_tbl_relation: {
                                select: {
                                    language_name: true,
                                },
                            },
                        },
                    },
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
            channelData["storytel"] = {};
            channelData["storytel"]["title"] = "Storytel";
            channelData["storytel"]["headers"] = [
                "Order Date",
                "Title",
                "Language",
                "Royalty",
                "Status",
            ];
            channelData["storytel"]["totalEarnings"] = 0;
            channelData["storytel"]["data"] = [];
            for (const dataItem of storytelEarnings) {
                const insertItem = {
                    orderDate: new Date(dataItem.transaction_date).toLocaleDateString("en-US", dateFormatConfig),
                    title: dataItem.book.book_title,
                    language: dataItem.book.language_tbl_relation.language_name,
                    royalty: (_b = dataItem.final_royalty_value) === null || _b === void 0 ? void 0 : _b.toFixed(2),
                    status: dataItem.status === "O" ? "Pending" : "Paid",
                };
                channelData["storytel"]["data"].push(insertItem);
                channelData["storytel"]["totalEarnings"] += parseInt(insertItem.royalty);
            }
        }
        {
            const overdriveEarnings = await prisma.overdrive_transactions.findMany({
                select: {
                    final_royalty_value: true,
                    transaction_date: true,
                    status: true,
                    book: {
                        select: {
                            book_title: true,
                            language_tbl_relation: {
                                select: {
                                    language_name: true,
                                },
                            },
                        },
                    },
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
            channelData["overdrive"] = {};
            channelData["overdrive"]["title"] = "Overdrive";
            channelData["overdrive"]["headers"] = [
                "Order Date",
                "Title",
                "Language",
                "Royalty",
                "Status",
            ];
            channelData["overdrive"]["totalEarnings"] = 0;
            channelData["overdrive"]["data"] = [];
            for (const dataItem of overdriveEarnings) {
                const insertItem = {
                    orderDate: new Date(dataItem.transaction_date).toLocaleDateString("en-US", dateFormatConfig),
                    title: dataItem.book.book_title,
                    language: dataItem.book.language_tbl_relation.language_name,
                    royalty: dataItem.final_royalty_value.toFixed(2),
                    status: dataItem.status === "O" ? "Pending" : "Paid",
                };
                channelData["overdrive"]["data"].push(insertItem);
                channelData["overdrive"]["totalEarnings"] += parseInt(insertItem.royalty);
            }
        }
        {
            if (bookType.id === 1) {
                const koboEarnings = await prisma.kobo_transaction.findMany({
                    select: {
                        paid_inr: true,
                        transaction_date: true,
                        status: true,
                        book: {
                            select: {
                                book_title: true,
                                language_tbl_relation: {
                                    select: {
                                        language_name: true,
                                    },
                                },
                            },
                        },
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
                channelData["kobo"] = {};
                channelData["kobo"]["title"] = "Kobo";
                channelData["kobo"]["headers"] = [
                    "Order Date",
                    "Title",
                    "Language",
                    "Royalty",
                    "Status",
                ];
                channelData["kobo"]["totalEarnings"] = 0;
                channelData["kobo"]["data"] = [];
                for (const dataItem of koboEarnings) {
                    const insertItem = {
                        orderDate: new Date(dataItem.transaction_date).toLocaleDateString("en-US", dateFormatConfig),
                        title: dataItem.book.book_title,
                        language: dataItem.book.language_tbl_relation.language_name,
                        royalty: dataItem.paid_inr.toFixed(2),
                        status: dataItem.status === "O" ? "Pending" : "Paid",
                    };
                    channelData["kobo"]["data"].push(insertItem);
                    channelData["kobo"]["totalEarnings"] += parseInt(insertItem.royalty);
                }
            }
        }
    }
    else {
        {
            const pustakaOnlineWhatsappEarnings = await prisma.author_transaction.findMany({
                select: {
                    book_final_royalty_value_inr: true,
                    converted_book_final_royalty_value_inr: true,
                    order_date: true,
                    order_type: true,
                    order_id: true,
                    comments: true,
                    pay_status: true,
                    book: {
                        select: {
                            book_id: true,
                            book_title: true,
                            language_tbl_relation: {
                                select: {
                                    language_name: true,
                                },
                            },
                        },
                    },
                },
                where: {
                    author_id: authorId,
                    copyright_owner: copyrightOwner,
                    order_date: {
                        gte: new Date(fyDates[0]),
                        lte: new Date(fyDates[1]),
                    },
                    order_type: {
                        in: ["7", "10"],
                    },
                },
            });
            channelData["pustakaOnlineWhatsapp"] = {};
            channelData["pustakaOnlineWhatsapp"]["title"] =
                "Pustaka - Online/WhatsApp";
            channelData["pustakaOnlineWhatsapp"]["headers"] = [
                "Order Date",
                "Title",
                "Quantity",
                "Purchase Type",
                "Royalty",
                "Remarks",
                "Status",
            ];
            channelData["pustakaOnlineWhatsapp"]["totalEarnings"] = 0;
            channelData["pustakaOnlineWhatsapp"]["data"] = [];
            for (const dataItem of pustakaOnlineWhatsappEarnings) {
                const quantityData = await prisma.pod_order_details.findFirst({
                    select: {
                        quantity: true,
                    },
                    where: {
                        order_id: dataItem.order_id,
                        book_id: dataItem.book.book_id,
                    },
                });
                const insertItem = {
                    orderDate: new Date(dataItem.order_date).toLocaleDateString("en-US", dateFormatConfig),
                    title: dataItem.book.book_title,
                    quantity: quantityData === null || quantityData === void 0 ? void 0 : quantityData.quantity,
                    purchaseType: dataItem.order_type,
                    royalty: (dataItem.book_final_royalty_value_inr +
                        dataItem.converted_book_final_royalty_value_inr).toFixed(2),
                    remarks: dataItem.comments,
                    status: dataItem.pay_status === "O" ? "Pending" : "Paid",
                };
                channelData["pustakaOnlineWhatsapp"]["data"].push(insertItem);
                channelData["pustakaOnlineWhatsapp"]["totalEarnings"] += parseInt(insertItem.royalty);
            }
        }
        {
            const pustakaBookFairEarnings = await prisma.author_transaction.findMany({
                select: {
                    book_final_royalty_value_inr: true,
                    converted_book_final_royalty_value_inr: true,
                    order_id: true,
                    order_date: true,
                    comments: true,
                    pay_status: true,
                },
                where: {
                    author_id: authorId,
                    copyright_owner: copyrightOwner,
                    order_date: {
                        gte: new Date(fyDates[0]),
                        lte: new Date(fyDates[1]),
                    },
                    order_type: {
                        in: ["9"],
                    },
                },
            });
            channelData["pustakaBookFair"] = {};
            channelData["pustakaBookFair"]["title"] = "Pustaka - Online/WhatsApp";
            channelData["pustakaBookFair"]["headers"] = [
                "Order Date",
                "Title",
                "Quantity",
                "Price",
                "Royalty",
                "Status",
            ];
            channelData["pustakaBookFair"]["totalEarnings"] = 0;
            channelData["pustakaBookFair"]["data"] = [];
            for (const dataItem of pustakaBookFairEarnings) {
                const bookData = await prisma.pod_bookfair.findMany({
                    select: {
                        quantity: true,
                        price: true,
                        final_royalty_value: true,
                        book: {
                            select: {
                                book_title: true,
                            },
                        },
                    },
                    where: {
                        order_id: dataItem.order_id,
                    },
                });
                for (const bookItem of bookData) {
                    const insertItem = {
                        orderDate: new Date(dataItem.order_date).toLocaleDateString("en-US", dateFormatConfig),
                        title: bookItem.book.book_title,
                        quantity: bookItem.quantity,
                        price: (_c = bookItem.price) === null || _c === void 0 ? void 0 : _c.toFixed(2),
                        royalty: (_d = bookItem.final_royalty_value) === null || _d === void 0 ? void 0 : _d.toFixed(2),
                        status: dataItem.pay_status === "O" ? "Pending" : "Paid",
                    };
                    channelData["pustakaBookFair"]["data"].push(insertItem);
                    channelData["pustakaBookFair"]["totalEarnings"] += parseInt(insertItem.royalty);
                }
            }
        }
        {
            const amazonEarnings = await prisma.author_transaction.findMany({
                select: {
                    book_final_royalty_value_inr: true,
                    converted_book_final_royalty_value_inr: true,
                    order_date: true,
                    order_type: true,
                    order_id: true,
                    comments: true,
                    pay_status: true,
                    book: {
                        select: {
                            book_id: true,
                            book_title: true,
                            language_tbl_relation: {
                                select: {
                                    language_name: true,
                                },
                            },
                        },
                    },
                },
                where: {
                    author_id: authorId,
                    copyright_owner: copyrightOwner,
                    order_date: {
                        gte: new Date(fyDates[0]),
                        lte: new Date(fyDates[1]),
                    },
                    order_type: {
                        in: ["11"],
                    },
                },
            });
            channelData["amazon"] = {};
            channelData["amazon"]["title"] = "Amazon";
            channelData["amazon"]["headers"] = [
                "Order Date",
                "Title",
                "Royalty",
                "Remarks",
                "Status",
            ];
            channelData["amazon"]["totalEarnings"] = 0;
            channelData["amazon"]["data"] = [];
            for (const dataItem of amazonEarnings) {
                const insertItem = {
                    orderDate: new Date(dataItem.order_date).toLocaleDateString("en-US", dateFormatConfig),
                    title: dataItem.book.book_title,
                    royalty: (dataItem.book_final_royalty_value_inr +
                        dataItem.converted_book_final_royalty_value_inr).toFixed(2),
                    remarks: dataItem.comments,
                    status: dataItem.pay_status === "O" ? "Pending" : "Paid",
                };
                channelData["amazon"]["data"].push(insertItem);
                channelData["amazon"]["totalEarnings"] += parseInt(insertItem.royalty);
            }
        }
    }
    res.json(channelData);
};
exports.getPaymentsForMonth = getPaymentsForMonth;
//# sourceMappingURL=royalty.js.map