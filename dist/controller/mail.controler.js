"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveMail = exports.markRead = exports.markUnread = exports.deleteMail = exports.sendMail = void 0;
const nodemailer = require("nodemailer");
const db_1 = require("../lib/db");
const library_1 = require("@prisma/client/runtime/library");
const mail_service_1 = require("./mail.service");
const transporter = nodemailer.createTransport({
    host: "mail.sxa4991.uta.cloud",
    port: 465,
    secure: true,
    auth: {
        user: "smtpserver@sxa4991.uta.cloud",
        pass: ",mCkIz,?5!P0",
    },
});
const sendMail = async (req, res) => {
    try {
        const { user_id, from, to, subject, text } = req.body;
        const mailOptions = to.map((to) => ({
            from: from,
            to: to,
            subject: subject,
            text: text,
        }));
        console.log("mailOptions: ", mailOptions);
        for (let i = 0; i < mailOptions.length; i++) {
            const mailOption = mailOptions[i];
            console.log("mailOption: ", mailOption);
            await transporter.sendMail(mailOption, async function (error, info) {
                if (error) {
                    return res.status(500).send(error.toString());
                }
                //save sent mail in database
                try {
                    console.log("before settin in db: ", {
                        sender: from,
                        reciver: mailOption.to,
                        subject: subject,
                        body: text,
                        orignal_email_id: from,
                        read: false,
                        star: false
                    });
                    await db_1.prisma.email.create({
                        data: {
                            sender: from,
                            reciver: mailOption.to,
                            subject: subject,
                            body: text,
                            orignal_email_id: from,
                            read: false,
                            star: false
                        }
                    });
                }
                catch (e) {
                    console.log(e);
                }
                // res.status(200).send("Email sent: " + info.response);
            });
        }
        if (req.body.draft_id) {
            await db_1.prisma.draft.delete({
                where: {
                    id: req.body.draft_id
                }
            });
        }
        // Create the email entry in the database
        res.status(201).json({ message: "Mail sent and saved successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.sendMail = sendMail;
const deleteMail = async (req, res) => {
    const { mail_id } = req.body;
    try {
        await db_1.prisma.email.delete({
            where: { id: mail_id },
        });
        res.status(200).json({
            success: true,
            message: "Mail deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting mail:", error);
        if (error instanceof library_1.PrismaClientKnownRequestError) {
            // Handle specific Prisma errors
            if (error.code === "P2025") {
                return res.status(404).json({
                    success: false,
                    message: "Mail not found",
                });
            }
        }
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
exports.deleteMail = deleteMail;
const markUnread = async (req, res) => {
    const { mail_id } = req.body;
    try {
        await db_1.prisma.email.update({
            where: {
                id: mail_id,
            },
            data: {
                read: false,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.markUnread = markUnread;
const markRead = async (req, res) => {
    const { mail_id } = req.body;
    try {
        await db_1.prisma.email.update({
            where: {
                id: mail_id,
            },
            data: {
                read: true,
            },
        });
        res.status(200).json({ message: "Mail marked as read successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.markRead = markRead;
const moveMail = async (req, res) => {
    const { mail_id, user_id, from, to } = req.body;
    try {
        const result = await (0, mail_service_1.updateMailCategory)(user_id, mail_id, from, to);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(`Error moving mail from ${from} to ${to}:`, error);
        res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
};
exports.moveMail = moveMail;
//# sourceMappingURL=mail.controler.js.map