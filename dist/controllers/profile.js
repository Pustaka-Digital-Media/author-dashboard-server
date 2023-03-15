"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileData = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProfileData = async (req, res) => {
    const authorId = parseInt(req.body.authorId);
    const profileData = await prisma.author_tbl.findFirst({
        where: {
            author_id: authorId,
        },
    });
    const regionalNameData = await prisma.author_language.findMany({
        where: {
            author_id: authorId,
        },
        select: {
            regional_author_name: true,
            language: {
                select: {
                    language_name: true,
                },
            },
        },
    });
    profileData.regional_name_data = regionalNameData;
    res.json(profileData);
};
exports.getProfileData = getProfileData;
//# sourceMappingURL=profile.js.map