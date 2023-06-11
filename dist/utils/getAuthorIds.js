"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAuthorIds = async (copyrightOwner) => {
    const copyrightOwnerInt = parseInt(copyrightOwner);
    const authorIds = await prisma.copyright_mapping.findMany({
        where: {
            copyright_owner: copyrightOwnerInt,
            author: {
                status: {
                    equals: "1",
                },
            },
        },
        select: {
            author_id: true,
            author: {
                select: {
                    status: true,
                },
            },
        },
    });
    const result = [];
    for (let i = 0; i < authorIds.length; i++) {
        const authorIdData = authorIds[i];
        result.push(authorIdData.author_id);
    }
    return result;
};
exports.default = getAuthorIds;
//# sourceMappingURL=getAuthorIds.js.map