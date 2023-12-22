"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthorChannelLinks = exports.getAuthorName = void 0;
const client_1 = require("@prisma/client");
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
exports.getAuthorName = getAuthorName;
const getAuthorChannelLinks = async (authorId) => {
    const authorChannelData = await prisma.author_tbl.findFirst({
        where: {
            author_id: authorId,
        },
        select: {
            url_name: true,
            amazon_link: true,
            scribd_link: true,
            audible_link: true,
            storytel_link: true,
            overdrive_link: true,
            googlebooks_link: true,
            pratilipi_link: true,
        },
    });
    if (authorChannelData) {
        return authorChannelData;
    }
    return undefined;
};
exports.getAuthorChannelLinks = getAuthorChannelLinks;
//# sourceMappingURL=getAuthorInfo.js.map