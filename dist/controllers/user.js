"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const client_1 = require("@prisma/client");
const md5_1 = __importDefault(require("md5"));
const getAuthorIds_1 = __importDefault(require("../utils/getAuthorIds"));
const getAuthorName_1 = __importDefault(require("../utils/getAuthorName"));
const prisma = new client_1.PrismaClient();
const login = async (req, res) => {
    const userData = req.body;
    const authorUser = await prisma.users_tbl.findFirst({
        where: {
            email: userData.email,
            password: (0, md5_1.default)(userData.password),
            user_type: "2",
        },
        select: {
            user_id: true,
        },
    });
    const authorIdData = [];
    const authorIds = await (0, getAuthorIds_1.default)(authorUser.user_id.toString());
    for (let i = 0; i < authorIds.length; i++) {
        const authorId = authorIds[i];
        const authorName = await (0, getAuthorName_1.default)(authorId);
        authorIdData.push({
            author_id: authorId,
            author_name: authorName,
        });
    }
    if (authorUser) {
        res.json({
            status: 1,
            copyrightOwner: authorUser.user_id,
            authorIds: authorIdData,
        });
    }
    else {
        res.json({ status: 0 });
    }
};
exports.login = login;
//# sourceMappingURL=user.js.map