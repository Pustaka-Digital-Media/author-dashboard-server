"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_1 = require("../controllers/books");
const router = express_1.default.Router();
router.post("/getGenreGraphData", books_1.getGenreGraphData);
router.post("/getLanguageGraphData", books_1.getLanguageGraphData);
router.post("/prepareBooksPublishedPagination", books_1.prepareBooksPublishedPagination);
router.post("/getPaginatedPublishedBooks", books_1.getPaginatedPublishedBooks);
router.post("/getBooksPublishedGraphData", books_1.getBooksPublishedGraphData);
router.post("/prepareGiftBooksPagination", books_1.prepareGiftBooksPagination);
router.post("/getPaginatedGiftBooks", books_1.getPaginatedGiftBooks);
router.post("/getGiftBookDetails", books_1.getGiftBookDetails);
exports.default = router;
//# sourceMappingURL=books.js.map