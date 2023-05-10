"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLOR_PALETTE = exports.PUSTAKA_URL = exports.S3_URL = exports.TRANSACTION_STATUS = exports.PAPERBACK_BOOK_TYPES = exports.BOOK_TYPES_ALL = exports.BOOK_TYPES = void 0;
exports.BOOK_TYPES = [
    { id: 1, name: "ebooks" },
    { id: 3, name: "audiobooks" },
];
exports.BOOK_TYPES_ALL = [
    { id: 1, name: "ebooks" },
    { id: 3, name: "audiobooks" },
    { id: 10, name: "paperback" },
];
exports.PAPERBACK_BOOK_TYPES = [
    { id: ["7", "10"], name: "pustakaOnlineWhatsapp" },
    { id: ["9"], name: "pustakaBookFair" },
    { id: ["11"], name: "amazon" },
];
exports.TRANSACTION_STATUS = [
    { name: "pending", status: "O" },
    { name: "paid", status: "P" },
];
exports.S3_URL = "https://pustaka-assets.s3.ap-south-1.amazonaws.com/author-dashboard";
exports.PUSTAKA_URL = "https://pustaka.co.in";
exports.COLOR_PALETTE = [
    "#00296b",
    "#B3BFD3",
    "#454555",
    "#aaaabc",
    "#f1f1e6",
    "#767687",
];
//# sourceMappingURL=globals.js.map