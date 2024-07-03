import imapSimple from 'imap-simple';
import { imapConfig } from '../lib/imapConfig';

const config = imapConfig
export const fetchEmails = async (email: string, password: string) => {
    console.log(email,password)
    config.imap.user = email;
    config.imap.password = password;

    try {
        const connection = await imapSimple.connect({ imap: config.imap });
        await connection.openBox('INBOX');

        const searchCriteria = ['ALL'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT', ''],
            struct: true
        };

        const messages = await connection.search(searchCriteria, fetchOptions);

        const emails = await Promise.all(
            messages.map(async (message) => {
                const headerPart = message.parts.find(part => part.which === 'HEADER');
                const textPart = message.parts.find(part => part.which === 'TEXT');

                if (!headerPart || !headerPart.body) {
                    throw new Error('Header part not found');
                }

                const emailBody = textPart ? textPart.body : 'No body';

                return {
                    id: message.attributes.uid+email,
                    sender: headerPart.body.from ? headerPart.body.from[0] : 'Unknown sender',
                    receiver: email,
                    subject: headerPart.body.subject ? headerPart.body.subject[0] : 'No subject',
                    body: emailBody,
                    date: headerPart.body.date ? headerPart.body.date[0] : 'Unknown date',
                };
            })
        );

        await connection.end();
        return emails;
    } catch (error) {
        console.error('Error fetching emails:', error);
        throw error;
    }
};
