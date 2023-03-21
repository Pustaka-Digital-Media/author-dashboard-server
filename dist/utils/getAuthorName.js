"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../generated/client");
const prisma = new client_1.PrismaClient();
const getAuthorName = async (authorId) => {
    const authorNameData = await prisma.author_tbl.findFirst({
        where: {
            author_id: authorId,
        },
        select: {
            author_name: true,
        },
    });
    if (authorNameData && authorNameData.author_name) {
        return authorNameData.author_name;
    }
    return "";
};
exports.default = getAuthorName;
//# sourceMappingURL=getAuthorName.js.map