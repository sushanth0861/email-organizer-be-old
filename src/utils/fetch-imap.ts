import imapSimple from 'imap-simple';
import { imapConfig } from '../lib/imapConfig';
import { simpleParser } from 'mailparser';

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

// (async () => {
//     const emails = await fetchEmails('test111@sxa4991.uta.cloud', ',mCkIz,?5!P0');
//     console.log(emails);
// })();

// const compareMails = (mailsFromImao: any, : any) => {
//     for (const email of emails) {
//         const existingEmail = await prisma.email.findUnique({
//           where: { id: email.id },
//         });
  
//         if (!existingEmail) {
//           await prisma.email.create({
//             data: {
//               id: email.id,
//               sender: email.sender,
//               reciver: email.receiver,
//               subject: email.subject,
//               body: email.body,
//               email_time_stamp: new Date(email.date),
//               orignal_email_id: email.receiver,
//               read: false,
//             },
//           });
  
//           await prisma.cate
    
// }