"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchEmails = void 0;
const imap_simple_1 = __importDefault(require("imap-simple"));
const imapConfig_1 = require("../lib/imapConfig");
const config = imapConfig_1.imapConfig;
const fetchEmails = async (email, password) => {
    console.log(email, password);
    config.imap.user = email;
    config.imap.password = password;
    try {
        const connection = await imap_simple_1.default.connect({ imap: config.imap });
        await connection.openBox('INBOX');
        const searchCriteria = ['ALL'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT', ''],
            struct: true
        };
        const messages = await connection.search(searchCriteria, fetchOptions);
        const emails = await Promise.all(messages.map(async (message) => {
            const headerPart = message.parts.find(part => part.which === 'HEADER');
            const textPart = message.parts.find(part => part.which === 'TEXT');
            if (!headerPart || !headerPart.body) {
                throw new Error('Header part not found');
            }
            const emailBody = textPart ? textPart.body : 'No body';
            return {
                id: message.attributes.uid + email,
                sender: headerPart.body.from ? headerPart.body.from[0] : 'Unknown sender',
                receiver: email,
                subject: headerPart.body.subject ? headerPart.body.subject[0] : 'No subject',
                body: emailBody,
                date: headerPart.body.date ? headerPart.body.date[0] : 'Unknown date',
            };
        }));
        await connection.end();
        return emails;
    }
    catch (error) {
        console.error('Error fetching emails:', error);
        throw error;
    }
};
exports.fetchEmails = fetchEmails;
//# sourceMappingURL=fetch-imap.js.map