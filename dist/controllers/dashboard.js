"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionStatusSummary = exports.getChannelBooks = exports.getBasicDetails = void 0;
const client_1 = require("@prisma/client");
const getAuthorInfo_1 = require("../utils/getAuthorInfo");
const globals_1 = require("../utils/globals");
const prisma = new client_1.PrismaClient();
const getBasicDetails = async (req, res) => {
    const authorId = parseInt(req.body.authorId);
    let authorData = { ebooks: {}, audiobooks: {}, paperback: {} };
    const authorName = await (0, getAuthorInfo_1.getAuthorName)(authorId);
    authorData.authorName = authorName;
    const authorEbookCount = await prisma.book_tbl.count({
        where: {
            author_name: authorId,
            type_of_book: 1,
        },
    });
    const authorEbookPages = await prisma.book_tbl.aggregate({
        _sum: {
            number_of_page: true,
        },
        where: {
            author_name: authorId,
            type_of_book: 1,
        },
    });
    authorData.ebooks.count = authorEbookCount;
    authorData.ebooks.pages = authorEbookPages._sum.number_of_page;
    const authorAudiobookCount = await prisma.book_tbl.count({
        where: {
            author_name: authorId,
            type_of_book: 3,
        },
    });
    const authorAudiobookPages = await prisma.book_tbl.aggregate({
        _sum: {
            number_of_page: true,
        },
        where: {
            author_name: authorId,
            type_of_book: 3,
        },
    });
    authorData.audiobooks.count = authorAudiobookCount;
    authorData.audiobooks.pages = authorAudiobookPages._sum.number_of_page || 0;
    const authorPaperbackCount = await prisma.book_tbl.count({
        where: {
            author_name: authorId,
            type_of_book: 1,
            paper_back_flag: 1,
        },
    });
    const authorPaperbackPages = await prisma.book_tbl.aggregate({
        _sum: {
            number_of_page: true,
        },
        where: {
            author_name: authorId,
            type_of_book: 1,
            paper_back_flag: 1,
        },
    });
    authorData.paperback.count = authorPaperbackCount;
    authorData.paperback.pages = authorPaperbackPages._sum.number_of_page || 0;
    res.json({
        name: authorName,
        data: authorData,
    });
};
exports.getBasicDetails = getBasicDetails;
const getChannelBooks = async (req, res) => {
    const authorId = parseInt(req.body.authorId);
    const includeTypes = req.body.includeTypes || [1, 3, 4];
    let booksData = {};
    booksData["ebooks"] = {};
    booksData["audiobooks"] = {};
    booksData["paperback"] = {};
    const authorName = await (0, getAuthorInfo_1.getAuthorName)(authorId);
    const channelLinks = await (0, getAuthorInfo_1.getAuthorChannelLinks)(authorId);
    if (includeTypes.includes(1)) {
        const pustakaEBooksCount = await prisma.book_tbl.count({
            where: {
                author_name: authorId,
                type_of_book: 1,
            },
        });
        booksData["ebooks"]["pustaka"] = {};
        booksData["ebooks"]["pustaka"]["name"] = "Pustaka";
        booksData["ebooks"]["pustaka"]["count"] = pustakaEBooksCount;
        booksData["ebooks"]["pustaka"]["image_url"] = globals_1.S3_URL + "/pustaka-icon.svg";
        booksData["ebooks"]["pustaka"]["url"] =
            globals_1.PUSTAKA_URL + "/home/author/" + (channelLinks === null || channelLinks === void 0 ? void 0 : channelLinks.url_name);
        const scribdBooksCount = await prisma.scribd_books.count({
            where: {
                author_id: authorId,
                book: {
                    type_of_book: 1,
                },
            },
        });
        booksData["ebooks"]["scribd"] = {};
        booksData["ebooks"]["scribd"]["name"] = "Scribd";
        booksData["ebooks"]["scribd"]["count"] = scribdBooksCount;
        booksData["ebooks"]["scribd"]["image_url"] = globals_1.S3_URL + "/scrib-icon.svg";
        booksData["ebooks"]["scribd"]["url"] = channelLinks === null || channelLinks === void 0 ? void 0 : channelLinks.scribd_link;
        const pratilipiBooksCount = await prisma.pratilipi_books.count({
            where: {
                author_id: authorId,
            },
        });
        booksData["ebooks"]["pratilipi"] = {};
        booksData["ebooks"]["pratilipi"]["name"] = "Pratilipi";
        booksData["ebooks"]["pratilipi"]["count"] = pratilipiBooksCount;
        booksData["ebooks"]["pratilipi"]["image_url"] =
            globals_1.S3_URL + "/pratilipi-icon.png";
        booksData["ebooks"]["pratilipi"]["url"] = channelLinks === null || channelLinks === void 0 ? void 0 : channelLinks.pratilipi_link;
        booksData["ebooks"]["odilo"] = {};
        booksData["ebooks"]["odilo"]["name"] = "Odilo";
        booksData["ebooks"]["odilo"]["count"] = 0;
        booksData["ebooks"]["odilo"]["image_url"] = globals_1.S3_URL + "/odilo-icon.svg";
        booksData["ebooks"]["odilo"]["url"] = channelLinks === null || channelLinks === void 0 ? void 0 : channelLinks.odilo_link;
    }
    if (includeTypes.includes(3)) {
        const pustakaAudiobooksCount = await prisma.book_tbl.count({
            where: {
                author_name: authorId,
                type_of_book: 3,
            },
        });
        booksData["audiobooks"]["pustaka"] = {};
        booksData["audiobooks"]["pustaka"]["name"] = "Pustaka";
        booksData["audiobooks"]["pustaka"]["count"] = pustakaAudiobooksCount;
        booksData["audiobooks"]["pustaka"]["image_url"] =
            globals_1.S3_URL + "/pustaka-icon.svg";
        booksData["audiobooks"]["pustaka"]["url"] =
            globals_1.PUSTAKA_URL + "/home/author/" + (channelLinks === null || channelLinks === void 0 ? void 0 : channelLinks.url_name);
        booksData["audiobooks"]["pratilipiFM"] = {};
        booksData["audiobooks"]["pratilipiFM"]["name"] = "Pratilipi FM";
        booksData["audiobooks"]["pratilipiFM"]["count"] = 0;
        booksData["audiobooks"]["pratilipiFM"]["image_url"] =
            globals_1.S3_URL + "/pratilipi-icon.png";
        booksData["audiobooks"]["pratilipiFM"]["url"] =
            channelLinks === null || channelLinks === void 0 ? void 0 : channelLinks.pratilipi_link;
    }
    if (includeTypes.includes(4)) {
        const paperbackCount = await prisma.book_tbl.count({
            where: {
                author_name: authorId,
                paper_back_flag: 1,
            },
        });
        booksData["paperback"]["pustaka"] = {};
        booksData["paperback"]["pustaka"]["name"] = "Pustaka";
        booksData["paperback"]["pustaka"]["count"] = paperbackCount;
        booksData["paperback"]["pustaka"]["image_url"] =
            globals_1.S3_URL + "/pustaka-icon.svg";
        booksData["paperback"]["amazon"] = {};
        booksData["paperback"]["amazon"]["name"] = "Amazon";
        booksData["paperback"]["amazon"]["count"] = 0;
        booksData["paperback"]["amazon"]["image_url"] =
            globals_1.S3_URL + "/amazon-paperback-icon.svg";
        booksData["paperback"]["flipkart"] = {};
        booksData["paperback"]["flipkart"]["name"] = "Flipkart";
        booksData["paperback"]["flipkart"]["count"] = 0;
        booksData["paperback"]["flipkart"]["image_url"] =
            globals_1.S3_URL + "/flipkart-icon.svg";
    }
    for (let i = 0; i < globals_1.BOOK_TYPES.length; i++) {
        const bookType = globals_1.BOOK_TYPES[i];
        if (includeTypes.includes(bookType.id)) {
            if (bookType.id === 3) {
                const audibleBooksCount = await prisma.audible_books.count({
                    where: {
                        author_id: authorId,
                        book: {
                            type_of_book: bookType.id,
                        },
                    },
                });
                booksData[bookType.name]["audible"] = {};
                booksData[bookType.name]["audible"]["name"] = "Audible";
                booksData[bookType.name]["audible"]["count"] = audibleBooksCount;
                booksData[bookType.name]["audible"]["image_url"] =
                    globals_1.S3_URL + "/audible-icon.svg";
                booksData[bookType.name]["audible"]["url"] = channelLinks === null || channelLinks === void 0 ? void 0 : channelLinks.audible_link;
            }
            else {
                const amazonBooksCount = await prisma.amazon_books.count({
                    where: {
                        author_id: authorId,
                        book: {
                            type_of_book: bookType.id,
                        },
                    },
                });
                booksData[bookType.name]["amazon"] = {};
                booksData[bookType.name]["amazon"]["name"] = "Amazon";
                booksData[bookType.name]["amazon"]["count"] = amazonBooksCount;
                booksData[bookType.name]["amazon"]["image_url"] =
                    globals_1.S3_URL + "/amazon-icon.svg";
                booksData[bookType.name]["amazon"]["url"] = channelLinks === null || channelLinks === void 0 ? void 0 : channelLinks.amazon_link;
            }
            const googleBooksCount = await prisma.google_books.count({
                where: {
                    author_id: authorId,
                    book: {
                        type_of_book: bookType.id,
                    },
                },
            });
            booksData[bookType.name]["google"] = {};
            booksData[bookType.name]["google"]["name"] = "Google Books";
            booksData[bookType.name]["google"]["count"] = googleBooksCount;
            booksData[bookType.name]["google"]["image_url"] =
                globals_1.S3_URL + "/google-books-icon.svg";
            booksData[bookType.name]["google"]["url"] =
                channelLinks === null || channelLinks === void 0 ? void 0 : channelLinks.googlebooks_link;
            const storytelBooksCount = await prisma.storytel_books.count({
                where: {
                    author_id: authorId,
                    book: {
                        type_of_book: bookType.id,
                    },
                },
            });
            booksData[bookType.name]["storytel"] = {};
            booksData[bookType.name]["storytel"]["name"] = "StoryTel";
            booksData[bookType.name]["storytel"]["count"] = storytelBooksCount;
            booksData[bookType.name]["storytel"]["image_url"] =
                globals_1.S3_URL + "/storytel-icon.svg";
            booksData[bookType.name]["storytel"]["url"] = channelLinks === null || channelLinks === void 0 ? void 0 : channelLinks.storytel_link;
            const overdriveBooksCount = await prisma.overdrive_books.count({
                where: {
                    author_id: authorId,
                    book: {
                        type_of_book: bookType.id,
                    },
                },
            });
            booksData[bookType.name]["overdrive"] = {};
            booksData[bookType.name]["overdrive"]["name"] = "Overdrive";
            booksData[bookType.name]["overdrive"]["count"] = overdriveBooksCount;
            booksData[bookType.name]["overdrive"]["image_url"] =
                globals_1.S3_URL + "/overdrive-icon.svg";
            booksData[bookType.name]["overdrive"]["url"] =
                channelLinks === null || channelLinks === void 0 ? void 0 : channelLinks.overdrive_link;
        }
    }
    res.json({
        name: authorName,
        data: booksData,
    });
};
exports.getChannelBooks = getChannelBooks;
const getTransactionStatusSummary = async (req, res) => {
    const authorId = parseInt(req.body.authorId);
    let transactionData = {};
    transactionData["paid"] = {
        ebooks: 0,
        audiobooks: 0,
        paperback: 0,
    };
    transactionData["pending"] = {
        ebooks: 0,
        audiobooks: 0,
        paperback: 0,
    };
    const authorName = await (0, getAuthorInfo_1.getAuthorName)(authorId);
    for (let i = 0; i < globals_1.TRANSACTION_STATUS.length; i++) {
        const transactionDetails = globals_1.TRANSACTION_STATUS[i];
        const amountData = await prisma.author_transaction.aggregate({
            _sum: {
                book_final_royalty_value_inr: true,
            },
            where: {
                pay_status: {
                    equals: transactionDetails.status,
                },
                book: {
                    type_of_book: {
                        equals: 1,
                    },
                },
                copyright_owner: authorId,
            },
        });
        transactionData[transactionDetails.name]["ebooks"] +=
            amountData._sum.book_final_royalty_value_inr;
    }
    for (let i = 0; i < globals_1.TRANSACTION_STATUS.length; i++) {
        const transactionDetails = globals_1.TRANSACTION_STATUS[i];
        const amountData = await prisma.scribd_transaction.aggregate({
            _sum: {
                converted_inr: true,
            },
            where: {
                status: {
                    equals: transactionDetails.status,
                },
                book: {
                    type_of_book: {
                        equals: 1,
                    },
                },
                copyright_owner: authorId,
            },
        });
        transactionData[transactionDetails.name]["ebooks"] +=
            amountData._sum.converted_inr;
    }
    for (let i = 0; i < globals_1.TRANSACTION_STATUS.length; i++) {
        const transactionDetails = globals_1.TRANSACTION_STATUS[i];
        const amountData = await prisma.author_transaction.aggregate({
            _sum: {
                book_final_royalty_value_inr: true,
            },
            where: {
                pay_status: {
                    equals: transactionDetails.status,
                },
                order_type: {
                    in: ["6", "9"],
                },
                copyright_owner: authorId,
            },
        });
        transactionData[transactionDetails.name]["paperback"] +=
            amountData._sum.book_final_royalty_value_inr;
    }
    for (let i = 0; i < globals_1.BOOK_TYPES.length; i++) {
        const bookType = globals_1.BOOK_TYPES[i];
        if (bookType.id === 3) {
            for (let i = 0; i < globals_1.TRANSACTION_STATUS.length; i++) {
                const transactionDetails = globals_1.TRANSACTION_STATUS[i];
                const amountData = await prisma.audible_transactions.aggregate({
                    _sum: {
                        final_royalty_value: true,
                    },
                    where: {
                        status: {
                            equals: transactionDetails.status,
                        },
                        book: {
                            type_of_book: {
                                equals: 3,
                            },
                        },
                        copyright_owner: authorId,
                    },
                });
                transactionData[transactionDetails.name]["audiobooks"] +=
                    amountData._sum.final_royalty_value;
            }
        }
        else {
            for (let i = 0; i < globals_1.TRANSACTION_STATUS.length; i++) {
                const transactionDetails = globals_1.TRANSACTION_STATUS[i];
                const amountData = await prisma.amazon_transactions.aggregate({
                    _sum: {
                        final_royalty_value: true,
                    },
                    where: {
                        status: {
                            equals: transactionDetails.status === "O" ? "R" : "P",
                        },
                        book: {
                            type_of_book: {
                                equals: 1,
                            },
                        },
                        copyright_owner: authorId,
                    },
                });
                transactionData[transactionDetails.name]["ebooks"] +=
                    amountData._sum.final_royalty_value;
            }
        }
        for (let i = 0; i < globals_1.TRANSACTION_STATUS.length; i++) {
            const transactionDetails = globals_1.TRANSACTION_STATUS[i];
            const amountData = await prisma.google_transactions.aggregate({
                _sum: {
                    final_royalty_value: true,
                },
                where: {
                    status: {
                        equals: transactionDetails.status,
                    },
                    book: {
                        type_of_book: {
                            equals: bookType.id,
                        },
                    },
                    copyright_owner: authorId,
                },
            });
            transactionData[transactionDetails.name][bookType.name] +=
                amountData._sum.final_royalty_value;
        }
        for (let i = 0; i < globals_1.TRANSACTION_STATUS.length; i++) {
            const transactionDetails = globals_1.TRANSACTION_STATUS[i];
            const amountData = await prisma.storytel_transactions.aggregate({
                _sum: {
                    final_royalty_value: true,
                },
                where: {
                    status: {
                        equals: transactionDetails.status,
                    },
                    book: {
                        type_of_book: {
                            equals: bookType.id,
                        },
                    },
                    copyright_owner: authorId,
                },
            });
            transactionData[transactionDetails.name][bookType.name] +=
                amountData._sum.final_royalty_value;
        }
        for (let i = 0; i < globals_1.TRANSACTION_STATUS.length; i++) {
            const transactionDetails = globals_1.TRANSACTION_STATUS[i];
            const amountData = await prisma.overdrive_transactions.aggregate({
                _sum: {
                    final_royalty_value: true,
                },
                where: {
                    status: {
                        equals: transactionDetails.status,
                    },
                    book: {
                        type_of_book: {
                            equals: bookType.id,
                        },
                    },
                    copyright_owner: authorId,
                },
            });
            transactionData[transactionDetails.name][bookType.name] +=
                amountData._sum.final_royalty_value;
        }
    }
    res.json({
        name: authorName,
        data: transactionData,
    });
};
exports.getTransactionStatusSummary = getTransactionStatusSummary;
//# sourceMappingURL=dashboard.js.map