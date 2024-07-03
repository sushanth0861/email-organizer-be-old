"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMailCategory = void 0;
const db_1 = require("../lib/db");
const updateMailCategory = async (user_id, mail_id, from, to) => {
    const category = await db_1.prisma.category.findFirst({
        where: { user_id },
    });
    if (!category) {
        throw new Error("User not found or no categories available.");
    }
    if (!category[from].includes(mail_id)) {
        throw new Error(`Mail is not in the ${from} category.`);
    }
    // Remove from the 'from' category
    category[from] = category[from].filter((id) => id !== mail_id);
    // Add to the 'to' category
    category[to].push(mail_id);
    await db_1.prisma.category.update({
        where: { id: category.id },
        data: {
            [from]: category[from],
            [to]: category[to],
        },
    });
    return { message: `Mail moved to ${to} successfully` };
};
exports.updateMailCategory = updateMailCategory;
//# sourceMappingURL=mail.service.js.map